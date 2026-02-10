"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorerTreeProvider = void 0;
const vscode_1 = require("vscode");
class ExplorerTreeProvider {
    constructor(manager) {
        this.manager = manager;
        this.emitter = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this.emitter.event;
        this.manager.onDidChange(e => this.emitter.fire(e));
    }
    createTreeView(context, viewId) {
        const treeView = vscode_1.window.createTreeView(viewId, { treeDataProvider: this, showCollapseAll: true });
        context.subscriptions.push(treeView);
        return treeView;
    }
    getTreeItem(element) {
        return element.getTreeItem();
    }
    getChildren(element) {
        if (element) {
            return element.children;
        }
        return this.getRootElements();
    }
    getRootElements() {
        return this.manager.rootElements;
    }
}
exports.ExplorerTreeProvider = ExplorerTreeProvider;
//# sourceMappingURL=explorer-tree-provider.js.map