import { useEffect, useState, useRef } from 'react';
import './App.css';
import Editor, { loader } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import DropDown, { DropDownItem } from './components/DropDown';
import highlight from 'highlight.js';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import ThreeDotsMenu from './components/TreeDotsMenu';

const monacoLanguages: DropDownItem[] = [
  {
    name: 'JSON',
    value: 'json'
  },
  {
    name: 'JavaScript',
    value: 'javascript'
  },
  {
    name: 'TypeScript',
    value: 'typescript'
  },
  {
    name: 'HTML',
    value: 'html'
  },
  {
    name: 'CSS',
    value: 'css'
  },
  {
    name: 'Markdown',
    value: 'markdown'
  },
  {
    name: 'Python',
    value: 'python'
  },
  {
    name: 'XML',
    value: 'xml'
  },
  {
    name: 'Plain Text',
    value: 'plaintext'
  }
];

// Assuming that you have copied the 'vs' folder to the 'public' folder
loader.config({ paths: { vs: 'vs' } });

function App() {

  const [language, setLanguage] = useState<DropDownItem>(monacoLanguages[0]);
  const [callbackTabId, setCallbackTabId] = useState<number | undefined>(undefined);
  const [elementId, setElementId] = useState<string | undefined>(undefined);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const sendTextBack = async () => {

    if (!callbackTabId) {
      console.error('No callback tab id');
      return;
    }

    if (!elementId) {
      console.error('No element id');
      return;
    }

    const sendTextMessage: Message<"B2P_SEND_MONACO_TEXT"> = {
      action: "B2P_SEND_MONACO_TEXT",
      data: {
        text: editorRef.current?.getValue() ?? '',
        elementId: elementId
      }
    }

    if (chrome) {

      const tab = await chrome.tabs.get(callbackTabId);
      if (!tab) {
        console.error('No tab found');
        return;
      }

      chrome.tabs.sendMessage(callbackTabId, sendTextMessage);
    } else { // for dev
      alert(JSON.stringify(sendTextMessage));
    }
    window.close();
  }

  const formatEditor = () => {
    if (!editorRef.current) return;
    editorRef.current.getAction('editor.action.formatDocument')?.run();
  }

  const joinLines = () => {
    if (!editorRef.current) return;
    editorRef.current.trigger('keyboard', 'editor.action.selectAll', null);
    editorRef.current.getAction('editor.action.joinLines')?.run();
  }

  const goToTop = () => {
    if (!editorRef.current) return;
    editorRef.current.setPosition({ column: 1, lineNumber: 1 });
  }


  const getConfig = async () => {

    let config: MessageResponse<"P2B_GET_MONACO_CONFIG">;
    if (chrome) {

      const currentWindow = await chrome.windows.getCurrent();
      const currentWindowId = currentWindow.id;

      if (!currentWindowId) {
        console.error('No current window id');
        return;
      }

      const getConfigMessage: Message<"P2B_GET_MONACO_CONFIG"> = {
        action: "P2B_GET_MONACO_CONFIG",
        data: {
          windowId: currentWindowId
        }
      }

      config = await chrome.runtime.sendMessage(getConfigMessage);
    } else { // for dev
      config = {
        data: {
          callbackTabId: 0,
          elementId: '',
          text: `{ "test": "test" }`
        }
      }
    }

    const text = config.data.text;

    // Determine language from text using highlight.js

    const autoHighlightResult = highlight.highlightAuto(text)
    const language = autoHighlightResult.language;
    const secondBest = autoHighlightResult.secondBest;

    // Find matching language in monaco languages for language or second best, if no match, use "plaintext"

    let matchingLanguage = monacoLanguages.find((monacoLanguage) => monacoLanguage.value === language);
    matchingLanguage = matchingLanguage ? matchingLanguage : monacoLanguages.find((monacoLanguage) => monacoLanguage.value === secondBest?.language);
    matchingLanguage = matchingLanguage ? matchingLanguage : monacoLanguages.find((monacoLanguage) => monacoLanguage.value === 'plaintext');

    if (!matchingLanguage) {
      console.error('No matching language');
      return;
    }

    setLanguage(matchingLanguage);
    setCallbackTabId(config.data.callbackTabId);
    setElementId(config.data.elementId);

    editorRef.current?.setValue(text);
    formatEditor();
    goToTop();
  }

  const editorDidMount = async (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    await getConfig();
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
        sendTextBack();
      } else if (e.shiftKey && e.altKey && e.key.toUpperCase() === 'D') {
        e.preventDefault();
        joinLines();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [callbackTabId, elementId]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-grow w-full relative">
        <div className="absolute top-0 left-0 w-full h-full bg-midgray">
          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            language={language.value}
            onMount={editorDidMount}
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />

        </div>
      </div>
      <div className='flex flex-row w-full justify-end bg-darkgray border-t-[1px] border-lightgray border-solid'>

        {/* language dropdown */}
        <DropDown
          items={monacoLanguages}
          selectedItem={language}
          setSelectedItem={setLanguage}
        />
        <div className='h-full hidden sm:flex sm:flex-row'>
          {/* join lines button */}
          <button
            onClick={(e) => { joinLines(); e.stopPropagation(); e.preventDefault() }}
            className='bg-transparent text-gray-300 text-sm py-2 px-4 font-semibold text-center hover:bg-midgray shrink-0'
            title='Shift + Alt + D'>     
            JOIN LINES
          </button>
          {/* format button */}
          <button
            onClick={formatEditor}
            className='bg-transparent text-gray-300 text-sm py-2 px-4 font-semibold text-center hover:bg-midgray shrink-0'
            title='Shift + Alt + F'>
            FORMAT
          </button>
        </div>
        <div className='h-full flex flex-row sm:hidden hover:bg-midgray'>
          <ThreeDotsMenu items={[
            {
              name: 'Join Lines',
              title: 'Shift + Alt + D',
              onClick: () => joinLines()
            },
            {
              name: 'Format',
              title: 'Shift + Alt + F',
              onClick: () => formatEditor()
            }
          ]} />
        </div>


        {/* save button */}
        <button onClick={sendTextBack} className='bg-blue-500 text-white text-sm py-2 basis-24 font-semibold text-center shrink-0'>SAVE</button>
      </div>
    </div>
  );
}

export default App;
