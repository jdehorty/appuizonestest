import fs from 'fs';
import {LabelActivation, MachineLearningLabel, ModelPrediction} from "../data/LabelTypes";
import {Id64String} from "@bentley/bentleyjs-core";

const reviver = (key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
};

const replacer = (key: any, value: any) => {
    if(value instanceof Map) {
        return {
            dataType: 'Map',
            value: [...value],
        };
    } else {
        return value;
    }
};

export const mockGetUserLabels = () => {
    // Use JSON.Parse with a reviver to deserialize userLabelReplacerOutput.json
    // const userLabels: string = fs.readFileSync('../tests/data/userLabelsReplacerOutput.json','utf8');
    // return JSON.parse(userLabels, reviver);

    let userLabels = new Map<string, string>();
    // Use JSON.Parse with a reviver to deserialize modelPredictionReplacerOutput.json
    fs.readFile('../tests/data/userLabelsReplacerOutput.json', (err, data)=>{
        if (err) throw err;
        userLabels = JSON.parse(data.toString(), reviver);
    });
    return userLabels;
};

export const mockGetModelPredictions = () => {
    let modelPredictions = null;
    // Use JSON.Parse with a reviver to deserialize modelPredictionReplacerOutput.json
    fs.readFile('../tests/data/modelPredictionReplacerOutput.json', (err, data)=>{
        if (err) throw err;
        modelPredictions = JSON.parse(data.toString(), reviver);
    });
    return modelPredictions;
};

// const fs = require('fs');
//
// fs.readFile('student.json', (err, data) => {
//     if (err) throw err;
//     let student = JSON.parse(data);
//     console.log(student);
// });
//
// console.log('This is after the read call');

export const mockFillMLData = () => {
    // Use JSON.Parse with a reviver to deserialize modelPredictionReplacerOutput.json
    // const modelPredictions: string = fs.readFileSync('../tests/data/modelPredictionReplacerOutput.json','utf8');
    // return JSON.parse(modelPredictions, reviver);
};

// private static async _fillMLData(
//     /** Machine learning labeling interface */
//     labelInterface: MachineLearningLabelInterface,
//     /** State map to be patched with ML labels and predictions */
//     elementStateMap: Map<Id64String, ElementState>
// ): Promise<void> {
//
//     const idArray = Array.from(elementStateMap.keys()); // mock this?
//     const labelDefs = await labelInterface.getLabelDefinitions();
//     const userLabelMap = await labelInterface.getUserLabels(idArray); // mock this
//     const modelPredictionMap = await labelInterface.getModelPredictions(idArray); // mock this
//
//     // const replacer = (key: Id64String, value: ElementState) => {
//     //     if(value instanceof Map) {
//     //         return {
//     //             dataType: 'Map',
//     //             value: [...value],
//     //         };
//     //     } else {
//     //         return value;
//     //     }
//     // };
//     //
//     // const foo = JSON.stringify(modelPredictionMap, replacer)
//
//     for (const [elementId, elementState] of elementStateMap) {
//     elementState.trueLabel = getWithDefault(userLabelMap, elementId, labelDefs.unlabeledValue);
//     const predictionData = getWithDefault(modelPredictionMap, elementId, {label: labelDefs.unlabeledValue});
//     elementState.predLabel = predictionData.label;
//     elementState.auxData = predictionData.auxData;
// }
