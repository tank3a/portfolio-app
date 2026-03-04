import { useState, useEffect, useCallback, useRef } from 'react';
import { loadHouseholdLedger, saveHouseholdLedger } from '../utils/monthlyStorage';

// 가계부 카테고리
export const LEDGER_CATEGORIES = [
  { id: 'food', label: '식비', icon: '🍽️', color: '#FF6B6B' },
  { id: 'beauty', label: '뷰티', icon: '🛍️', color: '#4ECDC4' },
  { id: 'transport', label: '교통', icon: '🚗', color: '#45B7D1' },
  { id: 'culture', label: '문화/여가', icon: '🎬', color: '#FFEAA7' },
  { id: 'fashion', label: '패션', icon: '📚', color: '#DDA0DD' },
  { id: 'housing', label: '주거/통신', icon: '🏠', color: '#96CEB4' },
  { id: 'travel', label: '여행/숙박', icon: '✈️', color: '#98D8C8' },
  { id: 'gift', label: '선물', icon: '🎁', color: '#F7DC6F' },
  { id: 'drinks', label: '술/유흥', icon: '🥃', color: '#e2bb20' },
  { id: 'health', label: '의료/건강', icon: '⚕️', color: '#4c439e' },
  { id: 'education', label: '교육/학습', icon: '🎓', color: '#77df80' },
  { id: 'daily', label: '생활', icon: '🥃', color: '#c064a4' },
  { id: 'finance', label: '금융', icon: '💰', color: '#dace9f' },
  { id: 'cafe', label: '카페/간식', icon: '☕', color: '#f0c080' },
  { id: 'etc', label: '기타', icon: '📦', color: '#AEB6BF' },
];

export const useHouseholdLedger = (month) => {
  const [ledgerData, setLedgerData] = useState({ entries: [] });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const saveTimeoutRef = useRef(null);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setInitialized(false);
      const data = await loadHouseholdLedger(month);
      setLedgerData(data);
      setLoading(false);
    };
    fetchData();
  }, [month]);

  // ledgerData 변경 시 자동 저장 (디바운스 적용)
  useEffect(() => {
    if (!month || loading) return;
    if (!initialized) {
      setInitialized(true);
      return;
    }

    // 디바운스: 300ms 후 저장
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveHouseholdLedger(month, ledgerData);
      } catch (e) {
        console.error('가계부 자동 저장 실패:', e);
      }
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledgerData]);

  // 항목 추가
  const addEntry = useCallback((category = 'etc') => {
    const newEntry = {
      id: `entry-${Date.now()}`,
      category,
      label: '',
      amount: 0,
      memo: '',
      date: new Date().toISOString().split('T')[0],
    };
    setLedgerData((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
    }));
  }, []);

  // 항목 삭제
  const removeEntry = useCallback((id) => {
    setLedgerData((prev) => ({
      ...prev,
      entries: prev.entries.filter((entry) => entry.id !== id),
    }));
  }, []);

  // 항목 수정
  const updateEntry = useCallback((id, field, value) => {
    setLedgerData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  }, []);

  // 저장 (수동 호출용 - 자동 저장이 기본이지만 즉시 저장이 필요할 때 사용)
  const saveLedger = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    return await saveHouseholdLedger(month, ledgerData);
  }, [month, ledgerData]);

  // 총 지출 계산
  const calculateTotal = useCallback(() => {
    return ledgerData.entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  }, [ledgerData]);

  // 카테고리별 지출 계산
  const calculateByCategory = useCallback(() => {
    const result = {};
    LEDGER_CATEGORIES.forEach((cat) => {
      result[cat.id] = 0;
    });

    ledgerData.entries.forEach((entry) => {
      if (result[entry.category] !== undefined) {
        result[entry.category] += Number(entry.amount || 0);
      }
    });

    return result;
  }, [ledgerData]);

  // 파이차트용 데이터
  const getChartData = useCallback(() => {
    const byCategory = calculateByCategory();
    return LEDGER_CATEGORIES
      .map((cat) => ({
        name: cat.label,
        value: byCategory[cat.id],
        color: cat.color,
        icon: cat.icon,
      }))
      .filter((item) => item.value > 0);
  }, [calculateByCategory]);

  return {
    ledgerData,
    loading,
    addEntry,
    removeEntry,
    updateEntry,
    saveLedger,
    calculateTotal,
    calculateByCategory,
    getChartData,
  };
};