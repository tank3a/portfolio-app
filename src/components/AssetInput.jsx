import React from "react";

const ASSET_LABELS = {
  cash: "현금",
  investment: "투자자산",
  housingSubscription: "주택청약저축",
  deposit: "전세금",
  pension: "연금",
  debt: "부채",
};

const AssetInput = ({ assets, onUpdate }) => {
  const handleChange = (key, value) => {
    // 숫자만 입력 가능하도록 처리
    const numValue = value.replace(/[^0-9]/g, "");
    onUpdate(key, numValue);
  };

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString("ko-KR");
  };

  return (
    <div className="asset-input-container">
      <h2>자산 입력</h2>
      <div className="asset-grid">
        {Object.entries(ASSET_LABELS).map(([key, label]) => (
          <div key={key} className="asset-item">
            <label htmlFor={key}>{label}</label>
            <div className="input-wrapper">
              <input
                id={key}
                type="text"
                value={formatNumber(assets[key])}
                onChange={(e) =>
                  handleChange(key, e.target.value.replace(/,/g, ""))
                }
                placeholder="0"
              />
              <span className="currency">원</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetInput;
