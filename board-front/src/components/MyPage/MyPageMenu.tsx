import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from 'hook/AuthProvider';

interface MyPageMenuProps {
    handlePageChange: (page: string) => void;
}

export const MyPageMenu: React.FC<MyPageMenuProps> = ({ handlePageChange }) => {
    const { setIsLoggedIn } = useAuthContext();
    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem('accessToken'); // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="flex sm:flex-col justify-between gap-4 mx-4">
            <div className="space-y-6">
                <div className="py-1 text-base lg:text-xl text-start border-b whitespace-nowrap">쇼핑 정보</div>
                <div className="text-gray-700 no-underline whitespace-nowrap text-sm lg:text-base hover:cursor-pointer" onClick={() => handlePageChange('paymentDetails')}>주문 내역 {'>'}</div>
            </div>

            <div className="space-y-6">
                <div className="py-1 text-base lg:text-xl text-start border-b whitespace-nowrap">활동 관리</div>
                <div><Link to="#" className="text-gray-700 no-underline whitespace-nowrap text-sm lg:text-base">1:1 문의 {'>'}</Link></div>
            </div>

            <div className="space-y-6">
                <div className="py-1 text-base lg:text-xl text-start border-b whitespace-nowrap">회원정보</div>
                <div className="text-gray-700 no-underline whitespace-nowrap text-sm lg:text-base hover:cursor-pointer" onClick={() => handlePageChange('updateInfo')}>정보 수정 {'>'}</div>
                <div className="text-gray-700 no-underline whitespace-nowrap text-sm lg:text-base hover:cursor-pointer" onClick={() => handlePageChange('memberDelete')}>회원 탈퇴 {'>'}</div>
                <div onClick={handleLogOut}><Link to='' className="text-gray-700 no-underline whitespace-nowrap text-sm lg:text-base">로그아웃 {'>'}</Link></div>
            </div>
        </div>
    );
};
