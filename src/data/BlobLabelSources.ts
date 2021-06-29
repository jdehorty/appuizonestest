/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { GuidString, Id64, Id64Arg, Id64String } from "@bentley/bentleyjs-core";
import { ColorDef } from "@bentley/imodeljs-common";
import { downloadBlobAsString, uploadBlobAsString } from "./blobs";
import { LabelActivation, LabelDefinitions, MachineLearningLabel, MachineLearningLabelDef, MachineLearningLabelInterface, ModelPrediction } from "./LabelTypes";
import { decToHex, hexToDec } from "../utils/dectohex";
import * as fs from "fs";


export interface BlobBasedLabelDataSourceConfig {
    accountName: string;
    sasString: string;
    projectGuid: GuidString;
    imodelGuid: GuidString;
    imodelName: string;
    revisionId: string;
    predSuffix: string;
}

interface MachineLearningLabelDefExt extends MachineLearningLabelDef {
    legacyName: string;
}

export class BlobBasedMachineLearningLabelInterface extends MachineLearningLabelInterface {

    private UNLABELED: MachineLearningLabel = "MachineLearning:label.unlabeled";

    private NO_PREDICTION: ModelPrediction = {
        label: this.UNLABELED,
        labelActivations: [
            { label: this.UNLABELED, activation: 1.0 }
        ],
    };

    private LABEL_DEFS: Array < MachineLearningLabelDefExt > =[
        { label: "MachineLearning:label.road", legacyName: "Road", parentLabel: "MachineLearning:label.road", defaultColor: ColorDef.from(64, 64, 64) },
        { label: "MachineLearning:label.roadwayplateau", legacyName: "RoadwayPlateau", parentLabel: "MachineLearning:label.roadwayplateau", defaultColor: ColorDef.from(128, 128, 128) },
        { label: "MachineLearning:label.centralreserve", legacyName: "CentralReserve", parentLabel: "MachineLearning:label.centralreserve", defaultColor: ColorDef.from(0, 0, 0) },
        { label: "MachineLearning:label.roadside", legacyName: "RoadSide", parentLabel: "MachineLearning:label.roadside", defaultColor: ColorDef.from(145, 30, 180) },
        { label: "MachineLearning:label.roadsidepart", legacyName: "RoadSidePart", parentLabel: "MachineLearning:label.roadsidepart", defaultColor: ColorDef.from(60, 180, 75) },
        { label: "MachineLearning:label.roadway", legacyName: "Roadway", parentLabel: "MachineLearning:label.roadway", defaultColor: ColorDef.from(0, 128, 128) },
        { label: "MachineLearning:label.trafficlane", legacyName: "TrafficLane", parentLabel: "MachineLearning:label.trafficlane", defaultColor: ColorDef.from(255, 25, 75) },
        { label: "MachineLearning:label.shoulder", legacyName: "Shoulder", parentLabel: "MachineLearning:label.shoulder", defaultColor: ColorDef.from(0, 128, 0) },
        { label: "MachineLearning:label.sidewalk", legacyName: "Sidewalk", parentLabel: "MachineLearning:label.sidewalk", defaultColor: ColorDef.from(170, 110, 40) },
        { label: "MachineLearning:label.junctionelement", legacyName: "JunctionElement", parentLabel: "MachineLearning:label.junctionelement", defaultColor: ColorDef.from(192, 0, 0) },
        { label: "MachineLearning:label.intersection", legacyName: "Intersection", parentLabel: "MachineLearning:label.intersection", defaultColor: ColorDef.from(70, 240, 240) },
        { label: "MachineLearning:label.curb", legacyName: "Curb", parentLabel: "MachineLearning:label.curb", defaultColor: ColorDef.from(192, 192, 192) },
        { label: "MachineLearning:label.other", legacyName: "Other", parentLabel: "MachineLearning:label.other", defaultColor: ColorDef.from(240, 240, 50) },
        { label: this.UNLABELED, legacyName: "Unlabeled", parentLabel: this.UNLABELED, defaultColor: ColorDef.from(255, 255, 255) }
    ];


    private _config: BlobBasedLabelDataSourceConfig;

    constructor(config: BlobBasedLabelDataSourceConfig) {
        super();
        this._config = config;
    }

    private async _download_model_predictions(): Promise<Map<Id64String, ModelPrediction>> {

        const containerName = "abce-predictions";
        if (this._config.predSuffix !== "") {
            this._config.predSuffix = `-${this._config.predSuffix}`
        }
        const blobName = `${this._config.projectGuid}_${this._config.imodelGuid}_${this._config.revisionId}_instance-predictions${this._config.predSuffix}.json`;

        const predictionMap = new Map<Id64String, ModelPrediction>();
        try {
            const blobData = await downloadBlobAsString(this._config.accountName, this._config.sasString, containerName, blobName);
            if (blobData !== undefined) {
                const data = JSON.parse(blobData);
                for (const instancePred of data.instancePredictions) {
                    const elementId: Id64String = instancePred.DgnElementIdHex.toLowerCase();
                    const modelPrediction: ModelPrediction = {
                        label: "MachineLearning:label." + instancePred.ElementName.toLowerCase(),
                        auxData: instancePred.AuxData,
                    }
                    if (instancePred.Probabilities !== undefined) {
                        const labelActivations: LabelActivation[] = [];
                        for (const elementProb of instancePred.Probabilities) {
                            labelActivations.push({
                                label: "MachineLearning:label." + elementProb.ElementName.toLowerCase(),
                                activation: elementProb.Probability,
                            });
                        }
                        modelPrediction.labelActivations = labelActivations;
                    }
                    predictionMap.set(elementId, modelPrediction);
                }
            }
        } catch (e) {
            console.groupCollapsed("Failed to download predictions");
            console.trace();
            console.log(e);
            console.log(containerName);
            console.log(blobName);
            console.groupEnd();
        }
        return predictionMap;
    }


    private async _download_user_labels(): Promise<Map<Id64String, MachineLearningLabel>> {

        const containerName = "abce-misclassification-labels";

        const blobName = `${this._config.projectGuid}_${this._config.imodelGuid}_${this._config.revisionId}_misclassification-labels-jkd.csv`;

        const instanceMap = new Map<Id64String, MachineLearningLabel>();

        try {
            const blobData = await downloadBlobAsString(this._config.accountName, this._config.sasString, containerName, blobName);

            if (blobData !== undefined) {
                const a = blobData.split("\n");
                if (a.length >= 1) {
                    a.shift();
                    a.forEach((line: string) => {
                        const items = line.split(",");
                        if (items.length >= 2) {
                            const elementId = decToHex(items[0])!.toLowerCase();
                            const label = items[1].startsWith("MachineLearning:label") ? items[1] : "MachineLearning:label." + items[1].toLowerCase();
                            instanceMap.set(elementId, label);
                        }
                    });
                }
            }
        }
        catch (e) {
            try {
                //if _misclassified-labels.csv not present, try to load the standard labels.csv from the alternate source (geometry labels):
                const altContainerName = "abce-labels";
                const altBlobName = `${this._config.projectGuid}_${this._config.imodelGuid}_${this._config.revisionId}_labels.csv`;
                const blobData = await downloadBlobAsString(this._config.accountName, this._config.sasString, altContainerName, altBlobName);

                if (blobData !== undefined) {
                    const a = blobData.split("\n");
                    if (a.length >= 1) {
                        a.shift();
                        a.forEach((line: string) => {
                            const items = line.split(",");
                            if (items.length >= 2) {
                                const elementId = decToHex(items[0])!.toLowerCase();
                                const label = items[1].startsWith("MachineLearning:label") ? items[1] : "MachineLearning:label." + items[1].toLowerCase();
                                instanceMap.set(elementId, label);
                            }
                        });
                    }
                }
            }

            catch (e) {
                console.groupCollapsed("Failed to download the alternate labels");
                console.trace();
                console.log(e);
                console.log(containerName);
                console.log(blobName);
                console.groupEnd();
            }
        }



        return instanceMap;
    }

    private async _upload_user_labels(labelMap: Map<Id64String, MachineLearningLabel>): Promise<boolean> {

        const labelLegacyMap = new Map<MachineLearningLabel, string>();
        for (const labelDef of this.LABEL_DEFS) {
            labelLegacyMap.set(labelDef.label, labelDef.legacyName);
        }

        const containerName = "abce-misclassification-labels";
        const blobName = `${this._config.projectGuid}_${this._config.imodelGuid}_${this._config.revisionId}_misclassification-labels-jkd.csv`;
        const contentLines: string[] = [",bentley_class_name,method,probability"];
        for (const [id, label] of labelMap) {
            const legacyName = labelLegacyMap.has(label) ? labelLegacyMap.get(label) : "Unlabeled";
            contentLines.push(`${hexToDec(id)},${legacyName},imodeljs_labeler,1.00`);
        }
        const content = contentLines.join("\n");
        try {
            return uploadBlobAsString(this._config.accountName, this._config.sasString, containerName, blobName, content);
        } catch (e) {
            console.groupCollapsed("Failed to upload labels");
            console.trace();
            console.log(e);
            console.log(containerName);
            console.log(blobName);
            console.groupEnd();
            return false;
        }
    }

    public async getLabelDefinitions(): Promise<LabelDefinitions> {
        const labelDefMap = new Map<MachineLearningLabel, MachineLearningLabelDef>();
        for (const labelDef of this.LABEL_DEFS) {
            labelDefMap.set(labelDef.label, labelDef);
        }
        return {
            unlabeledValue: this.UNLABELED,
            labelDefMap: labelDefMap,
        };
    }



    public async getUserLabels(ids: Id64Arg): Promise<Map<Id64String, MachineLearningLabel>> {
        const downloadedLabelMap = await this._download_user_labels();
        const outputLabelMap = new Map<Id64String, MachineLearningLabel>();
        Id64.toIdSet(ids).forEach((id) => {
            if (downloadedLabelMap.has(id)) {
                outputLabelMap.set(id, downloadedLabelMap.get(id)!);
            } else {
                outputLabelMap.set(id, this.UNLABELED);
            }
        });
        return outputLabelMap;
    }

    public async setUserLabels(labelMap: Map<Id64String, MachineLearningLabel>): Promise<boolean> {
        return this._upload_user_labels(labelMap);
    }

    public async getModelPredictions(ids: Id64Arg): Promise<Map<Id64String, ModelPrediction>> {
        const downloadedPredictionMap = await this._download_model_predictions();
        const outputPredictionMap = new Map<Id64String, ModelPrediction>();
        Id64.toIdSet(ids).forEach((id) => {
            if (downloadedPredictionMap.has(id)) {
                outputPredictionMap.set(id, downloadedPredictionMap.get(id)!);
            } else {
                outputPredictionMap.set(id, this.NO_PREDICTION);
            }
        });
        return outputPredictionMap;
    }
}
