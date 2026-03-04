import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMonthlyExpense } from '../hooks/useMonthlyExpense';
import { useHouseholdLedger } from '../hooks/useHouseholdLedger';
import FixedExpenseList from './FixedExpenseList';
import VariableExpenseList from './VariableExpenseList';
import './ExpenseSection.css';

const ExpenseSection = ({ month }) => {
  const navigate = useNavigate();
  const {
    expenseData,
    loading,
    updateFixedExpense,
    addVariableExpense,
    removeVariableExpense,
    updateVariableExpense,
    saveExpense,
    saveExpenseWithData,
    calculateTotal,
  } = useMonthlyExpense(month);

  const {
    ledgerData,
    loading: ledgerLoading,
    calculateTotal: calculateLedgerTotal,
  } = useHouseholdLedger(month);

  // 고정지출 저장: category와 새 items를 받아서 전체 데이터 구성 후 저장
  const handleFixedSave = async (category, newItems) => {
    if (newItems) {
      await saveExpenseWithData({
        ...expenseData,
        fixed: { ...expenseData.fixed, [category]: newItems },
      });
    } else {
      await saveExpense();
    }
  };

  // 변동지출 저장
  const handleVariableSave = async (newItems) => {
    if (newItems) {
      await saveExpenseWithData({ ...expenseData, variable: newItems });
    } else {
      await saveExpense();
    }
  };

  if (loading || ledgerLoading) {
    return <div className="expense-loading">로딩 중...</div>;
  }

  const totals = calculateTotal();
  const ledgerTotal = calculateLedgerTotal();
  const hasLedgerEntries = ledgerData.entries.length > 0;

  return (
    <div className="expense-section-container">
      {/* 고정지출 */}
      <div className="expense-subsection">
        <h3>고정지출</h3>

        {/* 주거 */}
        <div className="expense-category">
          <h4>🏠 주거</h4>
          <FixedExpenseList
            category="housing"
            items={expenseData.fixed.housing}
            onChange={updateFixedExpense}
            onSave={handleFixedSave}
          />
          <div className="category-total">
            소계: {totals.housing.toLocaleString('ko-KR')}원
          </div>
        </div>

        {/* 생활 */}
        <div className="expense-category">
          <h4>🛒 생활</h4>
          <FixedExpenseList
            category="living"
            items={expenseData.fixed.living}
            onChange={updateFixedExpense}
            onSave={handleFixedSave}
          />
          <div className="category-total">
            소계: {totals.living.toLocaleString('ko-KR')}원
          </div>
        </div>

        {/* 구독 */}
        <div className="expense-category">
          <h4>📱 구독</h4>
          <FixedExpenseList
            category="subscription"
            items={expenseData.fixed.subscription}
            onChange={updateFixedExpense}
            onSave={handleFixedSave}
          />
          <div className="category-total">
            소계: {totals.subscription.toLocaleString('ko-KR')}원
          </div>
        </div>

        <div className="subsection-total">
          고정지출 합계: {totals.fixed.toLocaleString('ko-KR')}원
        </div>
      </div>

      {/* 변동지출 */}
      <div className="expense-subsection">
        <div className="subsection-header">
          <h3>변동지출</h3>
          <button
            className="btn-ledger"
            onClick={() => navigate(`/month/${month}/ledger`)}
          >
            가계부 작성
          </button>
        </div>
        <VariableExpenseList
          items={expenseData.variable}
          onAdd={addVariableExpense}
          onRemove={removeVariableExpense}
          onChange={updateVariableExpense}
          onSave={handleVariableSave}
          ledgerTotal={hasLedgerEntries ? ledgerTotal : null}
        />
        <div className="subsection-total">
          변동지출 합계: {(totals.variable + (hasLedgerEntries ? ledgerTotal : 0)).toLocaleString('ko-KR')}원
        </div>
      </div>

      <div className="expense-total">
        <strong>총 지출: {(totals.total + (hasLedgerEntries ? ledgerTotal : 0)).toLocaleString('ko-KR')}원</strong>
      </div>
    </div>
  );
};

export default ExpenseSection;
