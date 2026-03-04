import { calculateTotalAssets, calculateNetAssets } from '../utils/storage';

const MONTH_OPTIONS = [
  { value: 0, label: "26년 시작" },
  { value: 1, label: "1월" },
  { value: 2, label: "2월" },
  { value: 3, label: "3월" },
  { value: 4, label: "4월" },
  { value: 5, label: "5월" },
  { value: 6, label: "6월" },
  { value: 7, label: "7월" },
  { value: 8, label: "8월" },
  { value: 9, label: "9월" },
  { value: 10, label: "10월" },
  { value: 11, label: "11월" },
  { value: 12, label: "12월" },
];

const AssetSummary = ({ monthlyAssets, selectedMonth, onMonthChange }) => {
  const assets = monthlyAssets.length > 0 ? monthlyAssets[selectedMonth]?.assets : null;

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString('ko-KR');
  };

  const handleMonthChange = (e) => {
    onMonthChange(Number(e.target.value));
  };

  if (!assets) {
    return (
      <div className="asset-summary">
        <div className="summary-header">
          <h2>자산 현황</h2>
        </div>
        <div className="no-data">데이터가 없습니다</div>
      </div>
    );
  }

  const totalAssets = calculateTotalAssets(assets);
  const netAssets = calculateNetAssets(assets);

  return (
    <div className="asset-summary">
      <div className="summary-header">
        <h2>자산 현황</h2>
        <select
          className="month-selector"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {MONTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="summary-grid">
        <div className="summary-item total">
          <span className="label">총 자산</span>
          <span className="value">{formatNumber(totalAssets)} 원</span>
        </div>
        <div className="summary-item debt">
          <span className="label">부채</span>
          <span className="value negative">{formatNumber(assets.debt)} 원</span>
        </div>
        <div className="summary-item net">
          <span className="label">순자산</span>
          <span className="value highlight">{formatNumber(netAssets)} 원</span>
        </div>
      </div>
    </div>
  );
};

export default AssetSummary;
