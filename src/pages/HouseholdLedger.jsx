import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useHouseholdLedger, LEDGER_CATEGORIES } from '../hooks/useHouseholdLedger';
import './HouseholdLedger.css';

const HouseholdLedger = () => {
  const { month } = useParams();
  const navigate = useNavigate();
  const monthNum = parseInt(month, 10);

  const {
    ledgerData,
    loading,
    addEntry,
    removeEntry,
    updateEntry,
    calculateTotal,
    getChartData,
  } = useHouseholdLedger(monthNum);

  const [editingId, setEditingId] = useState(null);
  const [tempData, setTempData] = useState({});
  const editingRef = useRef(null);

  const formatNumber = (num) => Number(num || 0).toLocaleString('ko-KR');

  const handleEntryClick = (entry) => {
    setEditingId(entry.id);
    setTempData({
      category: entry.category,
      label: entry.label,
      amount: entry.amount.toString(),
      memo: entry.memo || '',
    });
  };

  const handleTempChange = (field, value) => {
    if (field === 'amount') {
      value = value.replace(/[^0-9]/g, '');
    }
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (editingId) {
      updateEntry(editingId, 'category', tempData.category);
      updateEntry(editingId, 'label', tempData.label);
      updateEntry(editingId, 'amount', tempData.amount);
      updateEntry(editingId, 'memo', tempData.memo);
      setEditingId(null);
      setTempData({});
      // 자동 저장이 처리함
    }
  };

  const handleRemove = (id, label) => {
    if (window.confirm(`"${label || '이 항목'}"을 삭제하시겠습니까?`)) {
      removeEntry(id);
      setEditingId(null);
      setTempData({});
      // 자동 저장이 처리함
    }
  };

  const handleAddEntry = () => {
    addEntry();
    // 자동 저장이 처리함
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingId && editingRef.current && !editingRef.current.contains(event.target)) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingId, tempData]);

  // 파이차트용 커스텀 레전드
  const renderLegend = (props) => {
    const { payload } = props;
    const total = calculateTotal();
    return (
      <ul className="ledger-pie-legend">
        {payload.map((entry, index) => {
          const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
          return (
            <li key={`legend-${index}`}>
              <span className="legend-color" style={{ backgroundColor: entry.color }}></span>
              <span className="legend-text">
                {entry.value}: {percentage}%
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const getCategoryInfo = (categoryId) => {
    return LEDGER_CATEGORIES.find((cat) => cat.id === categoryId) || LEDGER_CATEGORIES[8];
  };

  if (loading) {
    return <div className="ledger-loading">로딩 중...</div>;
  }

  const chartData = getChartData();
  const total = calculateTotal();

  return (
    <div className="ledger-container">
      {/* 헤더 */}
      <div className="ledger-header">
        <button className="btn-back" onClick={() => navigate(`/month/${monthNum}`)}>
          ← 돌아가기
        </button>
        <h1>{monthNum}월 가계부</h1>
      </div>

      {/* 상단 요약 */}
      <div className="ledger-summary">
        <div className="summary-total">
          <span className="summary-label">총 지출</span>
          <span className="summary-value">{formatNumber(total)}원</span>
        </div>

        {/* 파이차트 */}
        {chartData.length > 0 ? (
          <div className="ledger-chart">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${Number(value).toLocaleString('ko-KR')}원`}
                  contentStyle={{ fontSize: '14px' }}
                />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="ledger-chart-empty">
            아직 지출 내역이 없습니다
          </div>
        )}
      </div>

      {/* 지출 내역 리스트 */}
      <div className="ledger-list">
        <div className="list-header">
          <h2>지출 내역</h2>
          <span className="entry-count">{ledgerData.entries.length}건</span>
        </div>

        {ledgerData.entries.length > 0 ? (
          <div className="entries-container">
            {ledgerData.entries.map((entry) => {
              const catInfo = getCategoryInfo(entry.category);
              const isEditing = editingId === entry.id;

              return (
                <div key={entry.id} className={`entry-item ${isEditing ? 'editing' : ''}`}>
                  {isEditing ? (
                    <div className="entry-editing" ref={editingRef}>
                      <div className="edit-row">
                        <label>카테고리</label>
                        <select
                          value={tempData.category}
                          onChange={(e) => handleTempChange('category', e.target.value)}
                        >
                          {LEDGER_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="edit-row">
                        <label>항목명</label>
                        <input
                          type="text"
                          value={tempData.label}
                          onChange={(e) => handleTempChange('label', e.target.value)}
                          placeholder="항목명 입력"
                        />
                      </div>
                      <div className="edit-row">
                        <label>금액</label>
                        <input
                          type="text"
                          value={formatNumber(tempData.amount)}
                          onChange={(e) => handleTempChange('amount', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="edit-row">
                        <label>메모</label>
                        <input
                          type="text"
                          value={tempData.memo}
                          onChange={(e) => handleTempChange('memo', e.target.value)}
                          placeholder="메모 (선택)"
                        />
                      </div>
                      <div className="edit-actions">
                        <button className="btn-delete" onClick={() => handleRemove(entry.id, entry.label)}>
                          삭제
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="entry-view" onClick={() => handleEntryClick(entry)}>
                      <div className="entry-left">
                        <span className="entry-icon" style={{ backgroundColor: catInfo.color }}>
                          {catInfo.icon}
                        </span>
                        <div className="entry-info">
                          <span className="entry-label">{entry.label || '(항목명 없음)'}</span>
                          <span className="entry-category">{catInfo.label}</span>
                          {entry.memo && <span className="entry-memo">{entry.memo}</span>}
                        </div>
                      </div>
                      <div className="entry-amount">{formatNumber(entry.amount)}원</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="entries-empty">
            아직 등록된 지출 내역이 없습니다
          </div>
        )}

        <button className="btn-add-entry" onClick={handleAddEntry}>
          + 지출 내역 추가
        </button>
      </div>
    </div>
  );
};

export default HouseholdLedger;