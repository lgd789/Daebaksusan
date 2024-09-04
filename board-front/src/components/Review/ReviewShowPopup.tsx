import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import ReviewComp from 'components/DetailTab/ReviewComp';
import { reverse } from 'dns';
import { useAuthContext } from 'hook/AuthProvider';
import React, { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Option, Product, ReviewState } from 'types';
import { ReviewDTO } from 'types/interface/review.interface';

interface ReviewShowPopupProps {
    onClose: () => void; // 팝업 닫기 함수
    product: Product;
    option?: Option | null;
    orderNumber: string;
}

export const ReviewShowPopup: React.FC<ReviewShowPopupProps> = ({ onClose, product, option, orderNumber }) => {
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const [review, setReview] = useState<ReviewDTO>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/info/reviews`;
                const post = 'POST';
                const data = {
                    productId: product.productId,
                    optionId: option?.optionId,
                    orderNumber: orderNumber,
                };

                console.log(data)
                const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);

                setReview(response);


                console.log(response)
            } catch (error) {

                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 max-h-[60%] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="m-0 text-lg font-bold">후기</h2>
                    <button className="text-gray-500 hover:text-gray-700 " onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {review && <ReviewComp review={review} />}

            </div>
        </div>
    );
};
