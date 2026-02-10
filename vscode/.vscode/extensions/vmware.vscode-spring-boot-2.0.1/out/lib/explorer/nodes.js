"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StereotypedNode = void 0;
const vscode_1 = require("vscode");
class StereotypedNode {
    constructor(n, children, parent) {
        this.n = n;
        this.children = children;
        this.parent = parent;
    }
    getTreeItem(savedState) {
        const defaultState = savedState !== undefined ? savedState : vscode_1.TreeItemCollapsibleState.Collapsed;
        const item = new vscode_1.TreeItem(this.label, Array.isArray(this.children) && this.children.length ? defaultState : vscode_1.TreeItemCollapsibleState.None);
        item.iconPath = new vscode_1.ThemeIcon(this.n.attributes.icon);
        item.id = this.nodeId;
        // Add context value if reference attribute exists
        if (this.n.attributes.reference) {
            item.contextValue = "stereotypedNodeWithReference";
        }
        if (this.projectId) {
            item.contextValue = "project";
        }
        if (this.n.attributes.location) {
            const location = this.n.attributes.location;
            item.command = {
                command: "vscode.open",
                title: "Navigate",
                arguments: [vscode_1.Uri.parse(location.uri), {
                        selection: location.range
                    }]
            };
        }
        return item;
    }
    get projectId() {
        return this.n.attributes.projectId;
    }
    get nodeId() {
        return this.n.attributes.nodeId || this.n.attributes.text;
    }
    get label() {
        return this.n.attributes.text || '';
    }
    get referenceValue() {
        return this.n.attributes.reference;
    }
}
exports.StereotypedNode = StereotypedNode;
//# sourceMappingURL=nodes.js.map