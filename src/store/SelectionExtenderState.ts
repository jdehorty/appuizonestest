import {
    MatchingOperator,
    MatchingRuleType,
    SelectionExtenderConfig,
} from "./SelectionExtenderTypes";
import {InstanceKey} from "@bentley/presentation-common";


export interface SelectionExtenderState {
    singleKey?: InstanceKey;
    foundCount?: number;
    isSearching: boolean;
    config: SelectionExtenderConfig;
    contentMap: Map<MatchingRuleType, string[]>;
}

export const INITIAL_STATE: SelectionExtenderState = {
    singleKey: undefined,
    foundCount: undefined,
    isSearching: false,
    config: {
        visibleInViewOnly: false,
        maxDistEnabled: false,
        maxDistValue: 4.0,
        maxCountEnabled: false,
        maxCountValue: 1000,
        rule: {
            childRules: [
                { checked: false, type: MatchingRuleType.SameElementAspect },
                { checked: true, type: MatchingRuleType.SameUserLabel },
                { checked: false, type: MatchingRuleType.SameCategory },
                { checked: false, type: MatchingRuleType.SameClass },
                { checked: false, type: MatchingRuleType.SameBBoxHeight },
                { checked: true, type: MatchingRuleType.SameBBoxVolume },
                { checked: true, type: MatchingRuleType.SameModel },
                { checked: false, type: MatchingRuleType.SameParent },
                { checked: false, type: MatchingRuleType.SameGeometry },
                { checked: false, type: MatchingRuleType.SameGeometrySize },
            ],
            operator: MatchingOperator.And,
        },
        enableAuxData: false,
    },
    contentMap: new Map<MatchingRuleType, string[]>(),
}