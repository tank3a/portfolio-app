import React, { useState, useRef, useEffect } from 'react';

const VariableExpenseList = ({ items, onAdd, onRemove, onChange, onSave, ledgerTotal }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempLabel, setTempLabel] = useState('');
  const [tempAmount, setTempAmount] = useState('');
  const editingRef = useRef(null);

  const handleItemClick = (item) => {
    setEditingId(item.id);
    setTempLabel(item.label);
    setTempAmount(item.amount.toString());
  };

  const handleAmountChange = (value) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setTempAmount(numValue);
  };

  const handleSave = async (id) => {
    if (!tempLabel.trim()) {
      alert('항목명을 입력해주세요.');
      return;
    }
    const newItems = items.map((item) =>
      item.id === id ? { ...item, label: tempLabel, amount: tempAmount } : item
    );
    onChange(id, 'label', tempLabel);
    onChange(id, 'amount', tempAmount);
    setEditingId(null);
    setTempLabel('');
    setTempAmount('');
    await onSave(newItems);
  };

  const handleRemove = async (id, label) => {
    if (window.confirm(`"${label || '이 항목'}"을 삭제하시겠습니까?`)) {
      const newItems = items.filter((item) => item.id !== id);
      onRemove(id);
      setEditingId(null);
      setTempLabel('');
      setTempAmount('');
      await onSave(newItems);
    }
  };

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString('ko-KR');
  };

  // 외부 클릭 감지하여 저장
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingId && editingRef.current && !editingRef.current.contains(event.target)) {
        handleSave(editingId);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingId, tempLabel, tempAmount]);

  const showLedgerSync = ledgerTotal !== null && ledgerTotal > 0;

  return (
    <div className="variable-expense-container">
      {(showLedgerSync || items.length > 0) && (
        <div className="variable-expense-grid">
          {/* 가계부 동기화 항목 (첫 번째) */}
          {showLedgerSync && (
            <div className="expense-item ledger-sync-item">
              <div className="expense-item-view ledger-sync-view">
                <span className="expense-label">가계부 동기화</span>
                <span className="expense-amount">{formatNumber(ledgerTotal)}원</span>
              </div>
            </div>
          )}
          {/* 일반 변동지출 항목들 */}
          {items.map((item) => (
            <div key={item.id} className="expense-item">
              {editingId === item.id ? (
                <div className="expense-item-editing" ref={editingRef}>
                  <input
                    type="text"
                    value={tempLabel}
                    onChange={(e) => setTempLabel(e.target.value)}
                    placeholder="항목명"
                    className="label-input"
                    autoFocus
                  />
                  <div className="input-with-actions">
                    <input
                      type="text"
                      value={formatNumber(tempAmount)}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0"
                    />
                    <button onClick={() => handleRemove(item.id, item.label)} className="btn-delete">
                      🗑️
                    </button>
                  </div>
                </div>
              ) : (
                <div className="expense-item-view" onClick={() => handleItemClick(item)}>
                  <span className="expense-label">{item.label}</span>
                  <span className="expense-amount">{formatNumber(item.amount)}원</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button onClick={onAdd} className="btn-add">
        + 변동지출 추가
      </button>
    </div>
  );
};

export default VariableExpenseList;
