/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {InstanceKey} from "@bentley/presentation-common";
import {MatchingRuleType, SelectionExtenderConfig} from "../types/SETypes";

export interface SelectionExtenderAction {
    type: string;
    newSingleKey?: InstanceKey;
    newContentMap?: Map<MatchingRuleType, string[]>;
    newConfig?: SelectionExtenderConfig;
    newFoundCount?: number;
}