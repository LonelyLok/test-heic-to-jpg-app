import { useState } from 'react';

export const Home = () => {
  const [inputFolder, setInputFolder] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pickerDivStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.1rem',
  };

  const selectFolder = async (setter) => {
    try {
      // Invoke main-process folder dialog
      // Assumes preload.js exposes `window.electronAPI.selectFolder`
      const folderPath = await window.backendAPI.selectFolder();
      if (folderPath) {
        setter(folderPath);
      }
    } catch (err) {
      console.error('Folder selection failed:', err);
    }
  };

  const submitToProcess = async () => {
    if (!inputFolder || !outputFolder) {
        alert('請選擇輸入資料夾和輸出資料夾');
        return;
    }
    try {
        setIsProcessing(true);
        await window.backendAPI.convertHeicToJpeg(inputFolder, outputFolder);
        setIsProcessing(false);
        alert('轉換完成');
    } catch (err) {
        console.error('轉換過程中發生錯誤:', err);
        alert('轉換過程中發生錯誤，請檢查輸入資料夾和輸出資料夾是否正確');
        setIsProcessing(false);
    }
  }

  return (
    <div>
      <h1>HEIC 轉 JPEG</h1>
      <div>
        <p>
        說明: HEIC 檔案會轉換成 JPEG 檔案，其他檔案則會複製過去。
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label>HEIC 圖片資料夾:</label>
        <div style={pickerDivStyle}>
          <button onClick={() => selectFolder(setInputFolder)}>
            選擇輸入資料夾
          </button>
          {inputFolder && <span>{inputFolder}</span>}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label>JPEG 圖片資料夾:</label>
        <div style={pickerDivStyle}>
          <button onClick={() => selectFolder(setOutputFolder)}>
            選擇輸出資料夾
          </button>
          {outputFolder && <span>{outputFolder}</span>}
        </div>
      </div>

      <div>
        <button onClick={submitToProcess}>轉換</button>
        {isProcessing && <span>轉換中...</span>}
      </div>
    </div>
  );
};
