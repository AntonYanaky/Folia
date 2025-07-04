import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { readTextFile } from '@tauri-apps/plugin-fs';
import "./Editor.css"

function Editor() {
  const location = useLocation();
  const filePath = location.state?.filePath || "";

  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadFileContent = async () => {
      if (!filePath) {
        setError("No file path provided.");
        return;
      }
      
      try {
        console.log(`Reading file from path: ${filePath}`);
        const fileContent = await readTextFile(filePath);
        setContent(fileContent);
        setError('');
      } catch (err) {
        console.error("Error reading file:", err);
        setError(`Failed to read file. Error: ${err}`);
        setContent('');
      }
    };

    loadFileContent();
  }, [filePath]);

  return (
    <div>
        <div className="topBar">
            <p className="editorNameSeperator">{filePath.split(/[\\/]/).pop()}</p>
            <div className="file"><button className="fileButton">Save</button></div>
        </div>
      <div className="textParent">
        {error ? (
                <div style={{ color: 'red', padding: '1rem' }}>{error}</div>
            ) : (
                <textarea
                className="textArea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Loading file content..."
                />
            )}     
      </div>
      <div className="fileInfo">
        Lines:
      </div>
    </div>
  );
}

export default Editor;