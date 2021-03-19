import React, {Dispatch, FunctionComponent, useState} from 'react';
import {connect} from 'react-redux';
import {Button, Icon, LabeledToggle, SvgPath} from "@bentley/ui-core";
import {LabelTableComponentProps} from "./LabelTable";
import {AVAILABLE_COLOR_MODES, LabelingWorkflowManager} from "../../LabelingWorkflowManager";
import {LabelingWorkflowState} from "../../store/LabelingWorkflowState";
import {LabelingWorkflowManagerSelectors} from "../../store/LabelingWorkflowSelectors";
import {MachineLearningColorMode, MachineLearningLabel} from "../../data/LabelTypes";
import {DispatchFromProps, StateFromProps} from "./ConnectedLabelTable";
import {LabelingWorkflowManagerAction, LabelingWorkflowManagerActionType} from "../../store/LabelingWorkflowActions";
import {ColorDef} from "@bentley/imodeljs-common";

const MINUTES = 1.0;

interface OwnProps extends LabelTableComponentProps {
    canUndo: boolean;
    canRedo: boolean;

    onSave(): void;

    onUndo(): void;

    onRedo(): void;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const LabelTableFooter: FunctionComponent<Props> = (props) => {

    const [timerVar, setTimerVar] = useState<undefined | NodeJS.Timeout>(undefined);

    const autoSaveEnabled = timerVar !== undefined;


    const handleAutoSaveToggle = (enable: boolean) => {

        if (enable) {
            if (timerVar !== undefined) {
                clearInterval(timerVar);
            }
            setTimerVar(setInterval(props.onSave, 60000));

        } else {
            if (timerVar !== undefined) {
                clearInterval(timerVar);
            }
            setTimerVar(undefined);
        }
    }

    let btnStyle = {
        width: '24px',
        height: '22px',
    };

    return (
        <>
            <div className="sstc-action-container">
                <Button className="sstc-control-button"
                        onClick={props.onSave}
                        disabled={!props.isDirty}>
                    <Icon iconSpec="icon-save"/>
                </Button> &nbsp;

                <div className="sstc-action-container-expand">
                    <LabeledToggle
                        label={`Auto Save (${MINUTES} min.)`}
                        isOn={autoSaveEnabled}
                        onChange={handleAutoSaveToggle}
                    />
                </div>

                <Button className="sstc-control-button"
                        onClick={props.onUndo}
                        disabled={!props.canUndo}
                        style={btnStyle}
                >
                    {/*<Icon iconSpec="icon-undo"/>*/}
                    <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                        "m16 14c0-5.2-4.2-9.3-9-9.4v-2.6l-7 5.3 7 5.3v-2.6c4.3 0 6.7 1.8 9 4"
                    ]}/>
                </Button> &nbsp;

                <Button className="sstc-control-button"
                        onClick={props.onRedo}
                        disabled={!props.canRedo}
                        style={btnStyle}
                >
                    {/*<Icon iconSpec="icon-redo"/>*/}
                    <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                        "m0 14c0-5.2 4.2-9.3 9-9.4v-2.6l7 5.3-7 5.3v-2.6c-4.3 0-6.7 1.8-9 4"
                    ]}/>
                </Button> &nbsp;
            </div>
        </>
    );
};

const mapStateToProps = (rootState: any): StateFromProps => {
    const state = rootState[LabelingWorkflowManager.stateKey] as LabelingWorkflowState | undefined;
    console.log('mapStateToProps3 => !state is state == ' + JSON.stringify(state));
    if (!state) {
        throw new Error();
    }
    return {
        ready: state.ready,
        itemMap: LabelingWorkflowManagerSelectors.mlTableData(state),
        labelTree: LabelingWorkflowManagerSelectors.treeData(state),
        canUndo: LabelingWorkflowManagerSelectors.canUndo(state),
        canRedo: LabelingWorkflowManagerSelectors.canRedo(state),
        availableColorModes: AVAILABLE_COLOR_MODES,
        currentColorMode: state.colorMode,
        isDirty: state.elementStateMapIsDirty,
        poppedOut: false,
        readyForPopout: false,
        onLabelSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectLabel(itemId);
        },
        onPredictionSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectPrediction(itemId);
        },
        onSave: LabelingWorkflowManager.saveLabels,
    };
}

const mapDispatchToProps = (dispatch: Dispatch<LabelingWorkflowManagerAction>): DispatchFromProps => ({
    onLabelExpandStateChange: (newExpanded: boolean, name: MachineLearningLabel) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
            newExpanded: newExpanded,
            label: name,
        })
    },
    onLabelColorChange: (newColor: ColorDef, name: MachineLearningLabel) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
            newColor: newColor,
            label: name,
        })
    },
    onLabelDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.TrueLabelVisibilityWasChanged,
            label: name,
            displayed: newVisible,
            transparent: newTransparent,
        });
    },
    onPredictionDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.PredLabelVisibilityWasChanged,
            label: name,
            displayed: newVisible,
            transparent: newTransparent,
        });
    },
    onLabelApply: (name: MachineLearningLabel): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.SelectionLabelWasChanged,
            label: name,
        });
    },
    onUndo: () => {
        dispatch({
            type: LabelingWorkflowManagerActionType.UndoWasRequested,
        });
    },
    onRedo: () => {
        dispatch({
            type: LabelingWorkflowManagerActionType.RedoWasRequested,
        });
    },
    onChangeColorMode: (colorMode: MachineLearningColorMode) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.ColorModeWasChanged,
            colorMode: colorMode,
        });
    },
    onSwapTruePredDisplay: () => {
        dispatch({
            type: LabelingWorkflowManagerActionType.VisiblityStatesSwapped,
        });
    },
});


// const mapStateToProps = (state: RootState) => {
//     const state = rootState[LabelingWorkflowManager.stateKey] as LabelingWorkflowState | undefined;
//     console.log('mapStateToProps3 => !state is state == ' + JSON.stringify(state));
//     if (!state) {
//         throw new Error();
//     }
//     return {
//         ready: state.ready,
//         itemMap: LabelingWorkflowManagerSelectors.mlTableData(state),
//         labelTree: LabelingWorkflowManagerSelectors.treeData(state),
//         canUndo: LabelingWorkflowManagerSelectors.canUndo(state),
//         canRedo: LabelingWorkflowManagerSelectors.canRedo(state),
//         availableColorModes: AVAILABLE_COLOR_MODES,
//         currentColorMode: state.colorMode,
//         isDirty: state.elementStateMapIsDirty,
//         poppedOut: false,
//         readyForPopout: false,
//         onLabelSelectionClick: (itemId?: MachineLearningLabel): void => {
//             LabelingWorkflowManager.selectLabel(itemId);
//         },
//         onPredictionSelectionClick: (itemId?: MachineLearningLabel): void => {
//             LabelingWorkflowManager.selectPrediction(itemId);
//         },
//         onSave: LabelingWorkflowManager.saveLabels,
//     };
// };

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(LabelTableFooter);
