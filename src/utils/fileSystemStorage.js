// File System Access API 유틸리티

let fileHandle = null;

// 브라우저가 File System Access API를 지원하는지 확인
export const isFileSystemSupported = () => {
  return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
};

// 새 파일 생성
export const createNewFile = async () => {
  try {
    const options = {
      suggestedName: 'asset-manager-data.json',
      types: [
        {
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    };

    fileHandle = await window.showSaveFilePicker(options);

    // 초기 데이터 저장
    const initialData = {
      assets: {
        cash: 0,
        investment: 0,
        housingSubscription: 0,
        deposit: 0,
        pension: 0,
        debt: 0,
      },
      history: [],
      monthlyData: {},
    };

    await saveToFile(initialData);
    return true;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('파일 생성 실패:', error);
    }
    return false;
  }
};

// 기존 파일 열기
export const openExistingFile = async () => {
  try {
    const options = {
      types: [
        {
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
      multiple: false,
    };

    const [handle] = await window.showOpenFilePicker(options);
    fileHandle = handle;

    // 파일 읽기
    const data = await loadFromFile();
    return data;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('파일 열기 실패:', error);
    }
    return null;
  }
};

// 파일에서 데이터 읽기
export const loadFromFile = async () => {
  if (!fileHandle) {
    return null;
  }

  try {
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('파일 읽기 실패:', error);
    return null;
  }
};

// 파일에 데이터 저장
export const saveToFile = async (data) => {
  if (!fileHandle) {
    console.error('파일이 선택되지 않았습니다.');
    return false;
  }

  try {
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
    return true;
  } catch (error) {
    console.error('파일 저장 실패:', error);
    return false;
  }
};

// 파일 핸들이 있는지 확인
export const hasFileHandle = () => {
  return fileHandle !== null;
};

// 파일 핸들 초기화
export const clearFileHandle = () => {
  fileHandle = null;
};

// 파일 이름 가져오기
export const getFileName = () => {
  if (!fileHandle) {
    return null;
  }
  return fileHandle.name;
};

// 백업 파일 저장
export const saveBackupFile = async (data) => {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const options = {
      suggestedName: `asset-manager-backup-${timestamp}.json`,
      types: [
        {
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    };

    const backupHandle = await window.showSaveFilePicker(options);
    const writable = await backupHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();

    return true;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('백업 파일 저장 실패:', error);
    }
    return false;
  }
};
