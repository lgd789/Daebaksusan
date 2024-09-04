import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { OrderFlow } from 'components/OrderFlow';
import { OrderSuccessComp } from 'components/Order/OrderSuccessComp';
import { OrderFailedComp } from 'components/Order/OrderFaildComp';
import { Cart, OrdererInfo } from 'types';
import { useCart } from 'hook/CartProvider';
import { fetchCartItemsDelete } from 'utils/cartUtils';
import { useAuthContext } from 'hook/AuthProvider';
import { Loading } from 'components/Loading/Loading';

export const OrderRedirectPage = () => {
    const { cartItems, setCartItems } = useCart();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const location = useLocation();
    const [orderInfo, setOrderInfo] = useState<OrdererInfo>({
        memberId: '',
        password: '',
        name: '',
        phone: '',
        email: '',
        postalCode: '',
        address: '',
        detailAddress: '',
        itemName: '',
        itemAmount: 0,
        pgProvider: ''
    });
    const [orderNumber, setOrderNumber] = useState<string>();
    const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);

    const compareAndSetSelect = (orderItems: Cart[]) => {
        const updatedCartItems = cartItems.map(cartItem => {
            const foundOrderItem = orderItems?.find(orderItem => orderItem.cartId === cartItem.cartId);
            return { ...cartItem, isSelected: !!foundOrderItem };
        });
        return updatedCartItems;
    };

    const handlePaymentResponse = async (imp_uid: string) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment/verifyIamport/${imp_uid}`);
            const { orderNumber, iamportResponse, orderItems } = response.data;

            console.log(response.data);
            setOrderNumber(orderNumber);
            setOrderInfo({
                ...orderInfo,
                name: iamportResponse.response.buyerName,
                phone: iamportResponse.response.buyerTel,
                address: iamportResponse.response.buyerAddr,
                postalCode: iamportResponse.response.buyerPostcode,
                pgProvider: iamportResponse.response.pgProvider,
                itemAmount: iamportResponse.response.amount,
                itemName: iamportResponse.response.name
            });
            setPaymentSuccess(true);

            const updatedCartItems = compareAndSetSelect(orderItems);
            fetchCartItemsDelete(updatedCartItems, setCartItems, setIsLoggedIn);
        } catch (error: any) {
            console.error('결제 확인 중 오류 발생:', error);
            const errorMessage = error.response && error.response.data ? error.response.data.message : '결제 실패';
            alert(errorMessage);
            setPaymentSuccess(false);
        }
    };

    useEffect(() => {
        const handleData = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const state = location.state;

            if (state) {
                const { imp_uid } = state;
                await handlePaymentResponse(imp_uid);
            } else {
                const imp_uid = searchParams.get('imp_uid');
                const imp_success = searchParams.get('imp_success');
                const error_msg = searchParams.get('error_msg');

                if (imp_success && imp_uid) {
                    if (imp_success === 'true') {
                        console.log(imp_success, imp_uid)
                        await handlePaymentResponse(imp_uid);
                    }
                    else {
                        console.error('결제 실패:', error_msg);
                        alert('결제 실패');
                        setPaymentSuccess(false)
                    }
                }
            }
        };
        
        handleData();
    }, []);

    return (
        <div className='orderContainer md:px-4 lg:px-8 xl:px-16'>
            <OrderFlow currentStep={3} />
            <div className="bg-white min-h-screen text-left">
                {paymentSuccess !== null ? (
                    paymentSuccess && orderNumber ? (
                        <OrderSuccessComp
                            orderNumber={orderNumber}
                            orderInfo={orderInfo}
                        />
                    ) : (
                        <OrderFailedComp />
                    )
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
};
