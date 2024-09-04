import React, { useEffect, useState } from 'react'
import styles from "./Mypage.module.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { useAuthContext } from 'hook/AuthProvider'; 
import { MyPageMenu } from 'components/MyPage/MyPageMenu';
import Member from 'types/interface/member.interface';
import { MyPageInfo } from 'components/MyPage/MyPageInfo';
import { PaymentDetails } from './MyPage/PaymentDetails';
import { MyCoupons } from './MyPage/MyCoupons';
import { MyPoints } from './MyPage/MyPoints';
import { UpdateInfo } from './MyPage/UpdateInfo';
import { MemberDelete } from './MyPage/MemberDelete';

export const Mypage: React.FC = () => {
    const { state } = useLocation();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<Member>();
    const [currentPage, setCurrentPage] = useState<{ page: string, props?: string }>({ page: state?.page || 'mypageInfo' });
    const isSocialAuthenticated = state?.isSocialAuthenticated || false;
    const token = state?.token || null;

    useEffect(() => {
        const url = '/info';
        const post = 'GET';
        const data = null;

        const fetchData = async () => {
            try {
                const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);
                console.log(response);
                setUserInfo(response);
            } catch (error: any) {
                navigate('/login');
                setIsLoggedIn(false);
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {

    }, [currentPage])
    
    const handlePageChange = (page: string, props?: string) => {
        setCurrentPage({ page, props });
    };

    const renderContent = () => {
        switch (currentPage.page) {
            case 'mypageInfo':
                return <MyPageInfo userInfo={userInfo} handlePageChange={handlePageChange}/>;
            case 'paymentDetails':
                return <PaymentDetails defaultSortBy={currentPage.props} /> ;
            case 'myCoupon':
                return <MyCoupons coupons={userInfo?.coupons}/>;
            case 'myPoints':
                return <MyPoints />;
            case 'updateInfo':
                return <UpdateInfo userInfo={userInfo} isSocialAuthenticated={isSocialAuthenticated}/>;
            case 'memberDelete':
                return <MemberDelete userInfo={userInfo} isSocialAuthenticated={isSocialAuthenticated} socialToken={token}/>;
            default:
                return null;
        }
    };

    return (
        <div className="lg:mx-16 xl:mx-56 2xl:mx-80 mt-10 p-2 md:p-5 rounded-lg whitespace-nowrap">
            <div className="sm:flex sm:gap-3 md:gap-10 lg:gap-20 2xl:gap-32 sm:border-b sm:p-4">
                <div className="text-center sm:block text-2xl text-blue-600 font-semibold hover:cursor-pointer" onClick={()=>handlePageChange('mypageInfo')}>마이페이지</div>
                <div className="hidden sm:flex gap-2 text-lg">
                    <div>적립금</div>
                    <div className="text-blue-700 font-bold hover:cursor-pointer" onClick={()=>handlePageChange('myPoints')}>{userInfo?.points}원</div>
                </div>
                <div className="hidden sm:flex gap-2 text-lg">
                    <div>쿠폰</div>
                    <div className="text-blue-700 font-bold hover:cursor-pointer" onClick={()=>handlePageChange('myCoupon')}>{userInfo?.coupons.length}개</div>
                </div>
                <div className="hidden sm:block grow text-end">
                    <span className="text-gray-600 font-semibold">{userInfo?.name} </span>
                    <span className="text-gray-600">고객님 </span>
                    <span className="text-blue-700 underline whitespace-nowrap text-sm lg:text-base hover:cursor-pointer" onClick={() => handlePageChange('updateInfo')}>회원 정보 수정 {'>'}</span>
                </div>
            </div>
            <div className="sm:py-5">
                <div className="sm:flex sm:justify-between">
                    <div className="sm:block w-full sm:w-1/6 border-b border-t sm:border-b-0 sm:border-t-0 sm:border-r text-l font-semibold" >
                        <MyPageMenu handlePageChange={handlePageChange} />
                    </div>
                    <div className="sm:w-4/5 sm:mt-5 md:ml-10">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
