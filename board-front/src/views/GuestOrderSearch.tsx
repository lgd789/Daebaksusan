import axios from 'axios';
import { PaymentShowList } from 'components/PaymentDetail/PaymentShowList';
import React, { useState } from 'react';
import { PaymentDetail } from 'types';

interface OrderSearchFormState {
    ordererNumber: string;
    orderPassword: string;
    isLoading: boolean;
}

const OrderSearchForm: React.FC = () => {
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[] | null>(null);
    const [formState, setFormState] = useState<OrderSearchFormState>({
        ordererNumber: '',
        orderPassword: '',
        isLoading: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/guest/orderDetail`, {
                orderNumber: formState.ordererNumber,
                password: formState.orderPassword // 비밀번호 추가
            });
            console.log(response);
            setPaymentDetails(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('정보가 올바르지 않습니다.');
        } finally {
            setFormState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="orderNumber">
                        주문 번호
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="ordererName"
                        type="text"
                        name="ordererNumber"
                        value={formState.ordererNumber}
                        onChange={handleChange}
                        placeholder="주문 번호를 입력하세요"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2 text-start" htmlFor="orderPassword">
                        주문 조회 비밀번호
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="orderPassword"
                        type="password"
                        name="orderPassword"
                        value={formState.orderPassword}
                        onChange={handleChange}
                        placeholder="주문 조회 비밀번호를 입력하세요"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${formState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={formState.isLoading}
                    >
                        {formState.isLoading ? '조회중...' : '조회하기'}
                    </button>
                </div>
                <div className="mt-4 text-gray-600">
                    비회원 결제 취소는 고객센터로 연락바랍니다.
                </div>
            </form>
            <div className='ml-10 font-medium bg-white rounded shadow-md'>
                {paymentDetails && (
                    <PaymentShowList paymentDetails={paymentDetails} />
                )}
            </div>
        </div>
    );

};

export default OrderSearchForm;
