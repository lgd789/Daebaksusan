import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { Loading } from 'components/Loading/Loading';
import { Pagination } from 'components/Pagination';
import { PaymentShowList } from 'components/PaymentDetail/PaymentShowList';
import { PointsDetail } from 'components/Points/PointsDetail';
import { useAuthContext } from 'hook/AuthProvider';
import React, { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import { PaymentDetail, PointsDetails } from 'types';


export const MyPoints = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const [pointsDetails, setPointsDetails] = useState<PointsDetails[]|null>(null);
    const [page, setPage] = useState<number>(1); // 페이지 번호
    const pageSize = 5; // 페이지 크기
    const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지 수
    const pointsRef = useRef<HTMLDivElement>(null);


    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToTop();
    };

    const scrollToTop = () => {
        if (pointsRef.current) {
            pointsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    
    useEffect(() => {
        fetchData();
    }, [page]); // 페이지 번호가 변경될 때마다 데이터를 새로 가져옵니다.

    const fetchData = async () => {
        try {
            const url = `/points/getPointsDetails?page=${page}&pageSize=${pageSize}`;
            const post = 'GET';
            const data = null;
            const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);
            
            console.log(response.content)
            setPointsDetails(response.content)
            setTotalPages(Math.ceil(response.totalElements / pageSize));
        } catch (error) {
            navigate('/login');
            console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    };
    


    return (
        <div ref={pointsRef}>
            <div className='mt-3 text-left text-2xl border-b font-semibold'> 적립금 내역 </div>
            <div className='font-medium'>
                {pointsDetails ? (
                    <>
                        <PointsDetail pointsTransactions={pointsDetails}/>
                        <Pagination pageSize={pageSize} totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
                    </>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    )
}
