import React from 'react';

interface PayMethodButtonProps {
    label: string
    imageUrl: string;
    onClick: () => void;
    selected: boolean; // 선택된 상태를 나타내는 prop 추가
}

export const PayMethodButton: React.FC<PayMethodButtonProps> = ({ label, imageUrl, onClick, selected }) => {
    return (
        <button 
            className={`items-center justify-center rounded-lg border-3
                    ${selected ? 'border-blue-600' : 'border'} `} // 선택된 경우와 선택되지 않은 경우의 테두리 색상 조건부 적용
            onClick={onClick}
             // 클릭 시 파란 테두리 제거
        >
            <img src={imageUrl} alt="button icon" className="w-36 rounded-lg" />
            <div className={`text-l font-bold ${selected ? 'text-blue-600' : 'text-black'}`}>{label}</div>
        </button>
    );
};
