// 월별 데이터 관리 유틸리티
import { loadData, saveData } from "./storage";

// 기본 고정수입 항목 생성
const initializeMonthIncome = () => {
  return {
    fixed: [
      { id: "salary", label: "급여", amount: 0 },
      { id: "mobile-refund", label: "통신비 환급", amount: 0 },
      { id: "kpass-refund", label: "K-Pass 환급", amount: 0 },
    ],
    variable: [],
  };
};

// 월별 수입 데이터 로드
export const loadMonthlyIncome = async (month) => {
  try {
    const data = await loadData();

    // monthlyData가 없으면 초기화
    if (!data.monthlyData) {
      return initializeMonthIncome();
    }

    // 해당 월 데이터가 없으면 초기화
    if (!data.monthlyData[month] || !data.monthlyData[month].income) {
      return initializeMonthIncome();
    }

    return data.monthlyData[month].income;
  } catch (error) {
    console.error("월별 수입 데이터 로드 실패:", error);
    return initializeMonthIncome();
  }
};

// 월별 수입 데이터 저장
export const saveMonthlyIncome = async (month, incomeData) => {
  try {
    const data = await loadData();

    // monthlyData 초기화
    if (!data.monthlyData) {
      data.monthlyData = {};
    }

    // 해당 월 데이터 초기화
    if (!data.monthlyData[month]) {
      data.monthlyData[month] = {};
    }

    // 수입 데이터 저장
    data.monthlyData[month].income = incomeData;

    return await saveData(data);
  } catch (error) {
    console.error("월별 수입 데이터 저장 실패:", error);
    return false;
  }
};

// 기본 고정지출 항목 생성
const initializeMonthExpense = () => {
  return {
    fixed: {
      housing: [
        { id: "loan-interest", label: "전세자금대출이자", amount: 0 },
        { id: "loan-principal", label: "전세 원리금 상환", amount: 0 },
        { id: "maintenance", label: "관리비", amount: 0 },
        { id: "gas", label: "가스비", amount: 0 },
      ],
      living: [{ id: "mobile", label: "통신비", amount: 0 }],
      subscription: [
        { id: "soccer", label: "싸커비", amount: 0, endDate: "2026-03" },
        { id: "icloud", label: "iCloud", amount: 0 },
        { id: "wooju-pass", label: "우주패스", amount: 0 },
        { id: "club-fee", label: "햅라 회비", amount: 0 },
        { id: "insurance", label: "실비", amount: 0 },
        { id: "youtube", label: "유튜브 프리미엄", amount: 0 },
        { id: "claude", label: "Claude 구독", amount: 0 },
        { id: "kakaotalk-cloud", label: "톡서랍 플러스", amount: 0 },
      ],
    },
    variable: [],
  };
};

// 월별 지출 데이터 로드
export const loadMonthlyExpense = async (month) => {
  try {
    const data = await loadData();

    // monthlyData가 없으면 초기화
    if (!data.monthlyData) {
      return initializeMonthExpense();
    }

    // 해당 월 데이터가 없으면 초기화
    if (!data.monthlyData[month] || !data.monthlyData[month].expense) {
      return initializeMonthExpense();
    }

    return data.monthlyData[month].expense;
  } catch (error) {
    console.error("월별 지출 데이터 로드 실패:", error);
    return initializeMonthExpense();
  }
};

// 월별 지출 데이터 저장
export const saveMonthlyExpense = async (month, expenseData) => {
  try {
    const data = await loadData();

    // monthlyData 초기화
    if (!data.monthlyData) {
      data.monthlyData = {};
    }

    // 해당 월 데이터 초기화
    if (!data.monthlyData[month]) {
      data.monthlyData[month] = {};
    }

    // 지출 데이터 저장
    data.monthlyData[month].expense = expenseData;

    return await saveData(data);
  } catch (error) {
    console.error("월별 지출 데이터 저장 실패:", error);
    return false;
  }
};

// 기본 투자 항목 생성
const initializeMonthInvestment = () => {
  return {
    domestic: { addition: 0, current: 0 },
    overseas: { addition: 0, current: 0 },
    bond: { addition: 0, current: 0 },
    cash: { addition: 0, current: 0 },
  };
};

// 월별 투자 데이터 로드
export const loadMonthlyInvestment = async (month) => {
  try {
    const data = await loadData();

    // monthlyData가 없으면 초기화
    if (!data.monthlyData) {
      return initializeMonthInvestment();
    }

    // 해당 월 데이터가 없으면 초기화
    if (!data.monthlyData[month] || !data.monthlyData[month].investment) {
      return initializeMonthInvestment();
    }

    return data.monthlyData[month].investment;
  } catch (error) {
    console.error("월별 투자 데이터 로드 실패:", error);
    return initializeMonthInvestment();
  }
};

// 월별 투자 데이터 저장
export const saveMonthlyInvestment = async (month, investmentData) => {
  try {
    const data = await loadData();

    // monthlyData 초기화
    if (!data.monthlyData) {
      data.monthlyData = {};
    }

    // 해당 월 데이터 초기화
    if (!data.monthlyData[month]) {
      data.monthlyData[month] = {};
    }

    // 투자 데이터 저장
    data.monthlyData[month].investment = investmentData;

    return await saveData(data);
  } catch (error) {
    console.error("월별 투자 데이터 저장 실패:", error);
    return false;
  }
};

// 직전월 투자 데이터 로드 (증감액 계산용)
export const loadPreviousMonthInvestment = async (month) => {
  const prevMonth = month === 1 ? null : month - 1;

  if (!prevMonth) {
    return null;
  }

  try {
    const data = await loadData();

    if (
      !data.monthlyData ||
      !data.monthlyData[prevMonth] ||
      !data.monthlyData[prevMonth].investment
    ) {
      return null;
    }

    return data.monthlyData[prevMonth].investment;
  } catch (error) {
    console.error("직전월 투자 데이터 로드 실패:", error);
    return null;
  }
};

// 기본 기타 항목 생성
const initializeMonthOther = () => {
  return {
    pension: {
      addition: 0,
      current: 0,
    },
    savings: {
      housingSubscription: {
        addition: 0,
        current: 0,
      },
    },
    misc: [], // 변동 기타 항목 (id, label, icon?, amount)
  };
};

// 월별 기타 데이터 로드
export const loadMonthlyOther = async (month) => {
  try {
    const data = await loadData();

    if (!data.monthlyData) {
      return initializeMonthOther();
    }

    if (!data.monthlyData[month] || !data.monthlyData[month].other) {
      return initializeMonthOther();
    }

    return data.monthlyData[month].other;
  } catch (error) {
    console.error("월별 기타 데이터 로드 실패:", error);
    return initializeMonthOther();
  }
};

// 월별 기타 데이터 저장
export const saveMonthlyOther = async (month, otherData) => {
  try {
    const data = await loadData();

    if (!data.monthlyData) {
      data.monthlyData = {};
    }

    if (!data.monthlyData[month]) {
      data.monthlyData[month] = {};
    }

    data.monthlyData[month].other = otherData;

    return await saveData(data);
  } catch (error) {
    console.error("월별 기타 데이터 저장 실패:", error);
    return false;
  }
};

// 직전월 기타 데이터 로드
export const loadPreviousMonthOther = async (month) => {
  const prevMonth = month === 1 ? null : month - 1;

  if (!prevMonth) {
    return null;
  }

  try {
    const data = await loadData();

    if (
      !data.monthlyData ||
      !data.monthlyData[prevMonth] ||
      !data.monthlyData[prevMonth].other
    ) {
      return null;
    }

    return data.monthlyData[prevMonth].other;
  } catch (error) {
    console.error("직전월 기타 데이터 로드 실패:", error);
    return null;
  }
};

// 모든 월별 데이터 로드 (1-12월)
export const loadAllMonthlyData = async () => {
  try {
    const data = await loadData();
    return data.monthlyData || {};
  } catch (error) {
    console.error("월별 데이터 로드 실패:", error);
    return {};
  }
};

// 초기 자산 데이터 로드
export const loadInitialAssets = async () => {
  try {
    const data = await loadData();
    if (data.history && data.history.length > 0) {
      return data.history[0].assets;
    }
    return data.assets || {
      cash: 0,
      investment: 0,
      housingSubscription: 0,
      deposit: 0,
      pension: 0,
      debt: 0,
    };
  } catch (error) {
    console.error("초기 자산 데이터 로드 실패:", error);
    return {
      cash: 0,
      investment: 0,
      housingSubscription: 0,
      deposit: 0,
      pension: 0,
      debt: 0,
    };
  }
};

// 월별 수입 합계 계산
const calculateMonthlyIncomeTotal = (income) => {
  if (!income) return 0;
  const fixedTotal = (income.fixed || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const variableTotal = (income.variable || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return fixedTotal + variableTotal;
};

// 월별 지출 합계 계산
const calculateMonthlyExpenseTotal = (expense) => {
  if (!expense) return 0;

  let total = 0;

  // 고정지출
  if (expense.fixed) {
    const { housing, living, subscription } = expense.fixed;
    total += (housing || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    total += (living || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    total += (subscription || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }

  // 변동지출
  total += (expense.variable || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return total;
};

// 월별 전세 원리금 상환액 가져오기
const getLoanPrincipalPayment = (expense) => {
  if (!expense || !expense.fixed || !expense.fixed.housing) return 0;
  const loanPrincipal = expense.fixed.housing.find(item => item.id === "loan-principal");
  return loanPrincipal ? Number(loanPrincipal.amount || 0) : 0;
};

// 월별 가계부 지출 합계
const calculateHouseholdLedgerTotal = (householdLedger) => {
  if (!householdLedger || !householdLedger.entries) return 0;
  return householdLedger.entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
};

// 월별 투자 추가금 합계
const calculateInvestmentAddition = (investment) => {
  if (!investment) return 0;
  return (
    Number(investment.domestic?.addition || 0) +
    Number(investment.overseas?.addition || 0) +
    Number(investment.bond?.addition || 0) +
    Number(investment.cash?.addition || 0)
  );
};

// 월별 투자자산 현재금액 합계
const calculateInvestmentCurrent = (investment) => {
  if (!investment) return 0;
  return (
    Number(investment.domestic?.current || 0) +
    Number(investment.overseas?.current || 0) +
    Number(investment.bond?.current || 0) +
    Number(investment.cash?.current || 0)
  );
};

// 월별 기타 추가금 합계 (연금 + 주택청약)
const calculateOtherAddition = (other) => {
  if (!other) return 0;
  return (
    Number(other.pension?.addition || 0) +
    Number(other.savings?.housingSubscription?.addition || 0)
  );
};

// 월별 자산 계산 (1-12월)
export const calculateMonthlyAssets = async () => {
  try {
    const data = await loadData();
    const monthlyData = data.monthlyData || {};
    const initialAssets = data.history && data.history.length > 0
      ? data.history[0].assets
      : data.assets;

    const result = [];

    // 26년 시작 데이터
    result.push({
      label: "26년 시작",
      assets: { ...initialAssets },
      expense: 0,
    });

    // 1-12월 계산
    for (let month = 1; month <= 12; month++) {
      const monthData = monthlyData[month] || {};
      const prevAssets = result[result.length - 1].assets;

      // 투자자산: 월별 투자자산 탭의 현재금액 합산
      const investment = calculateInvestmentCurrent(monthData.investment);

      // 주택청약저축: 월별 기타 > 주택청약저축의 현재금액
      const housingSubscription = Number(monthData.other?.savings?.housingSubscription?.current || 0);

      // 전세금: 직전월 + 전세 원리금 상환액
      const loanPrincipal = getLoanPrincipalPayment(monthData.expense);
      const deposit = Number(prevAssets.deposit || 0) + loanPrincipal;

      // 연금: 기타 > 연금의 현재 금액
      const pension = Number(monthData.other?.pension?.current || 0);

      // 부채: 26년 시작 부채 - (26년 시작 전세금 - 현재 전세금)
      // 즉, 전세금이 줄어든 만큼 부채도 줄어듦
      const initialDebt = Number(initialAssets.debt || 0);
      const initialDeposit = Number(initialAssets.deposit || 0);
      const debt = initialDebt - (initialDeposit - deposit);

      // 현금: 직전월 현금 + (수입 - 지출) - 투자 추가금 - 기타 추가금
      const income = calculateMonthlyIncomeTotal(monthData.income);
      const expense = calculateMonthlyExpenseTotal(monthData.expense);
      const ledgerExpense = calculateHouseholdLedgerTotal(monthData.householdLedger);
      const investmentAddition = calculateInvestmentAddition(monthData.investment);
      const otherAddition = calculateOtherAddition(monthData.other);
      const cash = Number(prevAssets.cash || 0) + (income - expense - ledgerExpense) - investmentAddition - otherAddition;

      result.push({
        label: `${month}월`,
        assets: {
          cash,
          investment,
          housingSubscription,
          deposit,
          pension,
          debt,
        },
        expense: expense + ledgerExpense,
      });
    }

    return result;
  } catch (error) {
    console.error("월별 자산 계산 실패:", error);
    return [];
  }
};

// 현재 월 가져오기 (오늘 날짜 기준)
export const getCurrentMonth = () => {
  const now = new Date();
  return now.getMonth() + 1; // 1-12
};

// 기본 가계부 항목 생성
const initializeHouseholdLedger = () => {
  return {
    entries: [], // { id, category, label, amount, memo, date }
  };
};

// 월별 가계부 데이터 로드
export const loadHouseholdLedger = async (month) => {
  try {
    const data = await loadData();

    if (!data.monthlyData) {
      return initializeHouseholdLedger();
    }

    if (!data.monthlyData[month] || !data.monthlyData[month].householdLedger) {
      return initializeHouseholdLedger();
    }

    return data.monthlyData[month].householdLedger;
  } catch (error) {
    console.error("월별 가계부 데이터 로드 실패:", error);
    return initializeHouseholdLedger();
  }
};

// 월별 가계부 데이터 저장
export const saveHouseholdLedger = async (month, ledgerData) => {
  try {
    const data = await loadData();

    if (!data.monthlyData) {
      data.monthlyData = {};
    }

    if (!data.monthlyData[month]) {
      data.monthlyData[month] = {};
    }

    data.monthlyData[month].householdLedger = ledgerData;

    return await saveData(data);
  } catch (error) {
    console.error("월별 가계부 데이터 저장 실패:", error);
    return false;
  }
};
