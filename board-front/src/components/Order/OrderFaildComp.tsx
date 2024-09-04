import React from 'react'
import { Link } from 'react-router-dom'

export const OrderFailedComp = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-xl sm:text-3xl font-bold mb-8 text-center whitespace-nowrap">결제가 실패하였습니다.</h1>
            <p className="text-lg mb-8 text-center">죄송합니다. 결제가 실패하였습니다.</p>
            <div className="flex justify-center">
                <Link to='/'>
                    <button className="text-lg whitespace-nowrap bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        홈으로 돌아가기
                    </button>
                </Link>
            </div>
        </div>
    )
}
