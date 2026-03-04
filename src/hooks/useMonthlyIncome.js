import { useState, useEffect } from "react";
import { loadMonthlyIncome, saveMonthlyIncome } from "../utils/monthlyStorage";

// UUID 생성 함수
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useMonthlyIncome = (month) => {
  const [incomeData, setIncomeData] = useState({ fixed: [], variable: [] });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await loadMonthlyIncome(month);
      setIncomeData(data);
      setLoading(false);
    };

    if (month) {
      loadData();
    }
  }, [month]);

  // 고정수입 금액 업데이트
  const updateFixedIncome = (id, amount) => {
    setIncomeData((prev) => ({
      ...prev,
      fixed: prev.fixed.map((item) =>
        item.id === id ? { ...item, amount } : item,
      ),
    }));
  };

  // 변동수입 추가
  const addVariableIncome = () => {
    const newItem = {
      id: generateId(),
      label: "",
      amount: 0,
    };
    setIncomeData((prev) => ({
      ...prev,
      variable: [...prev.variable, newItem],
    }));
  };

  // 변동수입 삭제
  const removeVariableIncome = (id) => {
    setIncomeData((prev) => ({
      ...prev,
      variable: prev.variable.filter((item) => item.id !== id),
    }));
  };

  // 변동수입 업데이트
  const updateVariableIncome = (id, field, value) => {
    setIncomeData((prev) => ({
      ...prev,
      variable: prev.variable.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  // 데이터 저장
  const saveIncome = async () => {
    const success = await saveMonthlyIncome(month, incomeData);
    return success;
  };

  // 새 데이터를 직접 받아서 저장
  const saveIncomeWithData = async (data) => {
    const success = await saveMonthlyIncome(month, data);
    return success;
  };

  // expenseData 변경 시(예: 항목 추가/삭제/수정) 자동 저장
  useEffect(() => {
    // 초기 로드 직후에는 저장을 건너뛰고, month가 유효할 때만 저장
    if (!month) return;
    if (!initialized) {
      // 첫 번째 expenseData 세팅은 로드 결과이므로 초기화 플래그만 설정
      setInitialized(true);
      return;
    }

    // 변경된 데이터를 저장 (비동기)
    const persist = async () => {
      try {
        await saveMonthlyIncome(month, incomeData);
      } catch (e) {
        console.error("자동 저장 실패:", e);
      }
    };

    persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeData]);

  // 데이터 재로드 (취소 시 사용)
  const reloadData = async () => {
    setLoading(true);
    const data = await loadMonthlyIncome(month);
    setIncomeData(data);
    setLoading(false);
  };

  // 총 수입 계산
  const calculateTotal = () => {
    const fixedTotal = incomeData.fixed.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    const variableTotal = incomeData.variable.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    return {
      fixed: fixedTotal,
      variable: variableTotal,
      total: fixedTotal + variableTotal,
    };
  };

  return {
    incomeData,
    loading,
    updateFixedIncome,
    addVariableIncome,
    removeVariableIncome,
    updateVariableIncome,
    saveIncome,
    saveIncomeWithData,
    reloadData,
    calculateTotal,
  };
};
