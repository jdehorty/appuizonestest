/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { LabelingConnectionActionType } from "../actionTypes/LCActionTypes";

export const Initialize = () => ({
    type: LabelingConnectionActionType.Initialize,
    isInitialized: true
});


