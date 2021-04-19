import React, {FC} from 'react';
import {connect} from 'react-redux';
import {IModelApp} from "@bentley/imodeljs-frontend";
import VisibilityButtonAllComponent from "../VisibilityButtonAllComponent";
import {SelectionButtonComponent} from "../SelectionButtonComponent";
import {LabeledToggle, Radio} from "@bentley/ui-core";
import {
    ILabelSectionAttributes,
    IPredictionSectionAttributes,
    LabelTableAllComponent,
    LabelTableComponentProps
} from "./LabelTableAllComponent";
import {MachineLearningColorMode} from "../../data/LabelTypes";
import {
    LabelTableDispatchFromProps,
    LabelTableStateFromProps,
    mapLabelTableDispatchToProps,
    mapLabelTableStateToProps
} from "./ConnectedLabelTableAllComponent";
import {LabelTableEmphasis} from '../../store/LabelingWorkflowState';
import SelectionClearButtonComponent from "../SelectionClearButtonComponent";
import {Presentation} from "@bentley/presentation-frontend";
import {UiFramework} from "@bentley/ui-framework";

interface OwnProps extends LabelTableComponentProps {
   
}

export type LabelTableHeaderProps = OwnProps & LabelTableStateFromProps;


const LabelTableHeader: FC<LabelTableHeaderProps> = (props) => {

    const handleColorModeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        if (event.target !== undefined) {
            const colorMode = event.target.value as MachineLearningColorMode;
            props.onChangeColorMode(colorMode);
        }
    }

    const toggleLabelTableEmphasis = (): void => {
        // Before we dispatch the change of emphasis, clear the currently selected graphics and UI elements.
        Presentation.selection.clearSelection("", UiFramework.getIModelConnection()!);
        props.selectedUiItems?.clear();
        props.onToggleLabelTableEmphasis();
    }

    const [labelSectionAttributes, predSectionAttributes] = LabelTableAllComponent.getSectionAttributes(props);

    const renderTableHead = (labelSectionAttributes: ILabelSectionAttributes, predSectionAttributes: IPredictionSectionAttributes): JSX.Element => {

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
                </td>
                <td className="mltc-label-td-v2"/>
                <td className="mltc-prediction-td-v2"/>
            </tr>
            <tr className="mltc-first-row">
                <th className="mltc-name-th-v2">
                      <div className="mltc-name-th-v2-selection-clear">
                          <SelectionClearButtonComponent
                          selectedUiItems={props.selectedUiItems}
                          />
                      </div>
  
                    {
                        (props.labelTableEmphasis == LabelTableEmphasis.ActOnLabels) &&
                        <>
                            <div className="mltc-name-th-v2-visibility">
                                <VisibilityButtonAllComponent
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
                            </div>
                        </>
                    }
                    {
                        (props.labelTableEmphasis == LabelTableEmphasis.ActOnPredictions) &&
                        <>
                            <div className="mltc-name-th-v2-visibility">
                                <VisibilityButtonAllComponent
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
                            </div>
                        </>
                    }

                  
                    <div className="mltc-name-th-v2-title">
                        {IModelApp.i18n.translate("LabelingApp:labelTableHeading.name")}
                    </div>
                </th>

                <th className="mltc-label-th-v2">
                    <Radio
                        name={"labelTableEmphasis"}
                        label={IModelApp.i18n.translate("LabelingApp:labelTableHeading.asLabeled")}
                        defaultChecked={props.labelTableEmphasis == LabelTableEmphasis.ActOnLabels}
                        onClick={toggleLabelTableEmphasis}
                    />
                </th>
                <th className="mltc-prediction-th-v2">
                    <Radio
                        name={"labelTableEmphasis"}
                        label={IModelApp.i18n.translate("LabelingApp:labelTableHeading.asPredicted")}
                        defaultChecked={props.labelTableEmphasis == LabelTableEmphasis.ActOnPredictions}
                        onClick={toggleLabelTableEmphasis}
                    />
                </th>
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
