import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { ReviewDTO } from 'types/interface/review.interface';
import ReviewComp from './ReviewComp'
import { Pagination } from 'components/Pagination';
import { ReviewAverageComp } from './ReviewAverageComp';
import { ReviewStats } from 'types';
import { Loading } from 'components/Loading/Loading';

interface ReviewTabProps {
  productId: number;
}

const ReviewTabComp: React.FC<ReviewTabProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<ReviewDTO[] | null>(null);
  const [reviewStats, setReveiwStats] = useState<ReviewStats>();
  const [page, setPage] = useState<number>(1); // 페이지 번호
  const pageSize = 5; // 페이지 크기
  const [totalPages, setTotalPages] = useState<number>(1);
  const reviesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${productId}?page=${page}&pageSize=${pageSize}`);
        setReviews(response.data.content);
        setTotalPages(Math.ceil(response.data.totalElements / pageSize));

        console.log(response.data.content);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [productId, page]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/stats/${productId}`);

        setReveiwStats(response.data);
        console.log(response.data);
        console.log(productId)
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [productId]);



  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollPaymentShowListToTop();
  };

  const scrollPaymentShowListToTop = () => {
    if (reviesRef.current) {
      reviesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="grid grid-rows w-full p-4" ref={reviesRef}>
      {reviewStats &&
        <ReviewAverageComp reviewStats={reviewStats} />
      }
      {reviews ? (
        <>
          {reviews.map((review, index) => (
            <ReviewComp key={index} review={review} />
          ))}
          <Pagination pageSize={pageSize} totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
          </>
      ) : (
        <Loading />
      )}
    </div>
  )
}
export default ReviewTabComp;