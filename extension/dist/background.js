"use strict";
// key: windowId, value: text
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const windowIdToConfigMap = new Map();
const sendEditCurrentFieldMessage = (tabId) => {
    const message = {
        action: "B2C_EDIT_CURRENT_FIELD",
        data: undefined,
    };
    // Send a message to the content script
    chrome.tabs.sendMessage(tabId, message);
};
// Create a context menu item
chrome.contextMenus.create({
    id: "editFieldWithMonaco",
    title: "Edit with Monaco Textfield Editor",
    contexts: ["editable"]
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "editFieldWithMonaco" && (tab === null || tab === void 0 ? void 0 : tab.id) !== undefined) {
        sendEditCurrentFieldMessage(tab.id);
    }
});
chrome.commands.onCommand.addListener((command, tab) => {
    if (command === "edit-field-with-monaco" && (tab === null || tab === void 0 ? void 0 : tab.id) !== undefined) {
        sendEditCurrentFieldMessage(tab.id);
    }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Received message from content.js:", message);
    switch (message.action) {
        case "C2B_OPEN_MONACO": {
            const openMonacoMessage = message;
            let framelessWindowOptions = {
                url: './build/index.html',
                type: 'popup',
                width: 800,
                height: 600,
                focused: true,
            };
            const monacoWindow = yield chrome.windows.create(framelessWindowOptions);
            if (monacoWindow.id === undefined) {
                console.error("Could not create window");
                return;
            }
            if (((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id) === undefined) {
                console.error("Could not get tab");
                return;
            }
            const monacoWindowConfig = {
                data: {
                    text: openMonacoMessage.data.text,
                    callbackTabId: sender.tab.id,
                    elementId: openMonacoMessage.data.elementId,
                }
            };
            // store the text in the map
            windowIdToConfigMap.set(monacoWindow.id, monacoWindowConfig);
            break;
        }
        case "P2B_GET_MONACO_CONFIG": {
            const getTextMessage = message;
            const config = windowIdToConfigMap.get(getTextMessage.data.windowId);
            if (config === undefined) {
                console.error("Could not find config");
                return;
            }
            sendResponse(config);
            break;
        }
    }
}));
//# sourceMappingURL=background.js.map