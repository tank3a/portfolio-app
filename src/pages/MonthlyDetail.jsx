import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import IncomeSection from "../components/IncomeSection";
import ExpenseSection from "../components/ExpenseSection";
import InvestmentSection from "../components/InvestmentSection";
import "./MonthlyDetail.css";

import OtherSection from "../components/OtherSection";

const MONTH_NAMES = {
  1: "1월",
  2: "2월",
  3: "3월",
  4: "4월",
  5: "5월",
  6: "6월",
  7: "7월",
  8: "8월",
  9: "9월",
  10: "10월",
  11: "11월",
  12: "12월",
};

const MonthlyDetail = () => {
  const { month } = useParams();
  const navigate = useNavigate();
  const monthNumber = parseInt(month, 10);

  if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
    return (
      <div className="monthly-detail">
        <div className="error-message">
          <h2>잘못된 월입니다</h2>
          <button onClick={() => navigate("/")} className="btn-primary">
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="monthly-detail">
      <header className="monthly-detail-header">
        <button onClick={() => navigate("/")} className="btn-back">
          ← 메인으로
        </button>
        <h1>{MONTH_NAMES[monthNumber]} 세부 자산현황</h1>
      </header>

      <main className="monthly-detail-main">
        <section className="detail-section income-section">
          <h2>💰 수입</h2>
          <div className="section-content">
            <IncomeSection month={monthNumber} />
          </div>
        </section>

        <section className="detail-section expense-section">
          <h2>💸 지출</h2>
          <div className="section-content">
            <ExpenseSection month={monthNumber} />
          </div>
        </section>

        <section className="detail-section investment-section">
          <h2>📈 투자</h2>
          <div className="section-content">
            <InvestmentSection month={monthNumber} />
          </div>
        </section>

        <section className="detail-section other-section">
          <h2>📋 기타</h2>
          <div className="section-content">
            <OtherSection month={monthNumber} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default MonthlyDetail;
