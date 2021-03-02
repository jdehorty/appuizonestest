import { connect } from "react-redux";
import { LabelingWorkflowManager } from "./LabelingWorkflowManager";
import { CycleElementComponent, CycleElementComponentProps } from "./CycleElements";
import { LabelingWorkflowState } from "./LabelingWorkflowState";
import { LabelingWorkflowManagerSelectors } from "./LabelingWorkflowSelectors";


/** Map state to props */
function mapStateToProps(rootState: any): CycleElementComponentProps {
    const state = rootState[LabelingWorkflowManager.stateKey] as LabelingWorkflowState | undefined;
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
        onStart: LabelingWorkflowManager.cycleElementsEnable,
        onStop: LabelingWorkflowManager.cycleElementsDisable,
        onForward: LabelingWorkflowManager.cycleElementsForward,
        onBackward: LabelingWorkflowManager.cycleElementsBackward,
        onForceShowAllChanged: LabelingWorkflowManager.setForceShowAll,
    };
}


/**
 * Connected CycleElementComponent component that allows to cycle through a set of elements
 */
export const ConnectedCycleElementComponent = connect(mapStateToProps)(CycleElementComponent);
