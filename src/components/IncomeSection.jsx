import React from 'react';
import { useMonthlyIncome } from '../hooks/useMonthlyIncome';
import FixedIncomeList from './FixedIncomeList';
import VariableIncomeList from './VariableIncomeList';
import './IncomeSection.css';

const IncomeSection = ({ month }) => {
  const {
    incomeData,
    loading,
    updateFixedIncome,
    addVariableIncome,
    removeVariableIncome,
    updateVariableIncome,
    saveIncome,
    saveIncomeWithData,
    calculateTotal,
  } = useMonthlyIncome(month);

  // 고정수입 저장: 새 fixed items를 받아서 전체 incomeData 구성 후 저장
  const handleFixedSave = async (newFixedItems) => {
    if (newFixedItems) {
      await saveIncomeWithData({ ...incomeData, fixed: newFixedItems });
    } else {
      await saveIncome();
    }
  };

  // 변동수입 저장: 새 variable items를 받아서 전체 incomeData 구성 후 저장
  const handleVariableSave = async (newVariableItems) => {
    if (newVariableItems) {
      await saveIncomeWithData({ ...incomeData, variable: newVariableItems });
    } else {
      await saveIncome();
    }
  };

  if (loading) {
    return <div className="income-loading">로딩 중...</div>;
  }

  const totals = calculateTotal();

  return (
    <div className="income-section-container">
      <div className="income-subsection">
        <h3>고정수입</h3>
        <FixedIncomeList
          items={incomeData.fixed}
          onChange={updateFixedIncome}
          onSave={handleFixedSave}
        />
        <div className="subsection-total">
          소계: {totals.fixed.toLocaleString('ko-KR')}원
        </div>
      </div>

      <div className="income-subsection">
        <h3>변동수입</h3>
        <VariableIncomeList
          items={incomeData.variable}
          onAdd={addVariableIncome}
          onRemove={removeVariableIncome}
          onChange={updateVariableIncome}
          onSave={handleVariableSave}
        />
        <div className="subsection-total">
          소계: {totals.variable.toLocaleString('ko-KR')}원
        </div>
      </div>

      <div className="income-total">
        <strong>총 수입: {totals.total.toLocaleString('ko-KR')}원</strong>
      </div>
    </div>
  );
};

export default IncomeSection;
