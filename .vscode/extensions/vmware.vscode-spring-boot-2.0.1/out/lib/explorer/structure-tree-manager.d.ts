import { Event, ExtensionContext } from "vscode";
import { StereotypedNode } from "./nodes";
import { ExtensionAPI } from "../api";
export declare class StructureManager {
    private _rootElementsRequest;
    private _rootElements;
    private _onDidChange;
    private workspaceState;
    constructor(context: ExtensionContext, api: ExtensionAPI);
    get rootElements(): Thenable<StereotypedNode[]>;
    refresh(updateMetadata: boolean, affectedProjects?: string[]): void;
    private parseNode;
    private parseArray;
    get onDidChange(): Event<undefined | StereotypedNode | StereotypedNode[]>;
    private getVisibleGroups;
    private getGroupings;
    private setVisibleGroups;
}
export interface LsStereoTypedNode {
    readonly attributes: Record<string, any>;
    readonly children: LsStereoTypedNode[];
}
