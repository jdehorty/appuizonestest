import React, {FC, useState} from 'react';
import {connect} from 'react-redux';
import {IModelApp} from "@bentley/imodeljs-frontend";
import AppearanceBatchToggleComponent from "../VisibilityToggleAllComponent";
import {GroupSelectButtonComponent} from "../GroupSelectButton";
import {Button, ButtonType, Icon, LabeledToggle} from "@bentley/ui-core";
import {
    ILabelSectionAttributes,
    IPredictionSectionAttributes,
    LabelTableComponent,
    LabelTableComponentProps
} from "./LabelTable";
import {MachineLearningColorMode} from "../../data/LabelTypes";
import {
    LabelTableDispatchFromProps,
    LabelTableStateFromProps,
    mapLabelTableDispatchToProps,
    mapLabelTableStateToProps,
    mapLabelTableStateToPropsForPopout
} from "./LabelTableState";
import MLStateTablePopout from "../MLStateTablePopout";


interface OwnProps extends LabelTableComponentProps {
    isPoppedOut: boolean;
}

type Props = OwnProps & ReturnType<typeof mapLabelTableStateToProps>;


const LabelTableHeader: FC<Props> = (props) => {

  const [readyForPopout, setReadyForPopout] = useState<boolean> (props.readyForPopout);

    const handleColorModeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        if (event.target !== undefined) {
            const colorMode = event.target.value as MachineLearningColorMode;
            props.onChangeColorMode(colorMode);
        }
    }

    const _onPopoutButtonClick = () => {
        setReadyForPopout(true);
    }

    const _onPopoutWindowClosing = () => {
        // console.log("_onPopoutWindowClosing was fired");
        setReadyForPopout(false);
    }

    const [labelSectionAttributes, predSectionAttributes] = LabelTableComponent.getSectionAttributes(props);

    const renderTableHead = (labelSectionAttributes: ILabelSectionAttributes, predSectionAttributes: IPredictionSectionAttributes): JSX.Element => {

        let headerStyle = {
            backgroundColor: "#ddd",
            fontSize: "11px"
        }

        const colorModeOptions: JSX.Element[] = [];

        for (const colorMode of props.availableColorModes) {
            const colorModeI18n = IModelApp.i18n.translate(colorMode);
            colorModeOptions.push(
                <option key={`color-mode-option-${colorMode}`} value={colorMode}>{colorModeI18n}</option>
            );
        }

        return <>
            <thead>
            <tr>
                <td className="mltc-name-td-v2">
                <div>
                   <table className="mltc-name-subtable-td-v2">
                       <tbody>
                           <tr>
                               <td>
                                   <span>{IModelApp.i18n.translate("LabelingApp:hideEmpty")}</span>
                               </td>
                               <td>
                                   <div>
                                       <span>{IModelApp.i18n.translate("LabelingApp:colorMode")}</span>
                                   </div>
                               </td>
                           </tr>
                           <tr>
                               <td>
                               <LabeledToggle
                                   className="sstc-hide-empty-toggle"
                                   label=""
                                   isOn={props.filterEmptyRows}
                                   onChange={props.onFilterEmptyRowsChange}
                               />
                               </td>
                               <td>
                                   <div>
                                       <label>
                                           <select
                                               className="sstc-color-mode-select"
                                               value={props.currentColorMode}
                                               onChange={handleColorModeChange}
                                           >
                                               {colorModeOptions}
                                           </select>
                                       </label>
                                   </div>
                               </td>
                           </tr>
                       </tbody>
                   </table>
                </div>
                {/* <Button
                   className="sstc-swap-button"
                       buttonType={ButtonType.Blue}
                   onClick={this.props.onSwapTruePredDisplay}
                >
                   <Icon iconSpec="icon-replace"/>
                </Button> */}
                </td>
                <td className="mltc-label-td-v2">
                    <AppearanceBatchToggleComponent
                        transparencyAvailable={true}
                        allHidden={labelSectionAttributes.allLabelHidden}
                        allVisible={labelSectionAttributes.allLabelVisible}
                        allTransparent={labelSectionAttributes.allLabelTransparent}
                        allOpaque={labelSectionAttributes.allLabelOpaque}
                        onClick={
                            (newVisible: boolean, newTransparent: boolean) => {
                                props.onLabelDisplayChange(newVisible, newTransparent, undefined);
                            }
                        }
                    />
                    <GroupSelectButtonComponent label={IModelApp.i18n.translate("LabelingApp.everything")}
                                                onClick={() => {
                                                    props.onLabelSelectionClick(props.selectedUiItems.values()?.next()?.value?.name);
                                                }}/>
                </td>
                <td className="mltc-prediction-td-v2">
                    <AppearanceBatchToggleComponent
                        transparencyAvailable={true}
                        allHidden={predSectionAttributes.allPredictionHidden}
                        allVisible={predSectionAttributes.allPredictionVisible}
                        allTransparent={predSectionAttributes.allPredictionTransparent}
                        allOpaque={predSectionAttributes.allPredictionOpaque}
                        onClick={
                            (newVisible: boolean, newTransparent: boolean) => {
                                props.onPredictionDisplayChange(newVisible, newTransparent, undefined);
                            }
                        }
                    />
                    <GroupSelectButtonComponent label={IModelApp.i18n.translate("LabelingApp.everything")}
                                                onClick={() => {
                                                    props.onPredictionSelectionClick(props.selectedUiItems.values()?.next()?.value?.name);
                                                }}/>
                </td>
                {!props.isPoppedOut &&
                <td>
                    <Button className="sstc-window-new-button"
                            buttonType={ButtonType.Hollow}
                            onClick={_onPopoutButtonClick}
                    >
                        <Icon iconSpec="icon-window-new"/>
                    </Button>

                    {
                        readyForPopout &&
                        <MLStateTablePopout title={"ML Audit"} closingPopout={_onPopoutWindowClosing}/>
                    }
                </td>
                }
            </tr>
            <tr style={headerStyle}>
                <th className="mltc-name-th-v2">{IModelApp.i18n.translate("LabelingApp:labelTableHeading.name")}</th>
                <th className="mltc-label-th-v2">{IModelApp.i18n.translate("LabelingApp:labelTableHeading.asLabeled")}</th>
                <th className="mltc-prediction-th-v2">{IModelApp.i18n.translate("LabelingApp:labelTableHeading.asPredicted")}</th>
            </tr>
            </thead>
        </>
    }

    return (
        <>
            {props.ready && renderTableHead(labelSectionAttributes, predSectionAttributes)}
        </>
    );
};

export const ConnectedLabelTableHeader = connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableHeader);

export const ConnectedLabelTableHeaderPopout = connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToPropsForPopout, mapLabelTableDispatchToProps)(LabelTableHeader);
