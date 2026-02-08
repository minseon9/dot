import { Event, ExtensionContext, ProviderResult, TreeDataProvider, TreeItem } from "vscode";
import { StructureManager } from "./structure-tree-manager";
import { StereotypedNode } from "./nodes";
export declare class ExplorerTreeProvider implements TreeDataProvider<StereotypedNode> {
    private manager;
    private emitter;
    readonly onDidChangeTreeData: Event<undefined | StereotypedNode | StereotypedNode[]>;
    constructor(manager: StructureManager);
    createTreeView(context: ExtensionContext, viewId: string): import("vscode").TreeView<StereotypedNode>;
    getTreeItem(element: StereotypedNode): TreeItem | Thenable<TreeItem>;
    getChildren(element?: StereotypedNode): ProviderResult<StereotypedNode[]>;
    getRootElements(): ProviderResult<StereotypedNode[]>;
}
