# Monaco TextField Editor

Monaco TextField Editor is a Chrome extension that enables users to edit text fields on web pages using the Monaco Editor - a code editor that powers VS Code. This extension is perfect for those who require advanced text editing capabilities within their browser, such as syntax highlighting, auto-formatting, and a richer text editing experience.

## Features

- Use the Monaco Editor to edit HTML inputs and textareas
- Support for multiple programming languages including JSON, JavaScript, TypeScript, HTML, CSS, Markdown, Python, XML, and Plain Text
- Easily switch between different syntax highlighting
- Context menu integration for quick access to the editor
- Keyboard shortcut support to instantly open the editor

## Installation

The extension is not listed in the Chrome Web Store; hence, it needs to be installed manually:

1. Download the extension's source code and build the React popup application.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the upper right corner.
4. Click on "Load unpacked" and select the `extension` folder where you built the extension.
5. Once loaded, the extension will be available for use in Chrome.

## Usage

- Right-click on any editable text field on a webpage and select "Edit with Monaco Textfield Editor" from the context menu.
- Alternatively, use the keyboard shortcut `Ctrl+M` (or `Command+M` for Mac) to open the Monaco Editor for the currently focused text field.
- Edit your text with enhanced features provided by the Monaco Editor.
- Once you're done editing, click on "SAVE" or use the `Ctrl+S` shortcut to apply the changes to the original text field on the webpage.

## Development

This extension uses TypeScript for the Chrome extension scripts and React for the popup editor interface, along with TailwindCSS for styling.

### Building the React Popup

You need to build the React application before it can be used by the Chrome extension.

```bash
cd react-popup
npm install
npm run build
```

The build script will place the compiled React app into the `extension/build` folder, making it accessible to the Chrome extension.

To rebuild any of the code in the extension/src folder:

```bash
cd extension
tsc
```

## Contributing

If you'd like to contribute to the development of this Chrome extension, feel free to fork the repository and submit a pull request with your improvements.

## License

The code for this extension is made available under a standard open-source license. Please check the LICENSE file for more information.

## Contact

For any queries or issues related to the extension, please open an issue in the repository issue tracker.