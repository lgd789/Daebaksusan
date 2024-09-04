import React, { useEffect, useRef, useState } from 'react';
import { PaymentShowList } from 'components/PaymentDetail/PaymentShowList';
import { Link, useNavigate } from 'react-router-dom';
import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { useAuthContext } from 'hook/AuthProvider';
import { MyPageMenu } from 'components/MyPage/MyPageMenu';
import { Pagination } from 'components/Pagination';
import { PaymentDetail } from 'types';
import { Loading } from 'components/Loading/Loading';

interface PaymentDetailsProps {
    defaultSortBy?: string;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ defaultSortBy = 'all' }) => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[] | null>(null);
    const [page, setPage] = useState<number>(1); // 페이지 번호
    const pageSize = 5; // 페이지 크기
    const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지 수
    const paymentShowListRef = useRef<HTMLDivElement>(null);
    const [sortBy, setSortBy] = useState<string>(defaultSortBy);

    const fetchData = async (pageToFetch = page) => {
        try {
            const url = `/info/orderDetails?page=${pageToFetch}&pageSize=${pageSize}&status=${sortBy}`;
            const method = 'GET';
            const data = null;
            const response = await sendRequestWithToken(url, method, data, setIsLoggedIn);
            
            console.log(response);
            setPaymentDetails(response.content);
            setTotalPages(Math.ceil(response.totalElements / pageSize));
        } catch (error) {
            navigate('/login');
            console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    useEffect(() => {
        setPage(1);
        fetchData(1);
    }, [sortBy]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToTop();
    };

    const scrollToTop = () => {
        if (paymentShowListRef.current) {
            paymentShowListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const updatePaymentDetails = (updatedPaymentDetails: PaymentDetail[]) => {
        setPaymentDetails(updatedPaymentDetails);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    return (
        <div ref={paymentShowListRef}>
            <div className='mt-3 border-b flex justify-between'>
                <div className='text-2xl font-semibold'>주문 내역</div>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border-2 border-gray-300 rounded-md px-4 py-2 text-sm outline-none bg-white text-gray-700 transition duration-300 ease-in-out focus:border-blue-500 hover:border-blue-500"
                >
                    <option value="all">모두보기</option>
                    <option value="paid">결제 완료</option>
                    <option value="ready">결제 예정</option>
                    <option value="cancelled">결제 취소</option>
                    <option value="failed">결제 실패</option>
                </select>
            </div>
            <div className='font-medium'>
                {paymentDetails ? (
                    <>
                        <PaymentShowList paymentDetails={paymentDetails} onPaymentDetailsChange={updatePaymentDetails}/>
                        <Pagination pageSize={pageSize} totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
                    </>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
};
