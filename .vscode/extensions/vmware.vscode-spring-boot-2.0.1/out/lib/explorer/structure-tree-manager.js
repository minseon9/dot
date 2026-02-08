"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructureManager = void 0;
const vscode_1 = require("vscode");
const nodes_1 = require("./nodes");
const SPRING_STRUCTURE_CMD = "sts/spring-boot/structure";
class StructureManager {
    constructor(context, api) {
        this._rootElements = [];
        this._onDidChange = new vscode_1.EventEmitter();
        this.workspaceState = context.workspaceState;
        context.subscriptions.push(vscode_1.commands.registerCommand("vscode-spring-boot.structure.refresh", () => this.refresh(true)));
        context.subscriptions.push(vscode_1.commands.registerCommand("vscode-spring-boot.structure.openReference", (node) => {
            const reference = node === null || node === void 0 ? void 0 : node.referenceValue;
            if (reference) {
                const location = api.client.protocol2CodeConverter.asLocation(reference);
                vscode_1.window.showTextDocument(location.uri, { selection: location.range });
            }
        }));
        context.subscriptions.push(vscode_1.commands.registerCommand("vscode-spring-boot.structure.grouping", (node) => __awaiter(this, void 0, void 0, function* () {
            const projectName = node.projectId;
            const groups = yield vscode_1.commands.executeCommand("sts/spring-boot/structure/groups", projectName);
            const initialGroups = this.getVisibleGroups(projectName);
            const items = ((groups === null || groups === void 0 ? void 0 : groups.groups) || []).map(g => ({
                label: g.displayName,
                group: g,
                description: g.identifier,
                picked: initialGroups ? initialGroups.includes(g.identifier) : true
            }));
            const selectedGroupItems = yield vscode_1.window.showQuickPick(items, {
                canPickMany: true,
                ignoreFocusOut: true,
                title: `Select groups to show/hide for project ${projectName}`,
                placeHolder: 'Select groups to show/hide'
            });
            if (selectedGroupItems) {
                yield this.setVisibleGroups(projectName, items.length === selectedGroupItems.length ? undefined : selectedGroupItems.map(i => i.group.identifier));
                this.refresh(false);
            }
        })));
        context.subscriptions.push(api.getSpringIndex().onSpringIndexUpdated(indexUpdateDetails => this.refresh(false, indexUpdateDetails.affectedProjects)));
    }
    get rootElements() {
        return this._rootElementsRequest;
    }
    // Serves 2 purposes: non UI triggered refresh as a result of the index update and a UI triggered refresh
    // The UI triggered refresh needs to proceed with an event fired such that tree view would kick off a new promise getting all new root elements and would show progress while promise is being resolved.
    // The index update typically would have a list of projects for which index has changed then the refresh can be silent with letting the tree know about new data once it is computed
    // If the index update event doesn't have a list of project then this is an edge case for which we'd show the preogress and treat it like UI triggered refresh
    refresh(updateMetadata, affectedProjects) {
        const isPartialLoad = !!(affectedProjects && affectedProjects.length);
        // Notify the tree to get the children to trigger "loading" bar in the view???
        const params = {
            updateMetadata,
            affectedProjects,
            groups: this.getGroupings(),
        };
        this._rootElementsRequest = vscode_1.commands.executeCommand(SPRING_STRUCTURE_CMD, params).then(json => {
            const nodes = this.parseArray(json);
            if (isPartialLoad) {
                const newNodes = [];
                const nodesMap = {};
                affectedProjects.forEach(projectName => nodesMap[projectName] = nodes.find(n => n.projectId === projectName));
                // merge old and newly fetched stereotype root nodes
                let onlyMutations = true;
                this._rootElements.forEach(n => {
                    if (nodesMap.hasOwnProperty(n.projectId)) {
                        const newN = nodesMap[n.projectId];
                        delete nodesMap[n.projectId];
                        if (newN) {
                            newNodes.push(newN);
                        }
                        else {
                            // element removed
                            onlyMutations = false;
                        }
                    }
                    else {
                        newNodes.push(n);
                    }
                });
                if (Object.values(nodesMap).length) {
                    // elements added
                    onlyMutations = false;
                    Object.values(nodesMap).filter(n => !!n).forEach(n => newNodes.push(n));
                }
                this._rootElements = newNodes;
                // TODO: Partial tree refresh didn't work for restbucks it remains either without children or without the full text label
                // (test with `spring-restbucks` project in a workspace with other boot projects, i.e. demo, spring-petclinic)
                this._onDidChange.fire(/*onlyMutations ? nodes : */ undefined);
            }
            else {
                this._rootElements = nodes;
                // No need to fire another event to update the UI since there is an event fired before refresh is triggered to reference the new promise
            }
            return this._rootElements;
        });
        if (!isPartialLoad) {
            // Fire an event for full reload to have a progress bar while the promise above is resolved
            this._onDidChange.fire(undefined);
        }
    }
    parseNode(json, parent) {
        const node = new nodes_1.StereotypedNode(json, [], parent);
        // Parse children after creating the node so we can pass it as parent
        node.children.push(...this.parseArray(json.children, node));
        return node;
    }
    parseArray(json, parent) {
        return Array.isArray(json) ? json.map(j => this.parseNode(j, parent)).filter(e => !!e) : [];
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    getVisibleGroups(projectName) {
        const groupings = this.getGroupings();
        return groupings ? groupings[projectName] : undefined;
    }
    getGroupings() {
        return this.workspaceState.get(`vscode-spring-boot.structure.group`, undefined);
    }
    setVisibleGroups(projectName, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            let groupings = this.getGroupings();
            if (groupings) {
                if (groups) {
                    groupings[projectName] = groups;
                }
                else {
                    delete groupings[projectName];
                }
            }
            else {
                if (groups) {
                    groupings = { [projectName]: groups };
                }
            }
            yield this.workspaceState.update(`vscode-spring-boot.structure.group`, groupings);
        });
    }
}
exports.StructureManager = StructureManager;
//# sourceMappingURL=structure-tree-manager.js.map