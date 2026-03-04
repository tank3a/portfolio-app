const ASSET_LABELS = {
  cash: "현금",
  investment: "투자자산",
  housingSubscription: "주택청약저축",
  deposit: "전세금",
  pension: "연금",
  debt: "부채",
};

const AssetTable = ({ monthlyAssets }) => {
  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString("ko-KR");
  };

  // 월별 자산 데이터 사용 (비어있으면 빈 배열)
  const tableData = monthlyAssets.length > 0 ? monthlyAssets : [];

  // 순자산 계산 (현금 + 투자자산 + 주택청약저축 + 전세금 + 연금)
  const calculateNet = (assets) => {
    return Object.entries(assets)
      .filter(([key]) => key !== "debt")
      .reduce((sum, [, value]) => sum + Number(value || 0), 0);
  };

  // 총 자산 계산 (순자산 + 부채)
  const calculateTotal = (assets) => {
    return calculateNet(assets) + Number(assets.debt || 0);
  };

  return (
    <div className="asset-table-container">
      <h2>자산 현황</h2>
      <div className="table-wrapper">
        <table className="asset-table">
          <thead>
            <tr>
              <th>구분</th>
              {tableData.map((data, index) => (
                <th key={index}>{data.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(ASSET_LABELS).map(([key, label]) => (
              <tr key={key} className={key === "debt" ? "debt-row" : ""}>
                <td className="label-cell">{label}</td>
                {tableData.map((data, index) => (
                  <td key={index} className="amount-cell">
                    {formatNumber(data.assets[key])}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="expense-row">
              <td className="label-cell">총 지출</td>
              {tableData.map((data, index) => (
                <td key={index} className="amount-cell">
                  {formatNumber(data.expense)}
                </td>
              ))}
            </tr>
            <tr className="net-row">
              <td className="label-cell">순자산</td>
              {tableData.map((data, index) => (
                <td key={index} className="amount-cell highlight">
                  {formatNumber(calculateNet(data.assets))}
                </td>
              ))}
            </tr>
            <tr className="total-row">
              <td className="label-cell">총 자산</td>
              {tableData.map((data, index) => (
                <td key={index} className="amount-cell">
                  {formatNumber(calculateTotal(data.assets))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;
