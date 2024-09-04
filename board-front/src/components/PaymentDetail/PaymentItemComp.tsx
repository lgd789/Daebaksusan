import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { useAuthContext } from 'hook/AuthProvider';
import React, { useEffect, useState } from 'react';
import { CartItem, PaymentItem } from "types";
import { PaymentInfoPopup } from './PaymentInfoPopup';
import { ReviewPopup } from 'components/Review/ReviewPopup';
import { ReviewShowPopup } from 'components/Review/ReviewShowPopup';

interface PaymentItemCompProps {
    orderNumber: string;
    orderItem: PaymentItem;
    status: string;
    onCancelStatusChange: (newValue: string) => void;
    onReviewStatusChange: (newValue: boolean) => void;
    isFirstItem: boolean;
    isMobileView: boolean;
    rowspan: number;
}


export const PaymentItemComp: React.FC<PaymentItemCompProps> = ({ orderNumber, orderItem, status, onCancelStatusChange, onReviewStatusChange, isFirstItem, isMobileView, rowspan }) => {
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [writeReviewPopup, setWriteReviewPopup] = useState(false); // 리뷰 작성 팝업 상태 추가
    const [showReviewPopup, setShowReviewPopup] = useState(false);

    const totalPrice = (orderItem.cartItem.product.regularPrice - orderItem.cartItem.product.salePrice) * orderItem.cartItem.quantity;
    const shippingCost = orderItem.cartItem.product.shippingCost * orderItem.cartItem.boxCnt;
    const optionCost = orderItem.cartItem.option?.addPrice ? orderItem.cartItem.option.addPrice * orderItem.cartItem.boxCnt : 0;

    const handleShowInfo = () => {
        setShowPaymentInfo(true);
    }

    const handleWriteReview = () => {
        setWriteReviewPopup(true); // 리뷰 작성 팝업 열기
    }

    const handleShowReview = () => {
        setShowReviewPopup(true); // 리뷰 작성 팝업 열기
    }

    let paymentStatus;
    switch (status) {
        case "paid": paymentStatus = "결제 완료"; break;
        case "ready": paymentStatus = "결제 예정"; break;
        case "failed": paymentStatus = "결제 실패"; break;
        case "cancelled": paymentStatus = "결제 취소"; break;
        default:
    }

    const isCancelled = (status === 'cancelled' || status === 'failed');
    const isReady = (status === 'ready');
    return (
        <tr style={{ backgroundColor: isCancelled ? '#F3F4F6' : 'transparent', borderBottom: '1px solid #E5E7EB' }}>
            {isFirstItem && (
                <td className="py-2 px-6 lg:py-4 lg:px-6 border-r" rowSpan={rowspan}>
                    <p className={`text-gray-500 text-xs mb-0 ${isCancelled ? 'line-through' : ''}`}>
                        <span className="block">{orderNumber.substring(0, 8)}</span>
                        <span className="block">{orderNumber.substring(9)}</span>
                    </p>
                </td>
            )}
            {!isMobileView && (
                <>
                    <td className="py-4 px-6">
                        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
                            <img src={orderItem.cartItem.product.imageUrl} alt={orderItem.cartItem.product.name} style={{ width: '100%', height: '100%' }} />
                            {isCancelled && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(128, 128, 128, 0.6)', zIndex: 1 }}></div>}
                        </div>

                        {!isCancelled && (
                            <button
                                className="py-2 px-4 border-2 border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 whitespace-nowrap"
                                onClick={orderItem.isReview ? handleShowReview : handleWriteReview}
                            >
                                {orderItem.isReview ? '후기 보기' : '후기 작성'}
                            </button>
                        )}
                    </td>
                    <td className="py-4 px-6 max-w-[150px]">
                        <p className={`overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-bold mb-1 ${isCancelled ? 'line-through' : ''}`}>{orderItem.cartItem.product.name}</p>
                        {orderItem.cartItem.option && (
                            <p className={`text-sm text-gray-500 ${isCancelled ? 'line-through' : ''} whitespace-nowrap`}>{orderItem.cartItem.option.name} +{orderItem.cartItem.option.addPrice.toLocaleString()}원</p>
                        )}
                    </td>
                    <td className={`py-4 px-6 text-base font-bold ${isCancelled ? 'line-through' : ''} whitespace-nowrap`}>
                        {(totalPrice + shippingCost + optionCost).toLocaleString()}원
                    </td>
                    <td className={`py-4 px-6 text-base font-bold ${isCancelled ? 'line-through' : ''}`}>
                        {orderItem.cartItem.quantity}
                    </td>


                    {isFirstItem && (
                        <>
                            <td className="py-4 px-6 lg:py-2 lg:px-6 border-l" rowSpan={rowspan}>
                                <div>
                                    <p className={`text-xs font-medium ${isCancelled ? 'text-red-500' :
                                            isReady ? 'text-yellow-600' : 'text-blue-700'}`}
                                    >{paymentStatus}</p>

                                    <button className="py-2 px-4 border-2 border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 whitespace-nowrap " onClick={handleShowInfo}>결제 정보</button>
                                </div>
                            </td>

                            <td className="py-4 px-6 lg:py-2 lg:px-6 border-l" rowSpan={rowspan}>
                                {!isCancelled && (
                                    <button className="py-2 px-4 border-2 border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 whitespace-nowrap ">배송 정보</button>
                                )}
                            </td>
                        </>
                    )}
                </>
            )}


            {isMobileView && (
                <>
                    <td className="py-2 px-0 md:px-4">
                        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
                            <img src={process.env.PUBLIC_URL + `/upload/${orderItem.cartItem.product.imageUrl}`} alt={orderItem.cartItem.product.name} style={{ width: '100%', height: '100%' }} />
                            {isCancelled && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(128, 128, 128, 0.6)', zIndex: 1 }}></div>}
                        </div>
                        {!isCancelled && (
                            <button
                                className="block p-1 mt-2 mx-auto border-2 border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
                                onClick={orderItem.isReview ? handleShowReview : handleWriteReview}
                            >
                                {orderItem.isReview ? '후기 보기' : '후기 작성'}
                            </button>
                        )}

                        <div className="mt-5 max-w-[120px] m-auto">
                            <p className={`overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-bold mb-1 ${isCancelled ? 'line-through' : ''}`}>{orderItem.cartItem.product.name}</p>
                            <p className={`text-xs text-gray-500 ${isCancelled ? 'line-through' : ''}`}>{orderItem.cartItem.option?.name} +{orderItem.cartItem.option?.addPrice.toLocaleString()}원</p>
                            <p className={`text-xs font-bold ${isCancelled ? 'line-through' : ''}`}>
                                {(totalPrice + shippingCost + optionCost).toLocaleString()}원 / {orderItem.cartItem.quantity}개
                            </p>
                        </div>

                    </td>



                    {isFirstItem && (
                        <>
                            <td className="py-4 px-6 lg:py-0 lg:px-0 border-l" rowSpan={rowspan}>
                                <div className="flex flex-col h-full">

                                    {isCancelled ? (
                                        <p className="text-sm font-medium text-red-500">취소 완료</p>
                                    ) : (
                                        <p className="text-sm font-medium text-blue-700">결제 완료</p>
                                    )}

                                    <button className="block p-1 mt-2 mx-auto border-2 border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleShowInfo}>결제 정보</button>
                                    {!isCancelled && (
                                        <button className="block p-1 mt-2 mx-auto border-2 border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">배송 정보</button>
                                    )}

                                </div>

                            </td>


                        </>
                    )}
                </>
            )}


            {/* 결제 정보 팝업 컴포넌트 */}
            {showPaymentInfo && <PaymentInfoPopup onClose={() => setShowPaymentInfo(false)} orderNumber={orderNumber} onCancelStatusChange={onCancelStatusChange} />}
            {/* 리뷰 작성 팝업 */}
            {writeReviewPopup && <ReviewPopup onClose={() => setWriteReviewPopup(false)} orderNumber={orderNumber} product={orderItem.cartItem.product} option={orderItem.cartItem.option} onReviewStatusChange={onReviewStatusChange} />}
            {showReviewPopup && <ReviewShowPopup onClose={() => setShowReviewPopup(false)} orderNumber={orderNumber} product={orderItem.cartItem.product} option={orderItem.cartItem.option} />}
        </tr>
    );
};
