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
let elementMap = new Map();
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x'
            ? r
            : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
const tryInitializeMonacoForElement = (element) => {
    if (element === null) {
        return false;
    }
    const tempElement = element;
    // check if target is an input field or text area, if not, return by checking nodeName
    if (tempElement.nodeName !== "INPUT" && tempElement.nodeName !== "TEXTAREA") {
        return false;
    }
    const elementId = uuidv4();
    elementMap.set(elementId, tempElement);
    const currentValue = tempElement.value;
    const message = {
        action: "C2B_OPEN_MONACO",
        data: {
            text: currentValue,
            elementId: elementId
        }
    };
    // Send a message to the background script
    chrome.runtime.sendMessage(message);
    return true;
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received message from background.js:", message);
    switch (message.action) {
        case "B2P_SEND_MONACO_TEXT": {
            const sendTextMessage = message;
            const newText = sendTextMessage.data.text;
            const element = elementMap.get(sendTextMessage.data.elementId);
            if (element === undefined) {
                console.error("Could not find element");
                return;
            }
            element.value = newText;
            // trigger an input event to make sure the website registers the change
            const updateEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(updateEvent);
            elementMap.delete(sendTextMessage.data.elementId);
            break;
        }
        case "B2C_EDIT_CURRENT_FIELD": { // This is received when the user clicks the context menu item or presses the shortcut
            const element = document.activeElement;
            tryInitializeMonacoForElement(element);
            break;
        }
    }
}));
//# sourceMappingURL=content.js.map