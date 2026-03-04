import React from 'react';
import { createNewFile, openExistingFile, isFileSystemSupported } from '../utils/fileSystemStorage';

const FileSelector = ({ onFileSelected }) => {
  const handleCreateNew = async () => {
    const success = await createNewFile();
    if (success) {
      onFileSelected();
    }
  };

  const handleOpenExisting = async () => {
    const data = await openExistingFile();
    if (data) {
      onFileSelected();
    }
  };

  if (!isFileSystemSupported()) {
    return (
      <div className="file-selector">
        <div className="file-selector-content">
          <h2>브라우저가 File System Access API를 지원하지 않습니다</h2>
          <p>Chrome, Edge 등 최신 브라우저를 사용해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-selector">
      <div className="file-selector-content">
        <h1>자산 관리</h1>
        <p>데이터 파일을 선택하거나 새로 만들어주세요.</p>
        <div className="file-selector-buttons">
          <button onClick={handleCreateNew} className="btn-primary">
            새 파일 만들기
          </button>
          <button onClick={handleOpenExisting} className="btn-secondary">
            기존 파일 열기
          </button>
        </div>
        <div className="file-selector-info">
          <p>💡 선택한 파일은 자동으로 저장됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
