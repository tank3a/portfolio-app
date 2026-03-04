// File System Storage 관리 유틸리티
import {
  loadFromFile,
  saveToFile,
  saveBackupFile,
  hasFileHandle,
} from './fileSystemStorage';

// 초기 데이터 구조
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

// 데이터 불러오기
export const loadData = async () => {
  try {
    if (!hasFileHandle()) {
      return initialData;
    }
    const data = await loadFromFile();
    return data || initialData;
  } catch (error) {
    console.error('데이터 로드 실패:', error);
    return initialData;
  }
};

// 데이터 저장하기
export const saveData = async (data) => {
  try {
    if (!hasFileHandle()) {
      console.error('파일이 선택되지 않았습니다.');
      return false;
    }
    return await saveToFile(data);
  } catch (error) {
    console.error('데이터 저장 실패:', error);
    return false;
  }
};

// 초기 자산 설정 (26년 시작)
export const setInitialAssets = async (assets) => {
  const data = await loadData();
  const newData = {
    ...data,
    assets,
    history: [
      {
        date: '2026-01-01T00:00:00.000Z', // 26년 시작
        assets: { ...assets },
      },
    ],
  };
  return await saveData(newData);
};

// 자산 업데이트 (월별 데이터 추가용 - 추후 사용)
export const updateAssets = async (assets) => {
  const data = await loadData();
  const newData = {
    ...data,
    assets,
    history: [
      ...data.history,
      {
        date: new Date().toISOString(),
        assets: { ...assets },
      },
    ],
  };
  return await saveData(newData);
};

// 순자산 계산 (현금 + 투자자산 + 주택청약저축 + 전세금 + 연금)
export const calculateNetAssets = (assets) => {
  return Object.entries(assets)
    .filter(([key]) => key !== 'debt')
    .reduce((sum, [, value]) => sum + Number(value || 0), 0);
};

// 총 자산 계산 (순자산 + 부채)
export const calculateTotalAssets = (assets) => {
  return calculateNetAssets(assets) + Number(assets.debt || 0);
};

// 백업 생성 (파일로 저장)
export const createBackup = async () => {
  try {
    const data = await loadData();
    const success = await saveBackupFile(data);

    if (success) {
      console.log('백업 생성 완료');
    }
    return success;
  } catch (error) {
    console.error('백업 생성 실패:', error);
    return false;
  }
};

// 데이터 초기화 (백업 생성 후)
export const resetDataWithBackup = async () => {
  // 경고 메시지 표시
  const confirmed = window.confirm(
    '모든 데이터가 초기화됩니다.\n백업 파일은 자동으로 생성됩니다.\n계속하시겠습니까?'
  );

  if (!confirmed) {
    return false;
  }

  try {
    // 백업 생성
    await createBackup();

    // 데이터 초기화
    return await saveData(initialData);
  } catch (error) {
    console.error('데이터 초기화 실패:', error);
    return false;
  }
};
