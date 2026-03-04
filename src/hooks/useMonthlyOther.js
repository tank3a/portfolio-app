import { useState, useEffect } from "react";
import {
  loadMonthlyOther,
  saveMonthlyOther,
  loadPreviousMonthOther,
} from "../utils/monthlyStorage";

// UUID 생성
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useMonthlyOther = (month) => {
  const [otherData, setOtherData] = useState({
    pension: { addition: 0, current: 0 },
    savings: { housingSubscription: { addition: 0, current: 0 } },
    misc: [],
  });
  const [prevMonthData, setPrevMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await loadMonthlyOther(month);
      const prevData = await loadPreviousMonthOther(month);
      setOtherData(data);
      setPrevMonthData(prevData);
      setLoading(false);
    };

    if (month) loadData();
  }, [month]);

  // 연금 업데이트 (addition/current)
  const updatePension = (field, value) => {
    setOtherData((prev) => ({
      ...prev,
      pension: {
        ...prev.pension,
        [field]: Number(value) || 0,
      },
    }));
  };

  // 저축 업데이트 (housingSubscription.addition | current)
  const updateHousingSubscription = (field, value) => {
    setOtherData((prev) => ({
      ...prev,
      savings: {
        ...prev.savings,
        housingSubscription: {
          ...prev.savings.housingSubscription,
          [field]: Number(value) || 0,
        },
      },
    }));
  };

  // 기타 항목 추가/삭제/수정 (id,label,icon,amount)
  const addMisc = () => {
    const newItem = { id: generateId(), label: "", icon: "🔖", amount: 0 };
    setOtherData((prev) => ({ ...prev, misc: [...prev.misc, newItem] }));
  };

  const removeMisc = (id) => {
    setOtherData((prev) => ({
      ...prev,
      misc: prev.misc.filter((it) => it.id !== id),
    }));
  };

  const updateMisc = (id, field, value) => {
    setOtherData((prev) => ({
      ...prev,
      misc: prev.misc.map((it) =>
        it.id === id ? { ...it, [field]: value } : it,
      ),
    }));
  };

  const saveOther = async () => {
    const success = await saveMonthlyOther(month, otherData);
    return success;
  };

  // 새 데이터를 직접 받아서 저장 (state 업데이트 전에도 올바른 데이터 저장 가능)
  const saveOtherWithData = async (data) => {
    const success = await saveMonthlyOther(month, data);
    return success;
  };

  // auto-save on changes (skip initial load)
  useEffect(() => {
    if (!month) return;
    if (!initialized) {
      setInitialized(true);
      return;
    }

    const persist = async () => {
      try {
        await saveMonthlyOther(month, otherData);
      } catch (e) {
        console.error("자동 저장 실패 (other):", e);
      }
    };

    persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherData]);

  // 연금 증감액 계산: current - 직전월 current - 추가금
  const calculatePensionChange = () => {
    const current = Number(otherData.pension.current) || 0;
    const addition = Number(otherData.pension.addition) || 0;
    const prevCurrent = prevMonthData
      ? Number(prevMonthData.pension?.current) || 0
      : 0;
    return current - prevCurrent - addition;
  };

  // 저축 증감액 계산: current - 직전월 current - 추가금
  const calculateHousingSubscriptionChange = () => {
    const cur = Number(otherData.savings.housingSubscription.current) || 0;
    const add = Number(otherData.savings.housingSubscription.addition) || 0;
    const prevCur = prevMonthData
      ? Number(prevMonthData.savings?.housingSubscription?.current) || 0
      : 0;
    return cur - prevCur - add;
  };

  return {
    otherData,
    loading,
    updatePension,
    updateHousingSubscription,
    addMisc,
    removeMisc,
    updateMisc,
    saveOther,
    saveOtherWithData,
    calculatePensionChange,
    calculateHousingSubscriptionChange,
  };
};

export default useMonthlyOther;
