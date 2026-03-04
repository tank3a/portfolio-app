import React, { useState, useRef, useEffect } from 'react';

const FixedIncomeList = ({ items, onChange, onSave }) => {
  const [editingId, setEditingId] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const editingRef = useRef(null);

  const handleLabelClick = (item) => {
    setEditingId(item.id);
    setTempValue(item.amount.toString());
  };

  const handleChange = (value) => {
    const numValue = value.replace(/[^0-9]/g, '');
    setTempValue(numValue);
  };

  const handleSave = async (id) => {
    // 새 데이터를 먼저 계산하여 onSave에 전달 (setState는 비동기이므로)
    const newItems = items.map((item) =>
      item.id === id ? { ...item, amount: tempValue } : item
    );
    onChange(id, tempValue);
    setEditingId(null);
    setTempValue('');
    await onSave(newItems);
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
    <div className="fixed-income-grid">
      {items.map((item) => (
        <div key={item.id} className="income-item">
          {editingId === item.id ? (
            <div className="income-item-editing" ref={editingRef}>
              <input
                type="text"
                value={formatNumber(tempValue)}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="0"
                autoFocus
              />
            </div>
          ) : (
            <div className="income-item-view" onClick={() => handleLabelClick(item)}>
              <span className="income-label">{item.label}</span>
              <span className="income-amount">{formatNumber(item.amount)}원</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FixedIncomeList;
