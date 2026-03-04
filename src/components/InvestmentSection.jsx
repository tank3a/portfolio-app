import React, { useState, useRef, useEffect } from 'react';
import { useMonthlyInvestment } from '../hooks/useMonthlyInvestment';
import './InvestmentSection.css';

const INVESTMENT_CATEGORIES = [
  { id: 'domestic', label: '국내주식/펀드', icon: '🇰🇷' },
  { id: 'overseas', label: '해외주식/펀드', icon: '🌍' },
  { id: 'bond', label: '채권', icon: '📜' },
  { id: 'cash', label: '현금', icon: '💵' },
];

const InvestmentSection = ({ month }) => {
  const {
    investmentData,
    loading,
    updateInvestment,
    saveInvestment,
    saveInvestmentWithData,
    calculateChange,
    calculateTotal,
  } = useMonthlyInvestment(month);

  const [editingField, setEditingField] = useState(null); // { category, field }
  const [tempValue, setTempValue] = useState('');
  const editingRef = useRef(null);

  const handleFieldClick = (category, field) => {
    setEditingField({ category, field });
    setTempValue(investmentData[category][field].toString());
  };

  const handleChange = (value) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setTempValue(numValue);
  };

  const handleSave = async () => {
    if (editingField) {
      const newData = {
        ...investmentData,
        [editingField.category]: {
          ...investmentData[editingField.category],
          [editingField.field]: Number(tempValue) || 0,
        },
      };
      updateInvestment(editingField.category, editingField.field, tempValue);
      setEditingField(null);
      setTempValue('');
      await saveInvestmentWithData(newData);
    }
  };

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString('ko-KR');
  };

  const formatChange = (change) => {
    const formatted = formatNumber(Math.abs(change));
    if (change > 0) return `+${formatted}`;
    if (change < 0) return `-${formatted}`;
    return '0';
  };

  // 외부 클릭 감지하여 저장
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingField && editingRef.current && !editingRef.current.contains(event.target)) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingField, tempValue]);

  if (loading) {
    return <div className="investment-loading">로딩 중...</div>;
  }

  const totals = calculateTotal();

  return (
    <div className="investment-section-container">
      {/* 헤더 */}
      <div className="investment-header">
        <div className="header-label">항목</div>
        <div className="header-addition">추가금</div>
        <div className="header-current">현재 금액</div>
        <div className="header-change">증감액</div>
      </div>

      {/* 투자 항목 */}
      {INVESTMENT_CATEGORIES.map((cat) => {
        const change = calculateChange(cat.id);

        return (
          <div key={cat.id} className="investment-row">
            <div className="investment-label">
              <span className="investment-icon">{cat.icon}</span>
              {cat.label}
            </div>

            {/* 추가금 */}
            <div className="investment-cell">
              {editingField?.category === cat.id && editingField?.field === 'addition' ? (
                <div className="investment-input-wrapper" ref={editingRef}>
                  <input
                    type="text"
                    value={formatNumber(tempValue)}
                    onChange={(e) => handleChange(e.target.value)}
                    autoFocus
                  />
                </div>
              ) : (
                <div
                  className="investment-value clickable"
                  onClick={() => handleFieldClick(cat.id, 'addition')}
                >
                  {formatNumber(investmentData[cat.id].addition)}원
                </div>
              )}
            </div>

            {/* 현재 금액 */}
            <div className="investment-cell">
              {editingField?.category === cat.id && editingField?.field === 'current' ? (
                <div className="investment-input-wrapper" ref={editingRef}>
                  <input
                    type="text"
                    value={formatNumber(tempValue)}
                    onChange={(e) => handleChange(e.target.value)}
                    autoFocus
                  />
                </div>
              ) : (
                <div
                  className="investment-value clickable"
                  onClick={() => handleFieldClick(cat.id, 'current')}
                >
                  {formatNumber(investmentData[cat.id].current)}원
                </div>
              )}
            </div>

            {/* 증감액 */}
            <div className="investment-cell">
              <div className={`investment-change ${change > 0 ? 'positive' : change < 0 ? 'negative' : ''}`}>
                {formatChange(change)}원
              </div>
            </div>
          </div>
        );
      })}

      {/* 합계 */}
      <div className="investment-total-row">
        <div className="investment-label total-label">합계</div>
        <div className="investment-cell total-value">{formatNumber(totals.addition)}원</div>
        <div className="investment-cell total-value">{formatNumber(totals.current)}원</div>
        <div className="investment-cell">
          <div className={`investment-change total-change ${totals.change > 0 ? 'positive' : totals.change < 0 ? 'negative' : ''}`}>
            {formatChange(totals.change)}원
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSection;
