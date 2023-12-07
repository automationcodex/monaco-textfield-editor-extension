
// key: windowId, value: text

interface MonacoPopupConfig {
    text: string;
    callbackTabId: number;
}

const windowIdToConfigMap = new Map<number, MessageResponse<"P2B_GET_MONACO_CONFIG">>();

const sendEditCurrentFieldMessage = (tabId: number) => {
    const message: Message<MessageAction> = {
        action: "B2C_EDIT_CURRENT_FIELD",
        data: undefined,
    };
    // Send a message to the content script
    chrome.tabs.sendMessage(tabId, message);
}

// Create a context menu item
chrome.contextMenus.create({
    id: "editFieldWithMonaco",
    title: "Edit with Monaco Textfield Editor",
    contexts: ["editable"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "editFieldWithMonaco" && tab?.id !== undefined) {
        sendEditCurrentFieldMessage(tab.id);
    }
});

chrome.commands.onCommand.addListener((command, tab) => {
    if (command === "edit-field-with-monaco" && tab?.id !== undefined) {
        sendEditCurrentFieldMessage(tab.id);
    }
});

chrome.runtime.onMessage.addListener(async (message: Message<MessageAction>, sender, sendResponse) => {
    console.log("Received message from content.js:", message);

    switch (message.action) {
        case "C2B_OPEN_MONACO": {

            const openMonacoMessage: Message<"C2B_OPEN_MONACO"> = message as Message<"C2B_OPEN_MONACO">;

            let framelessWindowOptions: chrome.windows.CreateData = {
                url: './build/index.html',
                type: 'popup',
                width: 800,
                height: 600,
                focused: true,
            };

            const monacoWindow = await chrome.windows.create(framelessWindowOptions);

            if (monacoWindow.id === undefined) {
                console.error("Could not create window");
                return;
            }

            if (sender.tab?.id === undefined) {
                console.error("Could not get tab");
                return;
            }

            const monacoWindowConfig: MessageResponse<"P2B_GET_MONACO_CONFIG"> = {
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
            const getTextMessage: Message<"P2B_GET_MONACO_CONFIG"> = message as Message<"P2B_GET_MONACO_CONFIG">;

            const config = windowIdToConfigMap.get(getTextMessage.data.windowId);

            if (config === undefined) {
                console.error("Could not find config");
                return;
            }

            sendResponse(config);
            break;
        }
    }

});  