# Monaco TextField Editor

Monaco TextField Editor is a Chrome extension that enables users to edit text fields on web pages using the Monaco Editor - a code editor that powers VS Code. This extension is perfect for those who require advanced text editing capabilities within their browser, such as syntax highlighting, auto-formatting, and a richer text editing experience.

## Features

- Utilize the Monaco Editor for enhanced editing in HTML inputs and textareas.
- Supports multiple programming languages, including JSON, JavaScript, TypeScript, HTML, CSS, Markdown, Python, XML, and Plain Text.
- Context menu integration for quick and easy access to the editor.
- Keyboard shortcuts for instant editor opening (`Ctrl+M` or `Command+M` for Mac) and saving edits (`Ctrl+S`).

## Installation

Monaco TextField Editor is now available on the Chrome Web Store! Install it with just one click:

[Monaco TextField Editor on the Chrome Web Store](https://chromewebstore.google.com/detail/monaco-textfield-editor/jeikeiklgehbehjkhnbmcpbjlnpgnllp)

Alternatively, you can still install it manually:

1. Download or clone the extension's source code.
2. Build the React popup application with the provided build scripts.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode" in the upper right corner.
5. Click on "Load unpacked" and select the `extension` folder where the extension files are located.
6. The extension is now ready for use in Chrome.

## Usage

- Right-click on any editable text field on a webpage and select "Edit with Monaco Textfield Editor" from the context menu.
- Alternatively, press `Ctrl+M` (`Command+M` for Mac) to activate the Monaco Editor for the focused text field.
- Enjoy advanced text editing features.
- Save your changes with a click on "SAVE" or by pressing `Ctrl+S`.

## Development

This extension uses TypeScript for Chrome extension scripts and React for the popup editor interface, styled with TailwindCSS.

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

Contributions to Monaco TextField Editor are welcome! Fork the repository and submit a pull request with your enhancements.

## License

This project is licensed under standard open-source licenses. See the LICENSE file for more details.

## Contact

For questions or issues regarding the extension, please open an issue in the [GitHub repository](https://github.com/automationcodex/monaco-textfield-editor-extension).
```

When updating the README, make sure to include the actual GitHub repository URL where it says `https://github.com/automationcodex/monaco-textfield-editor-extension`.