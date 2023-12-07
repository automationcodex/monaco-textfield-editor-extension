// if someone clicks Ctrl + E we want to send a command to the background script to open the monaco editor
type TextOrHTMLInputElement = HTMLInputElement | HTMLTextAreaElement;

let elementMap = new Map<string, TextOrHTMLInputElement>();

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x'
                ? r
                : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const tryInitializeMonacoForElement = (element: Element | null): boolean => {

    if (element === null) {
        return false;
    }

    const tempElement = element as TextOrHTMLInputElement;

    // check if target is an input field or text area, if not, return by checking nodeName
    if (tempElement.nodeName !== "INPUT" && tempElement.nodeName !== "TEXTAREA") {
        return false;
    }

    const elementId = uuidv4();
    elementMap.set(elementId, tempElement);

    const currentValue = tempElement.value;

    const message: Message<MessageAction> = {
        action: "C2B_OPEN_MONACO",
        data: {
            text: currentValue,
            elementId: elementId
        }
    };

    // Send a message to the background script
    chrome.runtime.sendMessage(message);
    return true;
}


chrome.runtime.onMessage.addListener(async (message: Message<MessageAction>, sender, sendResponse) => {
    console.log("Received message from background.js:", message);

    switch (message.action) {
        case "B2P_SEND_MONACO_TEXT": {
            const sendTextMessage: Message<"B2P_SEND_MONACO_TEXT"> = message as Message<"B2P_SEND_MONACO_TEXT">;

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

            break;
        }
        case "B2C_EDIT_CURRENT_FIELD": { // This is received when the user clicks the context menu item or presses the shortcut

            const element = document.activeElement;
            tryInitializeMonacoForElement(element);

            break;
        }
    }
});