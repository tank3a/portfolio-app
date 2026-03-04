import React, { useState, useRef, useEffect } from "react";
import { useMonthlyOther } from "../hooks/useMonthlyOther";
import VariableIncomeList from "./VariableIncomeList";
import "./OtherSection.css";

const OtherSection = ({ month }) => {
  const {
    otherData,
    loading,
    updatePension,
    updateHousingSubscription,
    addMisc,
    removeMisc,
    updateMisc,
    saveOther,
    saveOtherWithData,
    calculatePensionChange,
    calculateHousingSubscriptionChange,
  } = useMonthlyOther(month);

  const [editing, setEditing] = useState(null); // { area: 'pension'|'savings'|'misc', id?, field }
  const [tempValue, setTempValue] = useState("");
  const editRef = useRef(null);

  const formatNumber = (num) => Number(num || 0).toLocaleString("ko-KR");

  const handlePensionClick = (field) => {
    setEditing({ area: "pension", field });
    setTempValue(otherData.pension[field].toString());
  };

  const handleSavingsClick = () => {
    // default to editing addition if no field provided
    setEditing({ area: "savings", field: "addition" });
    setTempValue(otherData.savings.housingSubscription.addition.toString());
  };

  const handleMiscClick = (item) => {
    setEditing({ area: "misc", id: item.id });
    setTempValue(item.amount.toString());
  };

  const handleChange = (value) => {
    const num = value.replace(/[^0-9]/g, "");
    setTempValue(num);
  };

  const handleSaveField = async () => {
    if (!editing) return;

    // 새 데이터를 직접 계산하여 즉시 저장 (setState는 비동기이므로 saveOther()는 이전 데이터를 저장함)
    let newData = { ...otherData };
    if (editing.area === "pension") {
      newData = {
        ...newData,
        pension: {
          ...newData.pension,
          [editing.field]: Number(tempValue) || 0,
        },
      };
      updatePension(editing.field, tempValue);
    } else if (editing.area === "savings") {
      newData = {
        ...newData,
        savings: {
          ...newData.savings,
          housingSubscription: {
            ...newData.savings.housingSubscription,
            [editing.field]: Number(tempValue) || 0,
          },
        },
      };
      updateHousingSubscription(editing.field, tempValue);
    } else if (editing.area === "misc") {
      newData = {
        ...newData,
        misc: newData.misc.map((it) =>
          it.id === editing.id ? { ...it, amount: tempValue } : it,
        ),
      };
      updateMisc(editing.id, "amount", tempValue);
    }
    setEditing(null);
    setTempValue("");
    await saveOtherWithData(newData);
  };

  // click outside to save
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editing && editRef.current && !editRef.current.contains(e.target)) {
        handleSaveField();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editing, tempValue]);

  if (loading) return <div className="other-loading">로딩 중...</div>;

  return (
    <div className="other-section-container">
      {/* 연금 */}
      <div className="other-subsection">
        <h3>연금</h3>
        <div className="other-header">
          <div className="header-label">항목</div>
          <div className="header-addition">추가금</div>
          <div className="header-current">현재 금액</div>
          <div className="header-change">증감액</div>
        </div>
        <div className="pension-row">
          <div className="pension-label">연금</div>
          <div className="pension-cell">
            {editing?.area === "pension" && editing?.field === "addition" ? (
              <div ref={editRef} className="other-input">
                <input
                  value={formatNumber(tempValue)}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
            ) : (
              <div
                className="clickable"
                onClick={() => handlePensionClick("addition")}
              >
                {formatNumber(otherData.pension.addition)}원
              </div>
            )}
          </div>

          <div className="pension-cell">
            {editing?.area === "pension" && editing?.field === "current" ? (
              <div ref={editRef} className="other-input">
                <input
                  value={formatNumber(tempValue)}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
            ) : (
              <div
                className="clickable"
                onClick={() => handlePensionClick("current")}
              >
                {formatNumber(otherData.pension.current)}원
              </div>
            )}
          </div>

          <div className="pension-cell change-cell">
            {formatNumber(calculatePensionChange())}원
          </div>
        </div>
      </div>

      {/* 저축 */}
      <div className="other-subsection">
        <h3>저축</h3>
        <div className="other-header">
          <div className="header-label">항목</div>
          <div className="header-addition">추가금</div>
          <div className="header-current">현재 금액</div>
          <div className="header-change">증감액</div>
        </div>
        <div className="savings-row">
          <div className="savings-label">주택청약저축</div>

          <div className="savings-cell">
            {editing?.area === "savings" && editing?.field === "addition" ? (
              <div ref={editRef} className="other-input">
                <input
                  value={formatNumber(tempValue)}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
            ) : (
              <div
                className="clickable"
                onClick={() =>
                  setEditing({ area: "savings", field: "addition" })
                }
              >
                {formatNumber(otherData.savings.housingSubscription.addition)}원
              </div>
            )}
          </div>

          <div className="savings-cell">
            {editing?.area === "savings" && editing?.field === "current" ? (
              <div ref={editRef} className="other-input">
                <input
                  value={formatNumber(tempValue)}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
            ) : (
              <div
                className="clickable"
                onClick={() =>
                  setEditing({ area: "savings", field: "current" })
                }
              >
                {formatNumber(otherData.savings.housingSubscription.current)}원
              </div>
            )}
          </div>

          <div className="savings-cell change-cell">
            {formatNumber(calculateHousingSubscriptionChange())}원
          </div>
        </div>
      </div>

      {/* 기타 */}
      <div className="other-subsection">
        <h3>기타</h3>
        <VariableIncomeList
          items={otherData.misc}
          onAdd={addMisc}
          onRemove={removeMisc}
          onChange={(id, field, value) => updateMisc(id, field, value)}
          onSave={saveOther}
        />
      </div>
    </div>
  );
};

export default OtherSection;
