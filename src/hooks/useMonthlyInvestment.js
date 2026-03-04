import { useState, useEffect } from "react";
import {
  loadMonthlyInvestment,
  saveMonthlyInvestment,
  loadPreviousMonthInvestment,
} from "../utils/monthlyStorage";

export const useMonthlyInvestment = (month) => {
  const [investmentData, setInvestmentData] = useState({
    domestic: { addition: 0, current: 0 },
    overseas: { addition: 0, current: 0 },
    bond: { addition: 0, current: 0 },
    cash: { addition: 0, current: 0 },
  });
  const [prevMonthData, setPrevMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await loadMonthlyInvestment(month);
      const prevData = await loadPreviousMonthInvestment(month);
      setInvestmentData(data);
      setPrevMonthData(prevData);
      setLoading(false);
    };

    if (month) {
      loadData();
    }
  }, [month]);

  // 투자 항목 업데이트 (category: 'domestic' | 'overseas' | 'bond' | 'cash', field: 'addition' | 'current')
  const updateInvestment = (category, field, value) => {
    setInvestmentData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: Number(value) || 0,
      },
    }));
  };

  // 데이터 저장
  const saveInvestment = async () => {
    const success = await saveMonthlyInvestment(month, investmentData);
    return success;
  };

  // 새 데이터를 직접 받아서 저장
  const saveInvestmentWithData = async (data) => {
    const success = await saveMonthlyInvestment(month, data);
    return success;
  };

  // investmentData 변경 시 자동 저장 (초기 로드시에는 저장하지 않음)
  useEffect(() => {
    if (!month) return;
    if (!initialized) {
      setInitialized(true);
      return;
    }

    const persist = async () => {
      try {
        await saveMonthlyInvestment(month, investmentData);
      } catch (e) {
        console.error("자동 저장 실패 (investment):", e);
      }
    };

    persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investmentData]);

  // 증감액 계산: (현재금액) - (직전월 현재금액) - (추가금)
  const calculateChange = (category) => {
    const current = Number(investmentData[category]?.current) || 0;
    const addition = Number(investmentData[category]?.addition) || 0;
    const prevCurrent = prevMonthData
      ? Number(prevMonthData[category]?.current) || 0
      : 0;

    return current - prevCurrent - addition;
  };

  // 총계 계산
  const calculateTotal = () => {
    const categories = ["domestic", "overseas", "bond", "cash"];

    const totalAddition = categories.reduce(
      (sum, cat) => sum + (Number(investmentData[cat]?.addition) || 0),
      0,
    );

    const totalCurrent = categories.reduce(
      (sum, cat) => sum + (Number(investmentData[cat]?.current) || 0),
      0,
    );

    const prevTotalCurrent = prevMonthData
      ? categories.reduce(
          (sum, cat) => sum + (Number(prevMonthData[cat]?.current) || 0),
          0,
        )
      : 0;

    const totalChange = totalCurrent - prevTotalCurrent - totalAddition;

    return {
      addition: totalAddition,
      current: totalCurrent,
      change: totalChange,
    };
  };

  return {
    investmentData,
    prevMonthData,
    loading,
    updateInvestment,
    saveInvestment,
    saveInvestmentWithData,
    calculateChange,
    calculateTotal,
  };
};
