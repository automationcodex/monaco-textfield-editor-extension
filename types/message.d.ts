declare global {
    type MessageAction =
        | "C2B_OPEN_MONACO" // content to background
        | "P2B_GET_MONACO_CONFIG" // popup to background
        | "B2P_SEND_MONACO_TEXT" // background to popup
        | "B2C_EDIT_CURRENT_FIELD" // background to content
        ;

    interface MessageData {
        "C2B_OPEN_MONACO": {
            text: string;
            elementId: string;
        };
        "P2B_GET_MONACO_CONFIG": {
            windowId: number;
        };
        "B2P_SEND_MONACO_TEXT": {
            text: string;
            elementId: string;
        };
    }

    interface MessageDataResponse {
        "C2B_OPEN_MONACO": undefined;
        "P2B_GET_MONACO_CONFIG": {
            text: string;
            callbackTabId: number;
            elementId: string;
        };
    }

    interface Message<T extends MessageAction> {
        action: T;
        data: MessageData[T];
    }

    interface MessageResponse<T extends MessageAction> {
        data: MessageDataResponse[T];
    }
}

// to fix issues where there's no import/export to trigger module context
export { };