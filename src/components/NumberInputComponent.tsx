/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import {useState} from "react";
import {Input} from "@bentley/ui-core";

type Props = {
    isFloat: boolean;
    value: number;
    minValue?: number;
    maxValue?: number;
    onValidated(value: number): void;
}

export const NumberInputComponent: React.FC<Props> = (props) => {
    const [valueAsString, setValueAsString] = useState(props.value.toString());

    const _processValue = () => {
        let newValue = parseFloat(valueAsString);
        if (!props.isFloat) {
            newValue = Math.round(newValue);
        }
        let isValid = true;
        if (isNaN(newValue) ||
            (props.minValue !== undefined && newValue < props.minValue) ||
            (props.maxValue !== undefined && newValue > props.maxValue)) {
            isValid = false;
        }
        if (!isValid) {
            setValueAsString(props.value.toString())
        } else {
            setValueAsString(newValue.toString())
            props.onValidated(newValue);
        }
    }

    const _handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueAsString(event.target.value)
    }

    const _handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if ((event.key === 'Enter')) {
            _processValue();
        }
    }

    const _handleBlur = () => {
        _processValue();
    }

    return (
        <>
            <Input
                type="number"
                value={valueAsString}
                onChange={_handleChange}
                onBlur={_handleBlur}
                onKeyPress={_handleKeyPress}
            />
        </>
    )
}
