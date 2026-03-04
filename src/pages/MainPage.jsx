import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';
import AssetInput from '../components/AssetInput';
import AssetSummary from '../components/AssetSummary';
import AssetTable from '../components/AssetTable';
import AssetPieChart from '../components/AssetPieChart';
import AssetTrendChart from '../components/AssetTrendChart';
import { calculateMonthlyAssets, getCurrentMonth } from '../utils/monthlyStorage';
import './MainPage.css';

const MainPage = () => {
  const { assets, updateAssetItem, setInitialAssets, fileSelected } = useAssets();
  const [isEditing, setIsEditing] = useState(false);
  const [monthlyAssets, setMonthlyAssets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const navigate = useNavigate();

  // 월별 자산 데이터 로드
  useEffect(() => {
    const loadMonthlyAssets = async () => {
      if (fileSelected) {
        const data = await calculateMonthlyAssets();
        setMonthlyAssets(data);
      }
    };
    loadMonthlyAssets();
  }, [fileSelected, assets]);

  const handleSave = async () => {
    await setInitialAssets(assets);
    setIsEditing(false);
  };

  const handleMonthClick = (month) => {
    navigate(`/month/${month}`);
  };

  return (
    <div className="main-page">
      <header className="main-page-header">
        <h1>자산 관리</h1>
        <div className="header-actions">
          <button onClick={() => setIsEditing(!isEditing)} className="btn-primary">
            {isEditing ? '취소' : '초기 자산 입력'}
          </button>
          {isEditing && (
            <button onClick={handleSave} className="btn-success">
              저장
            </button>
          )}
        </div>
      </header>

      <main className="main-page-content">
        {isEditing ? (
          <AssetInput assets={assets} onUpdate={updateAssetItem} />
        ) : (
          <>
            {/* 월별 버튼 섹션 */}
            <section className="monthly-buttons-section">
              <h2>월별 세부 자산현황</h2>
              <div className="monthly-buttons">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(month)}
                    className="btn-month"
                  >
                    {month}월
                  </button>
                ))}
              </div>
            </section>

            <AssetSummary
              monthlyAssets={monthlyAssets}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            <AssetTable monthlyAssets={monthlyAssets} />

            <div className="charts-container">
              <AssetPieChart
                monthlyAssets={monthlyAssets}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
              <AssetTrendChart monthlyAssets={monthlyAssets} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MainPage;
