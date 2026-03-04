import { useState, useEffect } from 'react';
import {
  loadData,
  saveData,
  updateAssets as updateAssetsUtil,
  setInitialAssets as setInitialAssetsUtil,
  resetDataWithBackup,
} from '../utils/storage';
import { hasFileHandle } from '../utils/fileSystemStorage';

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
};

export const useAssets = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  // 초기 로드
  useEffect(() => {
    const loadInitialData = async () => {
      if (hasFileHandle()) {
        setFileSelected(true);
        const loadedData = await loadData();
        setData(loadedData);
      }
    };
    loadInitialData();
  }, []);

  // 데이터 다시 로드
  const reloadData = async () => {
    if (hasFileHandle()) {
      const loadedData = await loadData();
      setData(loadedData);
    }
  };

  // 초기 자산 설정 (26년 시작)
  const setInitialAssets = async (newAssets) => {
    setLoading(true);
    const success = await setInitialAssetsUtil(newAssets);
    if (success) {
      await reloadData();
    }
    setLoading(false);
    return success;
  };

  // 자산 업데이트
  const updateAssets = async (newAssets) => {
    setLoading(true);
    const success = await updateAssetsUtil(newAssets);
    if (success) {
      await reloadData();
    }
    setLoading(false);
    return success;
  };

  // 개별 자산 항목 업데이트
  const updateAssetItem = (key, value) => {
    const newAssets = {
      ...data.assets,
      [key]: value,
    };
    setData((prev) => ({
      ...prev,
      assets: newAssets,
    }));
  };

  // 데이터 초기화 (백업 생성 후)
  const resetData = async () => {
    setLoading(true);
    const success = await resetDataWithBackup();
    if (success) {
      await reloadData();
    }
    setLoading(false);
    return success;
  };

  // 파일 선택 상태 업데이트
  const updateFileSelected = (selected) => {
    setFileSelected(selected);
  };

  return {
    assets: data.assets,
    history: data.history,
    setInitialAssets,
    updateAssets,
    updateAssetItem,
    resetData,
    loading,
    fileSelected,
    updateFileSelected,
    reloadData,
  };
};
