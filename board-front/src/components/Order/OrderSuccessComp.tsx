import React from 'react'
import { Link } from 'react-router-dom';
import { OrdererInfo } from 'types';

interface OrderSuccessProps {
    orderNumber: string;
    orderInfo: OrdererInfo;
}

export const OrderSuccessComp: React.FC<OrderSuccessProps> = ({ orderNumber, orderInfo}) => {

    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-xl sm:text-3xl font-bold mb-8 text-center whitespace-nowrap">고객님의 주문이 완료되었습니다.</h1>
                <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
                    <p className="text-lg font-semibold mb-2">주문 번호:</p>
                    <span className="pl-1 sm:pl-4 text-lg font-semibold mb-4">{orderNumber}</span>
                </div>
                <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
                    <div className="mb-4">
                        <p className="text-lg font-semibold mb-2">배송지 정보</p>
                        <ul className="pl-1 sm:pl-4">
                            <li className='flex'><span className="font-semibold inline-block w-24 sm:w-32">받으시는 분:</span>{orderInfo.name}</li>
                            <li className='flex'><span className="font-semibold inline-block w-24 sm:w-32">우편번호:</span>{orderInfo.postalCode}</li>
                            <li className='flex'><span className="font-semibold inline-block w-24 sm:w-32">주소:</span>{orderInfo.address}</li>
                            <li className='flex'><span className="font-semibold inline-block w-24 sm:w-32">전화번호:</span>{orderInfo.phone}</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
                    <p className="text-lg font-semibold mb-2">결제 정보</p>
                    <ul className="pl-1 sm:pl-4">
                        <li className='flex'><span className="font-semibold inline-block w-32">상품명:</span>{orderInfo.itemName}</li>
                        <li className='flex'><span className="font-semibold inline-block w-32">최종결제 금액:</span>{orderInfo.itemAmount && orderInfo.itemAmount.toLocaleString()}원</li>
                        <li className='flex'><span className="font-semibold inline-block w-32">결제 수단:</span>{orderInfo.pgProvider}</li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center gap-10 sm:gap-20">
                <Link to='/myPage'>
                    <button className="text-xs whitespace-nowrap sm:text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        구매내역 확인하기
                    </button>
                </Link>
                <Link to='/'>
                    <button className="text-xs sm:text-lg whitespace-nowrap bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        쇼핑하러 가기
                    </button>
                </Link>
            </div>
        </div>
       
    )
}
