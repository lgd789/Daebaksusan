import React from "react";
import styles from './OrderFlow.module.css';

interface OrderFlowProps {
  currentStep: number;
}

export const OrderFlow: React.FC<OrderFlowProps> = ({ currentStep }) => {
  // 스텝별로 표시할 설명을 배열에 추가
  const steps = [
    { number: "01", description: "장바구니" },
    { number: "02", description: "결제" },
    { number: "03", description: "완료" }
  ];

  return (
    <>
      <div className={styles.path}>
        {/* <ul>
          <li>홈</li>
        
          <li>장바구니</li>
        </ul> */}
      </div>
    
      <ul className={styles.orderFlow}>
        {steps.map((step, index) => (
          <li key={step.number} className={index + 1 === currentStep ? styles.active : styles.inactive}>
            <div className={styles.stepContent}>
              <span className={index + 1 === currentStep ? styles.activeText : styles.inactiveText}>STEP {step.number}</span>
              <div className={index + 1 === currentStep ? styles.activeText : styles.inactiveText}>{step.description}</div>
            </div>
            {index < 2 && (
              <span className={index + 1 < currentStep ? styles.inactiveArrow : (index + 1 === currentStep ? styles.activeArrow : styles.inactiveArrow)}>
                {' >'}
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
