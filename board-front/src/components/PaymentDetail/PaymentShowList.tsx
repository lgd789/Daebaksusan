import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PaymentDetail } from 'types';

import styles from './PaymentShowList.module.css';
import { PaymentItemComp } from './PaymentItemComp';

interface PaymentShowListProps {
    paymentDetails: PaymentDetail[],
    onPaymentDetailsChange?: (updatedPaymentDetails: PaymentDetail[]) => void
}

export const PaymentShowList: React.FC<PaymentShowListProps> = ({ paymentDetails, onPaymentDetailsChange }) => {
    const [isMobileView, setIsMobileView] = useState(false);
    const [cancelStatus, setCancelStatus] = useState<string[]>([]);


    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 1280);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const initialCancelStatus = paymentDetails.map(payment => payment.status);
        setCancelStatus(initialCancelStatus);

        console.log(initialCancelStatus)
    }, [paymentDetails]);

    const handleCancelStatusChange = (index: number, newValue: string) => {
        const updatedPaymentDetails = paymentDetails.map((paymentDetail, i) => {
            if (i === index) {
                return {
                    ...paymentDetail,
                    status: newValue
                };
            }
            return paymentDetail;
        });

        setCancelStatus(updatedPaymentDetails.map(paymentDetail => paymentDetail.status));

        if (onPaymentDetailsChange) {
            onPaymentDetailsChange(updatedPaymentDetails);
        }
    };

    const handleReviewStatusChange = (index: number, innerIndex: number, newValue: boolean) => {
        const updatedPaymentDetails = paymentDetails.map((paymentDetail, i) => {
            if (i === index) {
                return {
                    ...paymentDetail,
                    orderItems: paymentDetail.orderItems.map((orderItem, j) => {
                        if (j === innerIndex) {
                            return {
                                ...orderItem,
                                isReview: newValue
                            };
                        }
                        return orderItem;
                    })
                };
            }
            return paymentDetail;
        });

        if (onPaymentDetailsChange) {
            onPaymentDetailsChange(updatedPaymentDetails);
        }
    };

    return (
        <div className={styles.paymentItemList}>
            <table>
                <thead>
                    <tr>
                        <th>주문번호</th>
                        {!isMobileView && <th>이미지</th>}
                        {!isMobileView && <th>상품이름</th>}
                        {!isMobileView && <th>결제 가격</th>}
                        {!isMobileView && <th>수량</th>}
                        {!isMobileView && <th>주문상태</th>}
                        {!isMobileView && <th>배송상태</th>}
                        {isMobileView && <th>상품 정보</th>}
                        {isMobileView && <th>주문 정보</th>}
                    </tr>
                </thead>
                <tbody>
                    {paymentDetails.map((paymentDetail, index) => (

                        <React.Fragment key={index}>
                            {(index === 0 || new Date(paymentDetail.orderDate).toLocaleDateString('ko-KR') !== new Date(paymentDetails[index - 1].orderDate).toLocaleDateString('ko-KR')) && (
                                <tr>
                                    <td className={styles.paymentDate} colSpan={7}>
                                        {new Date(paymentDetail.orderDate).toLocaleDateString('ko-KR')}
                                    </td>
                                </tr>
                            )}

                            {paymentDetail.orderItems.map((orderItem, innerIndex) => (



                                <PaymentItemComp
                                    key={innerIndex}
                                    orderItem={orderItem}
                                    orderNumber={paymentDetail.orderNumber}
                                    status={cancelStatus[index]}
                                    isFirstItem={innerIndex === 0}
                                    rowspan={paymentDetail.orderItems.length}
                                    isMobileView={isMobileView}
                                    onCancelStatusChange={(newValue: string) => handleCancelStatusChange(index, newValue)}
                                    onReviewStatusChange={(newValue: boolean) => handleReviewStatusChange(index, innerIndex, newValue)}
                                />

                            ))}

                            <tr>
                                <td colSpan={7}></td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
