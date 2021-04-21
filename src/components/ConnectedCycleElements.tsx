import {connect} from "react-redux";
import {LabelingWorkflowManager} from "../LabelingWorkflowManager";
import {CycleElementComponent, CycleElementComponentProps} from "./CycleElements";
import {LabelingWorkflowState} from "../store/LabelingWorkflowState";
import {LabelingWorkflowManagerSelectors} from "../store/LabelingWorkflowSelectors";
import {RootState} from "../store/AppState";


/** Map state to props */
const mapStateToProps = (rootState: RootState): CycleElementComponentProps => {
    const state = rootState.labelingWorkflowManagerState as LabelingWorkflowState | undefined;
    if (!state) {
        throw new Error();
    }
    return {
        ready: state.ready,
        enabled: state.cycleModeState.enabled,
        working: state.cycleModeState.working,
        cycleSetSize: state.cycleModeState.cycleList !== undefined ? state.cycleModeState.cycleList.length : undefined,
        cycleIndex: state.cycleModeState.currentIndex,
        totalCount: LabelingWorkflowManagerSelectors.elementStateMap(state).size,
        selectedCount: state.selectionSet.size,
        forceShowAll: state.forceShowAll,
        isPoppedOut: false,
        readyForPopout: false,
        onStart: LabelingWorkflowManager.cycleElementsEnable,
        onStop: LabelingWorkflowManager.cycleElementsDisable,
        onForward: LabelingWorkflowManager.cycleElementsForward,
        onBackward: LabelingWorkflowManager.cycleElementsBackward,
        onForceShowAllChanged: LabelingWorkflowManager.setForceShowAll,
        onPopout: LabelingWorkflowManager.popOutWindow
    };
};

export const mapStateToPropsForPopout = (rootState: RootState): CycleElementComponentProps => {
    const state = rootState.labelingWorkflowManagerState as LabelingWorkflowState | undefined;
    if (!state) {
        throw new Error();
    }

    let stateProps3 = mapStateToProps(rootState);
    stateProps3["isPoppedOut"] = true;
    return stateProps3;
};

/**
 * Connected CycleElementComponent component that allows to cycle through a set of elements
 */
export const ConnectedCycleElementComponent = connect(mapStateToProps)(CycleElementComponent);

export const ConnectedCycleElementComponentPopout = connect(mapStateToPropsForPopout)(CycleElementComponent);

