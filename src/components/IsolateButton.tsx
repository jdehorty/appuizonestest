/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import React from "react";
import { Button, ButtonType, SvgPath } from "@bentley/ui-core";

export const IsolateButton: React.FC = () => <Button
    className="sstc-isolate-button"
    buttonType={ButtonType.Hollow}
    style={{ minWidth: 24, maxWidth: 24 }}
>
    {/*<Icon iconSpec="icon-isolate"/>*/}
    <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
        "M2,9h6v6H2",
        "M2,1v6h6V1H2z M7,6H3V2h4V6z",
        "m10 1v6h6v-6h-6m5 5h-4v-4h4v4",
        "m10 9v6h6v-6m-1 5h-4v-4h4"
    ]}/>
</Button>;