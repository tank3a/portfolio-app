import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useAssets } from './hooks/useAssets';
import FileSelector from './components/FileSelector';
import MainPage from './pages/MainPage';
import MonthlyDetail from './pages/MonthlyDetail';
import HouseholdLedger from './pages/HouseholdLedger';
import './App.css';

function App() {
  const { fileSelected, updateFileSelected, reloadData } = useAssets();

  const handleFileSelected = async () => {
    updateFileSelected(true);
    await reloadData();
  };

  // 파일이 선택되지 않았으면 파일 선택 화면 표시
  if (!fileSelected) {
    return <FileSelector onFileSelected={handleFileSelected} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/month/:month" element={<MonthlyDetail />} />
        <Route path="/month/:month/ledger" element={<HouseholdLedger />} />
      </Routes>
    </Router>
  );
}

export default App;
