import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { LsStereoTypedNode } from "./structure-tree-manager";
import * as ls from 'vscode-languageserver-protocol';
export declare class StereotypedNode {
    private n;
    children: StereotypedNode[];
    protected parent?: StereotypedNode;
    constructor(n: LsStereoTypedNode, children: StereotypedNode[], parent?: StereotypedNode);
    getTreeItem(savedState?: TreeItemCollapsibleState): TreeItem;
    get projectId(): string;
    get nodeId(): string;
    get label(): string;
    get referenceValue(): ls.Location | undefined;
}
