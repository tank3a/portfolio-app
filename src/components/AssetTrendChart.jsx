import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateNetAssets } from '../utils/storage';

const AssetTrendChart = ({ monthlyAssets }) => {
  // 월별 자산 데이터를 차트 데이터로 변환
  const chartData = monthlyAssets.map((entry) => {
    return {
      date: entry.label,
      netAssets: calculateNetAssets(entry.assets),
    };
  });

  // 데이터가 없으면 차트를 표시하지 않음
  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3>월별 자산 증감 추이</h3>
        <div className="no-data">데이터가 없습니다. 자산을 입력하면 추이가 표시됩니다.</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>월별 자산 증감 추이</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            style={{ fontSize: '14px' }}
          />
          <YAxis
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
            style={{ fontSize: '14px' }}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString('ko-KR')} 원`, '순자산']}
            contentStyle={{ fontSize: '14px' }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line
            type="monotone"
            dataKey="netAssets"
            stroke="#2196F3"
            strokeWidth={3}
            name="순자산"
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetTrendChart;
