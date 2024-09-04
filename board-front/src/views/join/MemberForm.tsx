import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import axios from 'axios';
import { AddressFinderButton } from 'components/Button/AddressFinderButton';
import { useAuthContext } from 'hook/AuthProvider';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AddressData, AddressObj, Member } from 'types';


interface MemberFormProps {
    userInfo?: Member;
}
export const MemberForm: React.FC<MemberFormProps> = ({ userInfo }) => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();

    const [memberId, setMemberId] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone1, setPhone1] = useState<string>('');
    const [phone2, setPhone2] = useState<string>('');
    const [phone3, setPhone3] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailDomain, setEmailDomain] = useState<string>('');
    const [addressObj, setAddressObj] = useState<AddressObj>({
        address: '',
        zip: '',
        details: ''
    });

    useEffect(() => {
        if (userInfo) {
            setMemberId(userInfo.id);
            setName(userInfo.name);

            const phoneParts = userInfo.phone.split('-');
            setPhone1(phoneParts[0]);
            setPhone2(phoneParts[1]);
            setPhone3(phoneParts[2]);

            const emailParts = userInfo.email.split('@');
            setEmail(emailParts[0]);
            setEmailDomain(emailParts[1]);

            setAddressObj({
                address: userInfo.address,
                zip: userInfo.postalCode,
                details: userInfo.detailAddress
            });


        }
    }, [userInfo]);

    const handleSubmit = async () => {
        const fullPhone = `${phone1}-${phone2}-${phone3}`;
        const fullEmail = `${email}@${emailDomain}`;

        // 회원 ID와 비밀번호 확인
        const idRegex = /^[a-zA-Z0-9]+$/;
        if (!userInfo && !memberId.match(idRegex)) {
            alert('아이디는 알파벳과 숫자만 포함해야 합니다.');
            return;
        }

        if (!userInfo && memberId.length < 4) {
            alert('아이디는 최소 4자 이상이어야 합니다.');
            return;
        }

        // 비밀번호 확인
        if (userInfo && ((currentPassword && (!password || !passwordConfirm)) || (!currentPassword && (password || passwordConfirm)))) {
            alert('현재 비밀번호를 입력한 경우 새로운 비밀번호와 비밀번호 확인을 모두 입력해야 합니다.');
            return;
        }

        if (!userInfo || (!userInfo && password !== '') || (userInfo && password !== '' && passwordConfirm !== '')) {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;
            if (!password.match(passwordRegex)) {
                console.log(password);
                alert('비밀번호는 영문, 숫자, 특수문자가 각각 하나 이상 포함되어야 합니다.');
                return;
            }

            if (password.length < 8 || password.length > 15) {
                alert('비밀번호는 특수문자 + 영문 + 숫자 8 ~ 15자리 이어야 합니다.');
                return;
            }

            if (password !== passwordConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
        }

        const nameRegex = /^[가-힣]+$/;
        if (!name.match(nameRegex)) {
            alert('이름은 한글만 입력 가능합니다.');
            return;
        }

        const phoneRegex = /^[0-9]+$/;
        if (!phone1.match(phoneRegex) || !phone2.match(phoneRegex) || !phone3.match(phoneRegex)) {
            alert('휴대폰 번호는 숫자만 입력 가능합니다.');
            return;
        }


        // 이메일 형식 확인
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!fullEmail.match(emailRegex)) {
            alert('올바른 이메일 형식이 아닙니다.');
            return;
        }

        if (!userInfo && (!addressObj || !addressObj.address || addressObj.address.trim() === '')) {
            alert('배송지를 등록해주세요');
            return;
        }

        if (userInfo) {
            try {
                console.log(currentPassword)
                const url = `/info/updateInfo`;
                const post = 'POST';
                const data = {
                    id: memberId,
                    currentPassword: currentPassword,
                    password: password,
                    name: name,
                    phone: fullPhone,
                    email: fullEmail,
                    postalCode: addressObj.zip,
                    address: addressObj.address,
                    detailAddress: addressObj.details
                };
                const response = await sendRequestWithToken(url, post, data, setIsLoggedIn);

                alert('수정이 완료 되었습니다. 다시 로그인해 주세요.');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setIsLoggedIn(false);
                navigate('/login')
            } catch (error: any) {
                alert(error.response.data);
            }
        } else {
            try {

                const response = await axios.post(`${process.env.REACT_APP_API_URL}/members/signUp`, {
                    id: memberId,
                    password: password,
                    name: name,
                    phone: fullPhone,
                    email: fullEmail,
                    postalCode: addressObj.zip,
                    address: addressObj.address,
                    detailAddress: addressObj.details
                });
                console.log(response.data);
                alert('회원가입이 완료 되었습니다.');
                navigate('/login')
            } catch (error: any) {
                alert(error.response.data);
            }
        }
    };

    const handlePhoneChange = (field: string, value: string) => {
        const regex = /^[0-9]*$/;
        if (!regex.test(value)) {
            return;
        }

        if (field === 'phone1') {
            setPhone1(value);
        } else if (field === 'phone2') {
            setPhone2(value);
        } else if (field === 'phone3') {
            setPhone3(value);
        }
    }

    const onCompletePostcode = (data: AddressData) => {
        const { address, addressType, bname, buildingName, sido, sigungu, zonecode } = data;
        let extraAddress = '';
        let localAddress = `${sido} ${sigungu}`;

        if (addressType === 'R') {
            extraAddress += bname ? bname : '';
            extraAddress += buildingName ? (extraAddress ? `, ${buildingName}` : buildingName) : '';
            const fullAddress = address.replace(localAddress, '') + (extraAddress ? ` (${extraAddress})` : '');

            const newAddressObj = {
                address: localAddress + fullAddress,
                zip: zonecode,
                details: ''
            };

            setAddressObj(newAddressObj);
        }
    };

    // 상세 주소 업데이트 함수 추가
    const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedAddressObj = {
            ...addressObj,
            details: e.target.value
        };
        setAddressObj(updatedAddressObj); // 필요한 경우 부모 컴포넌트에도 업데이트 반영
    };

    const buttonClassName = "text-white text-xs bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-2 m-2 text-center";

    return (
        <div id="registrationForm">
            <div className="grid grid-rows-4 h-48 mb-5">
                <div className="text-start text-blue-700 text-2xl font-semibold border-b-2 border-blue-700">01. 로그인 정보</div>

                <div className="grid grid-cols-6 border-b-2 border-gray-300">
                    <label htmlFor="memberId" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">회원 ID</label>
                    <div className="col-span-4 flex">
                        <input type="text" id="memberId" name="memberId" required minLength={4}
                            className={`m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${userInfo ? 'bg-gray-200' : ''}`}
                            readOnly={!!userInfo} placeholder="ID 입력" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
                        <div className="flex items-center text-xs">4자리 이상 입력</div>
                    </div>
                </div>


                {(userInfo && (userInfo?.type === 'sign')) && (
                    <div className="grid grid-cols-6 border-b-2 border-gray-300">
                        <label htmlFor="password" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">현재 비밀번호</label>
                        <div className="col-span-4 flex">
                            <input type="password" id="password" name="password" required minLength={8}
                                className="m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="비밀번호 입력" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                    </div>
                )}
                {(!userInfo || userInfo.type === 'sign') && (
                    <>
                        <div className="grid grid-cols-6 border-b-2 border-gray-300">
                            <label htmlFor="password" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">비밀번호</label>
                            <div className="col-span-4 flex">
                                <input type="password" id="password" name="password" required minLength={8}
                                    className="m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="비밀번호 입력" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <div className="flex items-center text-xs">영문 + 숫자 8자리 이상</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-6 border-b-2 border-gray-300">
                            <label htmlFor="passwordConfirm" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">비밀번호 확인</label>
                            <div className="col-span-4 flex">
                                <input type="password" id="passwordConfirm" name="passwordConfirm" required minLength={8}
                                    className="m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="비밀번호를 재입력" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                                <div className="flex items-center text-xs">일치하도록</div>
                            </div>
                        </div>
                    </>
                )}




            </div>
            <div className="grid grid-rows-4 h-48 mb-5">
                <div className="text-start text-blue-700 text-2xl font-semibold border-b-2 border-blue-700"> 02. 개인 정보 </div>

                <div className="grid grid-cols-6 border-b-2 border-gray-300">
                    <label htmlFor="name" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">이름</label>
                    <div className="flex">
                        <input type="text" id="name" name="name" required
                            className={`m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${userInfo ? 'bg-gray-200' : ''}`}
                            readOnly={!!userInfo} placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />
                        <div className="flex items-center text-xs"></div>
                    </div>
                </div>

                {/* 휴대폰 번호 입력 필드는 세 개로 나누어 관리합니다. */}
                <div className="grid grid-cols-6 border-b-2 border-gray-300">
                    <label htmlFor="name" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">휴대폰 번호</label>
                    <div className="flex">
                        <input type="text" id="phone1" name="phone1" required maxLength={3}
                            className={`m-2 w-12 sm:w-20 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${userInfo ? 'bg-gray-200' : ''}`}
                            readOnly={!!userInfo} placeholder="010" value={phone1} onChange={(e) => handlePhoneChange('phone1', e.target.value)} />
                        <div className="flex items-center text-xs">-</div>
                        <input type="text" id="phone2" name="phone2" required maxLength={4}
                            className={`m-2 w-12 sm:w-20 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${userInfo ? 'bg-gray-200' : ''}`}
                            readOnly={!!userInfo} placeholder="1234" value={phone2} onChange={(e) => handlePhoneChange('phone2', e.target.value)} />
                        <div className="flex items-center text-xs">-</div>
                        <input type="text" id="phone3" name="phone3" required maxLength={4}
                            className={`m-2 w-12 sm:w-20 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${userInfo ? 'bg-gray-200' : ''}`}
                            readOnly={!!userInfo} placeholder="5678" value={phone3} onChange={(e) => handlePhoneChange('phone3', e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-6 border-b-2 border-gray-300">
                    <label htmlFor="email" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">이메일</label>
                    <div className="flex">
                        <input type="text" id="email" name="email" required
                            className={`m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="이메일을 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <span className="flex items-center text-xs">@</span>
                        <input type="text" id="emailDomain" name="emailDomain" required
                            className={`m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="도메인" value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)} />
                    </div>
                </div>
            </div>
            {/* 배송 주소 */}
            <div className="grid grid-rows-4 h-48 mb-5">
                <div className="text-start text-blue-700 text-2xl font-semibold border-b-2 border-blue-700"> 03. 기본 배송지 등록</div>

                <div className="row-span-3 grid grid-cols-6 border-b-2 border-gray-300">
                    <label htmlFor="address" className="col-span-2 sm:col-span-1 text-sm font-medium text-gray-700 flex justify-center items-center bg-blue-100">배송 주소</label>
                    <div className="grid grid-rows-3">
                        <div className="flex">
                            <input type="text" id="postal_code" name="postal_code" required
                                className="m-2 w-20 sm:w-32 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="우편 번호" value={addressObj.zip} readOnly />
                            <AddressFinderButton onCompletePostcode={onCompletePostcode} className={buttonClassName} />
                            {/* <button className="text-white text-xs bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-2 m-2 text-center">주소찾기</button> */}
                        </div>
                        <div className="flex">
                            <input type="text" id="address" name="address" required
                                className="m-2 w-52 sm:w-64 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="주소" value={addressObj.address} readOnly />
                        </div>
                        <div className="flex">
                            <input type="text" id="detail_address" name="detail_address" required
                                className="m-2 w-52 sm:w-64 text-xs border-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="상세 주소" value={addressObj.details} onChange={handleDetailAddressChange} />
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex justify-end">
                <button
                    className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={handleSubmit}>{userInfo ? '수정' : '계속'}</button>
            </div>
        </div>
    )
}
