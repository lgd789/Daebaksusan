import React from 'react';

interface GuestPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    confirmPassword: string;// setPassword prop의 타입 수정
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

export const GuestPaymentModal: React.FC<GuestPaymentModalProps> = ({ isOpen, onClose, onConfirm, password, setPassword, confirmPassword, setConfirmPassword }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg z-50">
                <h2 className="text-xl font-bold mb-4">비회원 주문</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="주문 조회시 입력한 비밀번호로 조회 할 수 있습니다."
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <div className="flex justify-end">
                    <button className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap" onClick={onConfirm}>결제하기</button>
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 whitespace-nowrap" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};