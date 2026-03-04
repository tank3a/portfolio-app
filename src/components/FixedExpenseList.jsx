import React, { useState, useRef, useEffect } from 'react';

const FixedExpenseList = ({ category, items, onChange, onSave }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const editingRef = useRef(null);

  const handleItemClick = (item) => {
    setEditingId(item.id);
    setTempValue(item.amount.toString());
  };

  const handleChange = (value) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setTempValue(numValue);
  };

  const handleSave = async (id) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, amount: tempValue } : item
    );
    onChange(category, id, tempValue);
    setEditingId(null);
    setTempValue('');
    await onSave(category, newItems);
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
  }, [editingId, tempValue]);

  return (
    <div className="fixed-expense-grid">
      {items.map((item) => (
        <div key={item.id} className="expense-item">
          {editingId === item.id ? (
            <div className="expense-item-editing" ref={editingRef}>
              <input
                type="text"
                value={formatNumber(tempValue)}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="0"
                autoFocus
              />
            </div>
          ) : (
            <div className="expense-item-view" onClick={() => handleItemClick(item)}>
              <span className="expense-label">
                {item.label}
                {item.endDate && <span className="end-date">({item.endDate}까지)</span>}
              </span>
              <span className="expense-amount">{formatNumber(item.amount)}원</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FixedExpenseList;
