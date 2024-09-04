import React, { useRef, useState } from 'react';
import { Coupon } from 'types';
import { CouponComp } from 'components/Coupon/CouponComp';
import { Pagination } from 'components/Pagination';
import { Loading } from 'components/Loading/Loading';

interface MyCouponsProps {
  coupons?: Coupon[];
}

export const MyCoupons: React.FC<MyCouponsProps> = ({ coupons }) => {
  const pageSize = 5; // 페이지당 쿠폰 수
  const [currentPage, setCurrentPage] = useState(1);
  const couponListRef = useRef<HTMLDivElement>(null);

  // 현재 페이지에 따른 쿠폰 목록 계산
  const currentCoupons = coupons?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 페이지 변경 함수
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    scrollToTop();
  };

  const scrollToTop = () => {
    if (couponListRef.current) {
      couponListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={couponListRef}>
      <div className='mt-3 text-left text-2xl border-b font-semibold'> 내 쿠폰함 </div>
      {currentCoupons ? (
        <>
          {currentCoupons.map((coupon, index) => (
            <div key={index} className="bg-white border rounded-lg shadow-md p-1 m-3">
              <CouponComp coupon={coupon} />
            </div>
          ))}
          {coupons && (
            <Pagination
              pageSize={pageSize}
              totalPages={Math.ceil((coupons.length || 1) / pageSize)} // Handle zero-length array
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <Loading />
      )}
      
    </div>
  );
};
