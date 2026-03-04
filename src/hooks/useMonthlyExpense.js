import { useState, useEffect } from "react";
import {
  loadMonthlyExpense,
  saveMonthlyExpense,
} from "../utils/monthlyStorage";

// UUID 생성 함수
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useMonthlyExpense = (month) => {
  const [expenseData, setExpenseData] = useState({
    fixed: { housing: [], living: [], subscription: [] },
    variable: [],
  });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await loadMonthlyExpense(month);
      setExpenseData(data);
      setLoading(false);
    };

    if (month) {
      loadData();
    }
  }, [month]);

  // 고정지출 금액 업데이트 (category: 'housing' | 'living' | 'subscription')
  const updateFixedExpense = (category, id, amount) => {
    setExpenseData((prev) => ({
      ...prev,
      fixed: {
        ...prev.fixed,
        [category]: prev.fixed[category].map((item) =>
          item.id === id ? { ...item, amount } : item,
        ),
      },
    }));
  };

  // 변동지출 추가
  const addVariableExpense = () => {
    const newItem = {
      id: generateId(),
      label: "",
      amount: 0,
    };
    setExpenseData((prev) => ({
      ...prev,
      variable: [...prev.variable, newItem],
    }));
  };

  // 변동지출 삭제
  const removeVariableExpense = (id) => {
    setExpenseData((prev) => ({
      ...prev,
      variable: prev.variable.filter((item) => item.id !== id),
    }));
  };

  // 변동지출 업데이트
  const updateVariableExpense = (id, field, value) => {
    setExpenseData((prev) => ({
      ...prev,
      variable: prev.variable.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  // 데이터 저장
  const saveExpense = async () => {
    const success = await saveMonthlyExpense(month, expenseData);
    return success;
  };

  // 새 데이터를 직접 받아서 저장
  const saveExpenseWithData = async (data) => {
    const success = await saveMonthlyExpense(month, data);
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
        await saveMonthlyExpense(month, expenseData);
      } catch (e) {
        console.error("자동 저장 실패:", e);
      }
    };

    persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseData]);

  // 총 지출 계산
  const calculateTotal = () => {
    const housingTotal = expenseData.fixed.housing.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    const livingTotal = expenseData.fixed.living.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    const subscriptionTotal = expenseData.fixed.subscription.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    const fixedTotal = housingTotal + livingTotal + subscriptionTotal;
    const variableTotal = expenseData.variable.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    return {
      housing: housingTotal,
      living: livingTotal,
      subscription: subscriptionTotal,
      fixed: fixedTotal,
      variable: variableTotal,
      total: fixedTotal + variableTotal,
    };
  };

  return {
    expenseData,
    loading,
    updateFixedExpense,
    addVariableExpense,
    removeVariableExpense,
    updateVariableExpense,
    saveExpense,
    saveExpenseWithData,
    calculateTotal,
  };
};
