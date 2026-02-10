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
exports.activateCopilotFeatures = exports.logger = exports.REQUIRED_EXTENSION = void 0;
const vscode_1 = require("vscode");
exports.REQUIRED_EXTENSION = 'github.copilot-chat';
const DEFAULT_MODEL_SELECTOR = { vendor: 'copilot', family: 'gpt-4' };
exports.logger = vscode_1.window.createOutputChannel("Spring tools copilot", { log: true });
function activateCopilotFeatures(context) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode_1.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('boot-java.highlight-copilot-codelens.on')) {
                promptReloadWindow();
            }
        });
        exports.logger.info("vscode.lm is ready.");
        yield configureGenAi();
        // Add listener to handle installation/uninstallation of the required extension
        vscode_1.extensions.onDidChange(() => __awaiter(this, void 0, void 0, function* () { return yield configureGenAi(); }));
        explainQueryWithGenAI();
    });
}
exports.activateCopilotFeatures = activateCopilotFeatures;
function configureGenAi() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isCursor() || isWindSurf()) {
            yield updateConfiguration(true);
        }
        else {
            yield ensureExtensionInstalledAndActivated();
            yield updateConfigurationBasedOnCopilotAccess();
        }
    });
}
function isCursor() {
    return vscode_1.env.appName === 'Cursor';
}
function isWindSurf() {
    return vscode_1.env.appName === 'Windsurf';
}
function ensureExtensionInstalledAndActivated() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isExtensionInstalled(exports.REQUIRED_EXTENSION)) {
            exports.logger.error(`Required extension ${exports.REQUIRED_EXTENSION} is not installed.`);
            return;
        }
        if (!isExtensionActivated(exports.REQUIRED_EXTENSION)) {
            exports.logger.error(`Required extension ${exports.REQUIRED_EXTENSION} is not activated.`);
            yield waitUntilExtensionActivated(exports.REQUIRED_EXTENSION);
        }
    });
}
function isExtensionInstalled(extensionId) {
    return !!vscode_1.extensions.getExtension(extensionId);
}
function isExtensionActivated(extensionId) {
    var _a;
    return !!((_a = vscode_1.extensions.getExtension(extensionId)) === null || _a === void 0 ? void 0 : _a.isActive);
}
function waitUntilExtensionActivated(extensionId, interval = 3500) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.logger.info(`Waiting for extension ${extensionId} to be activated...`);
        return new Promise((resolve) => {
            const id = setInterval(() => {
                var _a;
                if ((_a = vscode_1.extensions.getExtension(extensionId)) === null || _a === void 0 ? void 0 : _a.isActive) {
                    clearInterval(id);
                    resolve();
                }
            }, interval);
        });
    });
}
function updateConfigurationBasedOnCopilotAccess() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isExtensionInstalled(exports.REQUIRED_EXTENSION) || !isExtensionActivated(exports.REQUIRED_EXTENSION)) {
            yield updateConfiguration(false);
            return;
        }
        const models = yield vscode_1.lm.selectChatModels();
        if (!models || models.length === 0) {
            exports.logger.error(`No suitable model available. Please make sure you have installed the latest "GitHub Copilot Chat" (v0.16.0 or later) and all \`lm\` API is enabled.`);
            yield updateConfiguration(false);
        }
        else {
            yield updateConfiguration(true);
        }
    });
}
function updateConfiguration(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const configValue = vscode_1.workspace.getConfiguration().get('boot-java.highlight-copilot-codelens.on');
        if (value && configValue === true) {
            vscode_1.commands.executeCommand('sts/enable/copilot/features', value);
        }
    });
}
function explainQueryWithGenAI() {
    return __awaiter(this, void 0, void 0, function* () {
        vscode_1.commands.registerCommand('vscode-spring-boot.query.explain', (userPrompt) => __awaiter(this, void 0, void 0, function* () {
            if (isCursor()) {
                yield vscode_1.commands.executeCommand('composer.createNew', {
                    partialState: {
                        text: userPrompt
                    },
                    autoSubmit: true,
                    focusMainInputBox: true,
                    dontRefreshReactiveContext: true // Optional: prevents context refresh
                });
            }
            else {
                yield vscode_1.commands.executeCommand('workbench.action.chat.open', { query: userPrompt });
            }
        }));
    });
}
function promptReloadWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        const reload = yield vscode_1.window.showInformationMessage('Configuration updated. Please reload VS Code to apply changes.', 'Reload');
        if (reload === 'Reload') {
            yield vscode_1.commands.executeCommand('workbench.action.reloadWindow');
        }
    });
}
//# sourceMappingURL=index.js.map