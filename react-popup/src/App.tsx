import { useEffect, useState } from 'react';
import './App.css';
import Editor, { loader } from '@monaco-editor/react';
import DropDown, { DropDownItem } from './components/DropDown';

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

  const [value, setValue] = useState('init');
  const [callbackTabId, setCallbackTabId] = useState<number | undefined>(undefined);
  const [elementId, setElementId] = useState<string | undefined>(undefined);

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
        text: value,
        elementId: elementId
      }
    }

    const tab = await chrome.tabs.get(callbackTabId);
    if (!tab) {
      console.error('No tab found');
      return;
    }

    chrome.tabs.sendMessage(callbackTabId, sendTextMessage);
    window.close();

  }

  useEffect(() => {

    // Initialize monaco editor

    loader.init().then(monaco => {
    });

    // Get text and callback tab id from background script

    const getConfig = async () => {
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

      const config: MessageResponse<"P2B_GET_MONACO_CONFIG"> = await chrome.runtime.sendMessage(getConfigMessage);
      setValue(config.data.text);
      setCallbackTabId(config.data.callbackTabId);
      setElementId(config.data.elementId);
    }

    getConfig();

  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        sendTextBack();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [value, callbackTabId, elementId]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-grow w-full relative">
        <div className="absolute top-0 left-0 w-full h-full bg-midgray">
          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            language={language.value}
            value={value}
            onChange={(value) => setValue(value || '')}

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
        <DropDown
          items={monacoLanguages}
          selectedItem={language}
          setSelectedItem={setLanguage}
        />
        <button onClick={sendTextBack} className='bg-blue-500 text-white text-sm p-2 font-semibold basis-24 text-center'>SAVE</button>
      </div>
    </div>
  );
}

export default App;
