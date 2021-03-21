import React, {Dispatch, FunctionComponent, useState} from 'react';
import { connect } from 'react-redux';
import { RootState } from "../../store/AppState";
import {LabelTableComponentProps} from "./LabelTable";
import {Button, Icon, Spinner, SpinnerSize, LabeledToggle, ButtonType, SvgPath} from "@bentley/ui-core";
import {LabelingWorkflowManagerAction, LabelingWorkflowManagerActionType} from "../../store/LabelingWorkflowActions";
import {LabelingWorkflowManagerSelectors} from "../../store/LabelingWorkflowSelectors";
import {AVAILABLE_COLOR_MODES, LabelingWorkflowManager} from "../../LabelingWorkflowManager";
import {LabelingWorkflowState} from "../../store/LabelingWorkflowState";
import {MachineLearningColorMode, MachineLearningLabel} from "../../data/LabelTypes";
import {LabelTableDispatchFromProps, LabelTableStateFromProps, mapLabelTableStateToProps, mapLabelTableDispatchToProps} from "./ConnectedLabelTable";
import {ColorDef} from "@bentley/imodeljs-common";

interface OwnProps extends LabelTableComponentProps {
  
}

type Props = OwnProps & ReturnType<typeof mapLabelTableStateToProps>;

const LabelTableBody: FunctionComponent<Props>  = (props) => {
  return (
      <>
        {props.ready && <p>Hello LabelTableBody</p>}
          {/* <tbody>
              {tableRows}
          </tbody> */}
       
      </>
  );
};

export default connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableBody);
