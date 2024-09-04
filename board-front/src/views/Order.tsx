import React, { ChangeEventHandler, useEffect, useState } from 'react';
import DaumPost from 'components/DaumPost';
import { OrderFlow } from 'components/OrderFlow';
import './Order.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { AddressObj, Cart, CartItem, InputErrors, Option, OrdererInfo, Product, } from 'types';
import { OrderItemListComp } from 'components/product/OrderItemListComp';
import { refreshAccessToken, sendRequestWithToken } from 'apis/sendRequestWithToken';
import { useAuthContext } from 'hook/AuthProvider';
import axios from 'axios';
import { PayMethodButton } from 'components/Button/PayMethodButton';
import kakaoPayIcon from '../assets/payment/kakaoPay.png'
import tossPayIcon from '../assets/payment/tossPay.png'
import cardIcon from '../assets/payment/card.png'
import { useCart } from 'hook/CartProvider';
import { fetchCartItemsDelete } from 'utils/cartUtils';
import { GuestPaymentModal } from 'components/GuestPaymentModal';
import Member from 'types/interface/member.interface';

declare const window: typeof globalThis & {
    IMP: any;
};

// 입력 필드의 유효성 상태를 관리할 상태의 타입을 정의합니다.
export const Order: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guestPassword, setGuestPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isPaymentInProgress, setIsPaymentInProgress] = useState(false); // 결제 진행 중인지 여부를 관리하는 상태 추가
    const orderItems = useLocation().state?.cartItems || [];

    const { cartItems, setCartItems } = useCart();
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const [ordererName, setOrdererName] = useState<string>('');
    const [ordererPhoneFirst, setOrdererPhoneFirst] = useState('010');
    const [ordererPhoneMid, setOrdererPhoneMid] = useState<string>('');
    const [ordererPhoneLast, setOrdererPhoneLast] = useState<string>('');
    const [receiverName, setReceiverName] = useState<string>('');
    const [receiverPhoneFirst, setReceiverPhoneFirst] = useState('010');
    const [receiverPhoneMid, setReceiverPhoneMid] = useState<string>('');
    const [receiverPhoneLast, setReceiverPhoneLast] = useState<string>('');
    const [addressObj, setAddressObj] = useState<AddressObj>({
        address: '',
        zip: '',
        details: ''
    });
    const [pg, setPg] = useState<string>('nice'); // pg 상태 추가
    const [paymentMethod, setPaymentMethod] = useState<string>('card'); // 결제 수단 상태 추가
    const [ordererInfo, setOrdererInfo] = useState<Member>();

    const firstItemProductName = orderItems.length > 0 ? orderItems[0].cartItem.product.name : '';
    const remainingItemNames = orderItems.slice(1).map((item: { cartItem: { product: { name: any; }; }; }) => item.cartItem.product.name).join(', ');
    const [selectedPoint, setSelectedPoint] = useState<number>(0);
    const [selectedCoupon, setSelectedCoupon] = useState<number>(-1);
   


    useEffect(() => {
        // orderItems가 비어 있는지 확인
        if (!orderItems || orderItems.length === 0) {
            alert("주문할 상품이 없습니다.");
            navigate('/')
        }
        // orderItems가 비어있지 않은 경우에만 실행
        const fetchData = async () => {
            const url = '/info';
            const post = 'GET';
            const data = null;


            try {
                const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);

                setOrdererInfo(response);
                console.log(response)
                if (response) {
                    const { name, phone, postalCode, address, detailAddress } = response;

                    const [phoneFirst, phoneMid, phoneLast] = phone.split('-');

                    setOrdererName(name);
                    setOrdererPhoneFirst(phoneFirst);
                    setOrdererPhoneMid(phoneMid);
                    setOrdererPhoneLast(phoneLast);
                    setReceiverName(name);
                    setReceiverPhoneFirst(phoneFirst);
                    setReceiverPhoneMid(phoneMid);
                    setReceiverPhoneLast(phoneLast);
                    setAddressObj({
                        address: address,
                        zip: postalCode,
                        details: detailAddress
                    });
                }
            } catch (error) {
                console.error('비회원 주문', error);
            }
        };

        fetchData();


    }, [orderItems]);

    const [inputErrors, setInputErrors] = useState<InputErrors>({
        ordererName: false,
        ordererPhoneMid: false,
        ordererPhoneLast: false,
        receiverName: false,
        receiverPhoneMid: false,
        receiverPhoneLast: false,
        address: false,
        zip: false,
    });


    const totalItemPrice: number = orderItems.reduce((total: number, orderItem: Cart) => {
        const itemPrice = (orderItem.cartItem.product.regularPrice - orderItem.cartItem.product.salePrice) * orderItem.cartItem.quantity;

        return total + itemPrice;
    }, 0);

    const totalShippingCost: number = orderItems.reduce((total: number, orderItem: Cart) => {
        const shippingCost = orderItem.cartItem.boxCnt * orderItem.cartItem.product.shippingCost;
        const optionCost = orderItem.cartItem.boxCnt * orderItem.cartItem.option!.addPrice;
        return total + shippingCost + optionCost;
    }, 0);




    const handlePayment = async () => {
        // 결제 진행 중일 때는 중복해서 실행되지 않도록 처리
        if (isPaymentInProgress) {
            return;
        }

        const errors: InputErrors = {
            ordererName: !ordererName,
            ordererPhoneMid: !ordererPhoneMid,
            ordererPhoneLast: !ordererPhoneLast,
            receiverName: !receiverName,
            receiverPhoneMid: !receiverPhoneMid,
            receiverPhoneLast: !receiverPhoneLast,
            address: !addressObj.address,
            zip: !addressObj.zip
        };

        setInputErrors(errors); // 유효성 상태 업데이트

        // 모든 필드가 유효한지 검사
        if (Object.values(errors).some(isInvalid => isInvalid)) {
            alert('모든 정보를 입력해주세요.');
            return;
        }

        let id = null
        try {
            await refreshAccessToken();

            const url = '/info';
            const post = 'GET';
            const data = null;

            const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);
            id = response.memberId

            startPayment(id)

        } catch (error: any) {
            if (error.response && error.response.data) {
                alert('결제호출 중 에러가 발생했습니다.')
                return
            }
            setIsModalOpen(true);
        }

    }
    const handleGuestPayment = () => {
        if (guestPassword.length >= 4 && guestPassword === confirmPassword) {
            // 비밀번호가 유효하면 모달을 닫고 결제를 진행합니다.
            setIsModalOpen(false);
            startPayment(null);
        } else if (guestPassword.length < 4) {
            // 비밀번호가 4글자 미만이면 오류 메시지를 표시합니다.
            alert('비밀번호는 4글자 이상이어야 합니다.');
        } else {
            // 비밀번호가 일치하지 않으면 오류 메시지를 표시합니다.
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    const startPayment = (id: string | null) => {
        setIsPaymentInProgress(true);
        // 주문 상품 정보를 requestData 객체에 담음
        const requestData = orderItems.map((orderItem: Cart) => ({
            cartId: orderItem.cartId,
            cartItem: orderItem.cartItem
        }));

        // requestPay();
        var IMP = window.IMP;
        IMP.init(process.env.REACT_APP_IAMPORT_MERCHANT_CODE); // iamport 가맹점 식별코드
        console.log(pg, paymentMethod)
        const paymentData = {
            pg: pg,
            pay_method: paymentMethod,
            merchant_uid: new Date().getTime(),// 상점에서 관리하는 주문 번호
            name: firstItemProductName + (remainingItemNames ? ` 외 ${orderItems.length - 1}개` : ''),
            amount: totalPrice,
            buyer_email: ordererInfo?.email,
            buyer_name: ordererName,
            buyer_tel: '010-' + ordererPhoneMid + '-' + ordererPhoneLast,
            buyer_addr: addressObj.address + ' ' + addressObj.details,
            buyer_postcode: addressObj.zip,
            custom_data: {
                orderItems: requestData,
                id: id,
                password: guestPassword,
                coupon: ordererInfo?.coupons[selectedCoupon],
                points: selectedPoint
            },
            m_redirect_url : `${process.env.REACT_APP_FRONT_URL}/successOrder`
        };

        IMP.request_pay(paymentData, async function (rsp: any) {

            setIsPaymentInProgress(false); // 결제 진행 중 상태를 해제

            if (rsp.success) {
                console.log(rsp)
                navigate('/successOrder', {
                    state: {
                        imp_uid: rsp.imp_uid
                    }
                });
            } else {
                // 결제가 실패했을 때 처리
                console.error('결제 실패:', rsp.error_msg);
                alert(rsp.error_msg);
            }

        });
    }

    // 입력 필드 변경 시 에러 상태를 해제하는 함수
    const handleChange = (field: string, value: string) => {
        if (field === 'ordererName' || field === 'receiverName') {
            // 정규식을 사용하여 한글만 입력되도록 유효성 검사
            const regex = /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/;

            if (!regex.test(value)) {
                return;
            }
            
        } else {
            // 정규식을 사용하여 숫자만 입력되도록 유효성 검사
            const regex = /^[0-9]*$/;
            if (!regex.test(value)) {
                return;
            }
        }

        // 필드에 따라 상태 업데이트
        if (field === 'ordererName') {
            setOrdererName(value);
        } else if (field === 'ordererPhoneMid') {
            setOrdererPhoneMid(value);
        } else if (field === 'ordererPhoneLast') {
            setOrdererPhoneLast(value);
        } else if (field === 'receiverName') {
            setReceiverName(value);
        } else if (field === 'receiverPhoneMid') {
            setReceiverPhoneMid(value);
        } else if (field === 'receiverPhoneLast') {
            setReceiverPhoneLast(value);
        }

        setInputErrors({
            ...inputErrors,
            [field]: false, // 현재 변경하는 필드의 에러 상태를 false로 설정
        });
    }

    const handlePaymentMethodClick = (selectedPg: string, method: string) => {
        setPg(selectedPg);
        setPaymentMethod(method);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCouponChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        const selectedIndex = parseInt(event.target.value);

        const selectedCouponObj = ordererInfo?.coupons[selectedIndex];
        const coupon = selectedCouponObj ? selectedCouponObj.discount : 0;

        if (totalItemPrice + totalShippingCost - selectedPoint - coupon >= 0) {
            setSelectedCoupon(selectedIndex);
        }
    };
    

    const handleSelectedPointChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const inputValue = event.target.value.trim(); // 입력값의 양 끝 공백 제거
        const value = Number(inputValue); // 입력된 값을 숫자로 변환

        if (isNaN(value) || value < 0) {
            return;
        }

        if (typeof ordererInfo !== 'undefined' && typeof ordererInfo.points !== 'undefined') {
            if (value > ordererInfo.points) {
                setSelectedPoint(ordererInfo.points);
            } else {
                if (totalItemPrice + totalShippingCost - value - couponDiscount() >= 0) {
                    setSelectedPoint(value);
                } else {
                    setSelectedPoint(0);
                }
            }
   
        } else {
            setSelectedPoint(0);
        }
        
    };

    // 할인 금액
    const couponDiscount = () => {
        const selectedCouponObj = ordererInfo?.coupons[selectedCoupon];
        return selectedCouponObj ? selectedCouponObj.discount : 0;
    }

    const totalPrice = totalItemPrice + totalShippingCost - selectedPoint - couponDiscount()

    return (
        <div className='orderContainer'>

            <OrderFlow currentStep={2} />

            <div className='orderTitle'> 배송정보 </div>
            <div className='orderInfo'>
                <div className='orderInfoTitle'> 주문자 정보 </div>
                <input
                    type='text'
                    className={`userName ${inputErrors.ordererName ? 'error' : ''}`}
                    placeholder='주문자'
                    title='주문자'
                    id='ordererName'
                    value={ordererName}
                    onChange={(e) => handleChange('ordererName', e.target.value)}
                />
                <div className='orderPhonNum'>
                    <select
                        className={'phoneNumFirst'}
                        title=''
                        id='ordererPhoneFirst'
                        value={ordererPhoneFirst}
                        onChange={(e) => setOrdererPhoneFirst(e.target.value)}
                    >

                        <option>010</option>
                        <option>011</option>
                        <option>016</option>
                        <option>017</option>
                        <option>018</option>
                        <option>019</option>
                    </select>

                    <input
                        type='text'
                        className={`phoneNum ${inputErrors.ordererPhoneMid ? 'error' : ''}`}
                        placeholder='휴대전화 앞자리'
                        title='휴대전화 앞자리'
                        id='ordererPhoneMid'
                        value={ordererPhoneMid}
                        maxLength={4}
                        onChange={(e) => handleChange('ordererPhoneMid', e.target.value)}
                    />
                    <input
                        type='text'
                        className={`phoneNum ${inputErrors.ordererPhoneLast ? 'error' : ''}`}
                        placeholder='휴대전화 뒷자리'
                        title='휴대전화 뒷자리'
                        id='ordererPhoneLast'
                        value={ordererPhoneLast}
                        maxLength={4}
                        onChange={(e) => handleChange('ordererPhoneLast', e.target.value)}
                    />
                </div>
            </div>

            <div className='orderInfo'>
                <div className='orderInfoTitle'> 배송 정보 </div>
                <input
                    type='text'
                    className={`userName ${inputErrors.receiverName ? 'error' : ''}`}
                    placeholder='받는 사람'
                    title='받는 사람'
                    id='receiverName'
                    value={receiverName}
                    onChange={(e) => handleChange('receiverName', e.target.value)}
                />
                <div className='orderPhonNum'>
                    <select
                        className={'phoneNumFirst'}
                        title=''
                        id='receiverPhoneFirst'
                        value={receiverPhoneFirst}
                        onChange={(e) => setReceiverPhoneFirst(e.target.value)}
                    >
                        <option>010</option>
                        <option>011</option>
                        <option>016</option>
                        <option>017</option>
                        <option>018</option>
                        <option>019</option>
                    </select>

                    <input
                        type='text'
                        className={`phoneNum ${inputErrors.receiverPhoneMid ? 'error' : ''}`}
                        placeholder='휴대전화 앞자리'
                        title='휴대전화 앞자리'
                        maxLength={4}
                        id='receiverPhoneMid'
                        value={receiverPhoneMid}
                        onChange={(e) => handleChange('receiverPhoneMid', e.target.value)}
                    />
                    <input
                        type='text'
                        className={`phoneNum ${inputErrors.receiverPhoneLast ? 'error' : ''}`}
                        placeholder='휴대전화 뒷자리'
                        title='휴대전화 뒷자리'
                        maxLength={4}
                        id='receiverPhoneLast'
                        value={receiverPhoneLast}
                        onChange={(e) => handleChange('receiverPhoneLast', e.target.value)}
                    />
                </div>

                <div className='orderInfoContainer'>
                    <DaumPost addressObj={addressObj} setAddressObj={setAddressObj} inputErrors={inputErrors} setInputErrors={setInputErrors} />
                </div>

                <div className='orderTitle'> 쿠폰 / 적립금 </div>
                <div className='mt-4'>

                    <div className='font-bold mb-2'> 쿠폰 </div>
                    <select
                        value={selectedCoupon}
                        onChange={handleCouponChange}
                        className="coupon"
                    >
                        <option value={-1}>쿠폰을 선택하세요</option>
                            {ordererInfo?.coupons.map((coupon, index) => (
                                (totalItemPrice + totalShippingCost) >= coupon.minimumOrderAmount &&(
                                    <option key={index} value={index}>
                                        {coupon.couponName} (-{coupon.discount.toLocaleString()}원) 
                                        <p>
                                            (최소 주문 금액: {coupon.minimumOrderAmount.toLocaleString()}원)
                                        </p>
                                    </option>
                                )
                            ))}


                    </select>

                    <div className='font-bold mb-2 mt-4'> 적립금 </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={selectedPoint}
                            onChange={handleSelectedPointChange}
                            className="point"
                        />
                        <span className="text-gray-500 text-sm">원 (<strong>사용가능 적립금</strong> : {ordererInfo?.points.toLocaleString()}원)</span>

                    </div>
                </div>



                <div className='orderTitle'> 결제 수단 </div>
                <div className='mt-4'>
                    <div className='font-bold mb-2'> 간편결제 </div>
                    <div className='flex flex-wrap gap-4 mb-4 pl-4'>
                        <PayMethodButton
                            label='kakao pay'
                            imageUrl={kakaoPayIcon}
                            onClick={() => handlePaymentMethodClick('kakaopay', 'point')}
                            selected={pg === 'kakaopay'}
                        />
                        <PayMethodButton
                            label='toss pay'
                            imageUrl={tossPayIcon}
                            onClick={() => handlePaymentMethodClick('tosspay', 'point')}
                            selected={pg === 'tosspay'}

                        />

                    </div>

                    <div className='font-bold mb-2'> 카드결제●계좌이체 </div>
                    <div className='flex flex-wrap gap-4 pl-4'>
                        <PayMethodButton
                            label='신용/체크 카드'
                            imageUrl={cardIcon}
                            onClick={() => handlePaymentMethodClick('nice', 'card')}
                            selected={pg === 'nice' && paymentMethod === 'card'} // 선택된 결제 수단에 따라 selected prop을 설정
                        />
                        <PayMethodButton
                            label='무통장 입금'
                            imageUrl={cardIcon}
                            onClick={() => handlePaymentMethodClick('nice', 'vbank')}
                            selected={pg === 'nice' && paymentMethod === 'vbank'} // 선택된 결제 수단에 따라 selected prop을 설정
                        />
                        <PayMethodButton
                            label='계좌이체'
                            imageUrl={cardIcon}
                            onClick={() => handlePaymentMethodClick('nice', 'trans')}
                            selected={pg === 'nice' && paymentMethod === 'trans'} // 선택된 결제 수단에 따라 selected prop을 설정
                        />
                    </div>

                </div>

                <div className='orderItems'>
                    <div className='orderTitle'> 구매 상품 </div>
                    <div className='scrollableList'>
                        <ul>
                            {orderItems.map((cartItem: Cart) => (
                                <li key={cartItem.cartItem.product.productId}>
                                    <OrderItemListComp orderItem={cartItem} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='totalPriceContainer'>
                    <ul>
                        <li>
                            <div className='priceTitle'>총 상품 합계 금액</div>
                            <div className='price'>{totalItemPrice.toLocaleString()}원</div>
                        </li>

                        <li>
                            <div className='op'>+</div>
                        </li>

                        <li>
                            <div className='priceTitle'>배송비/옵션 합계 금액</div>
                            <div className='price'>{totalShippingCost.toLocaleString()}원</div>
                        </li>
                        
                        <li>
                            <div className='op'>-</div>
                        </li>

                        <li>
                            <div className='priceTitle'>쿠폰/적립금 할인 금액</div>
                            <div className='price'>{(selectedPoint+couponDiscount()).toLocaleString()}원</div>
                        </li>

                        <li>
                            <div className='op'>=</div>
                        </li>

                        <li>
                            <div className='priceTitle'>총 주문 합계 금액</div>
                            <div className='price'>{totalPrice.toLocaleString()}원</div>
                        </li>
                    </ul>
                    <div className='paymentContainer'>
                        <button className='paymentButton' onClick={handlePayment} disabled={isPaymentInProgress}>
                            {isPaymentInProgress ? '결제 진행 중...' : '결제하기'}
                        </button>
                    </div>
                </div>
                <GuestPaymentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleGuestPayment}
                    password={guestPassword}
                    setPassword={setGuestPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                />


            </div>



        </div>
    );
};