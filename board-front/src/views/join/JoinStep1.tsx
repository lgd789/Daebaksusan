import JoinTimeLineComp from 'components/JoinTimeLineComp';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const JoinStep1: React.FC = () => {
    const [memberType, setMemberType] = useState<string | null>(null);
    const [warning, setWarning] = useState<boolean>(false);
    // 사업자 번호 입력란 상태 추가
    const [showBusinessNumber, setShowBusinessNumber] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleMemberTypeChange = (type: string) => {
        setMemberType(type);
        if (warning) setWarning(false);

        // 기업 회원을 선택했을 경우 사업자 번호 입력란을 보여주고, 간편 로그인 버튼들을 숨깁니다.
        if (type === 'enterprise') {
            setShowBusinessNumber(true);
        } else {
            setShowBusinessNumber(false);
        }
    };

    const handleJoinClick = () => {
        if (!memberType) {
            setWarning(true);
            window.scrollTo({
                top: document.querySelector('.member-selection')?.getBoundingClientRect().top ?? 0 - window.innerHeight / 2,
                behavior: 'smooth',
            });
        } else {
            navigate('/joinStep2');
            console.log("회원가입 로직 처리", memberType);
        }
    };

    return (
        <div className="container mt-10 py-5 rounded-lg">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-2xl text-blue-600 font-semibold">회원가입</h1>
            </div>
            <div className="py-2">
                <div className="sm:flex sm:justify-between">
                    <div className="sm:w-1/5 sm:border-r sm:text-l font-semibold">
                        <div className="space-y-6 mt-10">
                            <div className="">
                                <JoinTimeLineComp currentStep={1} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white text-gray-800 container mx-auto p-8">
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-semibold mb-6">대박 수산에 오신 것을 환영합니다.</div>
                            {warning && <div className="text-red-500">회원 선택을 바랍니다.</div>}
                            <div className="sm:w-1/2 member-selection flex justify-center gap-4 mb-4">
                                <div className={`p-4 rounded-lg border-2 border-gray-500 hover:cursor-pointer hover:border-blue-300 ${memberType === 'individual' ? 'border-blue-500' : ''}`} onClick={() => handleMemberTypeChange('individual')}>
                                    <img src="./individual.png" alt="Placeholder Image" className="mb-2" />
                                    <div className="text-center">개인 회원</div>
                                </div>
                                <div className={`p-4 rounded-lg border-2 border-gray-500 hover:cursor-pointer hover:border-blue-300 ${memberType === 'enterprise' ? 'border-blue-500' : ''}`} onClick={() => handleMemberTypeChange('enterprise')}>
                                    <img src="./Enterprise.png" alt="Placeholder Image" className="mb-2" />
                                    <div className="text-center">기업 회원</div>
                                </div>
                            </div>
                            {showBusinessNumber && (
                                <div className="mb-4">
                                    <input type="text" placeholder="사업자 번호 입력" className="p-2 border rounded-lg" />
                                </div>
                            )}
                            <div className="text-xs">계산서가 필요하신 회원은 기업 회원으로 가입 하시길 바랍니다.</div>
                            <button className="mt-3 py-2 px-4 rounded-md bg-blue-700 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleJoinClick}>회원 가입</button>
                            {/* {!showBusinessNumber && (
                                <div className="grid grid-rows-2">
                                    <div className="grid grid-cols-5 text-sm mt-4">
                                        <div className="border-b-2 border-blue-700 h-3"></div>
                                        <div className="border-b-2 border-blue-700 h-3"></div>
                                        <div className="font-medium text-gray-600">또는</div>
                                        <div className="border-b-2 border-blue-700 h-3"></div>
                                        <div className="border-b-2 border-blue-700 h-3"></div>
                                    </div>
                                    <div className="flex flex-row items-center gap-4">
                                        <button className="mt-3 py-2 px-4 border-2 border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Google 간편 회원 가입</button>
                                        <button className="mt-3 py-2 px-4 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600">Naver 간편 회원 가입</button>
                                        <button className="mt-3 py-2 px-4 rounded-md bg-yellow-300 text-sm font-medium text-yellow-950 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300">Kakao 간편 회원 가입</button>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}