import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { open } from '@tauri-apps/plugin-dialog';
import { emit } from '@tauri-apps/api/event';
import "./App.css";

import Home from './Home';
import Editor from './Editor';

function App() {
  const navigate = useNavigate();

  async function handleFileSelect() {
    const selectedPath = await open({
      multiple: false,
      filters: [
      {
        name: 'Text & Code Files',
        extensions: [
          'txt', 'md', 'log',
          'js', 'ts', 'jsx', 'tsx',
          'html', 'css', 'scss', 'json', 'xml', 'yaml', 'toml',
          'c', 'h', 'cpp', 'hpp', 'cc',
          'rs',
          'py',
          'java',
          'go',
          'rb',
          'php',
          'sh',
          'svg'
        ]
      },
      {
        name: 'All Files',
        extensions: ['*']
      }
    ]
    });

    if (typeof selectedPath === "string") {
      navigate('/editor', { state: { filePath: selectedPath } });
    } else {
      console.log("File selection was cancelled.");
    }
  }

  useEffect(() => {
    emit('frontend-ready');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home onFileSelect={handleFileSelect} />} />
      <Route path="/editor" element={<Editor />} />
    </Routes>
  );
}

export default App;