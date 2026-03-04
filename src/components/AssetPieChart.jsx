import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const ASSET_LABELS = {
  cash: "현금",
  investment: "투자자산",
  housingSubscription: "주택청약저축",
  deposit: "전세금",
  pension: "연금",
};

const COLORS = {
  cash: "#4CAF50",
  investment: "#2196F3",
  housingSubscription: "#FF9800",
  deposit: "#9C27B0",
  pension: "#F44336",
};

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

const AssetPieChart = ({ monthlyAssets, selectedMonth, onMonthChange }) => {
  const assets = monthlyAssets.length > 0 ? monthlyAssets[selectedMonth]?.assets : null;

  if (!assets) {
    return (
      <div className="chart-container">
        <h3>자산 비율</h3>
        <div className="no-data">데이터가 없습니다</div>
      </div>
    );
  }

  // 부채를 제외한 자산 데이터 생성
  const chartData = Object.entries(assets)
    .filter(([key]) => key !== "debt" && assets[key] > 0)
    .map(([key, value]) => ({
      name: ASSET_LABELS[key],
      value: Number(value),
      key,
    }));

  // 데이터가 없으면 차트를 표시하지 않음
  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3>자산 비율</h3>
        <div className="no-data">데이터가 없습니다</div>
      </div>
    );
  }

  // 총 자산 계산
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // 커스텀 레전드 렌더러
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="pie-chart-legend">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload.value / totalValue) * 100).toFixed(
            1,
          );
          return (
            <li key={`legend-${index}`}>
              <span
                className="legend-color"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="legend-text">
                {entry.value}: {percentage}%
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleMonthChange = (e) => {
    onMonthChange(Number(e.target.value));
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>자산 비율</h3>
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
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={false}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${Number(value).toLocaleString("ko-KR")} 원`}
            contentStyle={{ fontSize: "14px" }}
          />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetPieChart;