import { useState, useEffect } from 'react';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { ask } from '@tauri-apps/plugin-dialog';
import { save } from '@tauri-apps/plugin-dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Editor.css"

function Editor() {
  const location = useLocation();

  const [currentFilePath, setCurrentFilePath] = useState(location.state?.filePath || "");

  const navigate = useNavigate();


  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState<string>('');

  useEffect(() => {
    const loadFileContent = async () => {
      if (currentFilePath) {
        try {
          console.log(`Reading file from path: ${currentFilePath}`);
          const fileContent = await readTextFile(currentFilePath);
          setContent(fileContent);
          setOriginalContent(fileContent);
          setHasUnsavedChanges(false);
          setError('');
        } catch (err) {
          console.error("Error reading file:", err);
          setError(`Failed to read file. Error: ${err}`);
          setContent('');
        }
      } else {
        setContent('');
        setOriginalContent('');
        setHasUnsavedChanges(false);
        setError('');
      }
    };

    loadFileContent();
  }, [currentFilePath]);

  useEffect(() => {
    setHasUnsavedChanges(content !== originalContent);
  }, [content, originalContent]);


  const handleSave = async () => {
    if (currentFilePath) {
      try {
        await writeTextFile(currentFilePath, content);
        setSaveStatus("File saved!");
      } catch (err) {
        setSaveStatus(`Error: ${err}`);
      }
    } else {
      try {
        const newPath = await save({
          title: "Save New File",
          filters: [
      {
        name: 'Text Documents (*.txt)',
        extensions: ['txt']
      },
      {
        name: 'All Files',
        extensions: ['*']
      }
    ]
        });

        if (newPath) {
          await writeTextFile(newPath, content);
          setCurrentFilePath(newPath);
          setSaveStatus("File saved!");
        }
      } catch (err) {
        setSaveStatus(`Error: ${err}`);
      }
    }

    setTimeout(() => setSaveStatus(''), 1000);
  };

  const handleExit = async () => {
    if (!hasUnsavedChanges) {
      navigate('/');
      return;
    }

    const shouldExit = await ask(
      "You have unsaved changes. Are you sure you want to exit?",
      {
        title: "Unsaved Changes",
      }
    );

    if (shouldExit) {
      navigate('/');
    }
  };

  return (
    <div>
        <div className="topBar">
            <p className="editorNameSeperator">{currentFilePath.split(/[\\/]/).pop()}{hasUnsavedChanges && "*"}</p>
            <div className="file">
                <span className="saveText">{saveStatus}</span>
                <button onClick={handleSave} className='fileButton'>Save</button>
            <button className="fileButton exitButton" onClick={handleExit}>Exit</button>
            </div>
        </div>
      <div className="textParent">
        {error ? (
                <div className='error'>{error}</div>
            ) : (
                <textarea
                className="textArea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder= {currentFilePath 
                            ? "Loading file content..." 
                            : "Start typing here..."}
                />
            )}     
      </div>
    </div>
  );
}

export default Editor;