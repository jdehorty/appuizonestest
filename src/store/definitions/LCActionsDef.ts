import {InstanceKey} from "@bentley/presentation-common";
import {MatchingRuleType, SelectionExtenderConfig} from "../types/SETypes";
import { LabelingConnectionActionType } from "../actionTypes/LCActionTypes";


export interface LabelingConnectionAction {
    type: LabelingConnectionActionType;
    isInitialized: boolean,
    isConnecting: boolean,
    isOpen: boolean,
    isLocked: boolean,
    isCompromised: boolean
}