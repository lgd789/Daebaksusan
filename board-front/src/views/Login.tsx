import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from 'hook/AuthProvider';


export const Login: React.FC = () => {
  const DOMAIN = `${process.env.REACT_APP_API_URL}`;

  const SNS_LOGIN_URL = (type: 'kakao' | 'naver') => `${DOMAIN}/auth/oauth2/${type}`;

  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (id === '') {
      setInputShake(true);
      setTimeout(() => setInputShake(false), 500);
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/members/login`, {
          id: id,
          password: password,
        });
        const { accessToken, refreshToken } = response.data; // 수정된 부분

        localStorage.setItem('accessToken', accessToken); // 수정된 부분
        localStorage.setItem('refreshToken', refreshToken); // 수정된 부분


        navigate('/');
        setIsLoggedIn(true)
      } catch (error) {
        console.error('로그인 실패:', error);
        alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
      }
    }
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSnsLoginButtonClickHandler = (type: 'kakao' | 'naver') => {
    window.location.href = SNS_LOGIN_URL(type);
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-lg font-extrabold text-blue-700 md:text-2xl">대박 수산에 오신 것을 환영합니다 </h2>
          <h2 className="mt-10 text-center text-base font-extrabold text-gray-700 md:text-lg">탁월한 맛 신선함이 만나는 곳</h2>
          <h2 className="mb-10 text-center text-base font-extrabold text-gray-700 md:text-lg">맛과 품질에 대한 끊임없는 향수를 추구합니다</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className={`rounded-md shadow-sm -space-y-px ${inputShake ? 'shake' : ''}`}>
            <div className="relative">
              <label htmlFor="id-input" className="sr-only">ID</label>
              <input id="id-input" name="id" type="text" autoComplete="id" required className={`appearance-none rounded-lg relative block w-full px-3 py-2 border-2 ${inputShake ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`} placeholder="" value={id} onChange={handleIdChange} />
              <div className="absolute -top-2 left-4 bg-white z-50 text-sm">ID</div>
            </div>
            {/* {showPasswordInput && ( */}
            <div className="space-y-3 relative" id="password-field">
              <label htmlFor="password-input" className="sr-only">비밀번호</label>
              <input id="password-input" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="" value={password} onChange={handlePasswordChange} />
              <button type="button" onClick={togglePasswordVisibility} className="absolute top-0 right-0 pr-3 flex items-center text-sm leading-5 z-50">
                보기
              </button>
              <div className="absolute -top-5 left-4 bg-white z-50 text-sm">비밀번호</div>
            </div>
            {/* )} */}
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              계속
            </button>
          </div>
        </form>
        <div className="text-sm flex justify-end">
          <div className="font-medium">계정이 없으신가요?&nbsp;&nbsp;</div>
          <Link to='/joinStep1' className="font-medium text-blue-600 hover:text-blue-500">가입하기</Link>
        </div>
        <div className="text-sm flex justify-end">
          <Link to='/findAccount' className="font-medium text-blue-600 hover:text-blue-500">아이디 / 비밀번호 찾기</Link>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <div className="border-b-2 border-blue-700 h-3"></div>
          <div className="font-medium text-gray-600">또는</div>
          <div className="border-b-2 border-blue-700 h-3"></div>
        </div>

        <div className="grid grid-rows-2 place-content-center">
          {/* <button className="w-full flex justify-center mt-3 py-3 px-4 border-2 border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Google 계정으로 계속</button> */}

          <img src={process.env.PUBLIC_URL + `/login/naver_login_btnG_complete.png`} className='mb-1 h-[45px] w-full hover:cursor-pointer'
            alt="네이버 로그인 버튼" onClick={() => onSnsLoginButtonClickHandler('naver')} />

          <img src={process.env.PUBLIC_URL + `/login/kakao_login_medium_wide.png`} className="hover:cursor-pointer"
            alt="카카오 로그인 버튼" onClick={() => onSnsLoginButtonClickHandler('kakao')} />
          {/* <button className="w-full flex justify-center mt-3 py-3 px-4 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600" onClick={() => onSnsLoginButtonClickHandler('kakao')}>Naver 계정으로 계속</button> */}
          {/* <button className="w-full flex justify-center mt-3 py-3 px-4 rounded-md bg-yellow-300 text-sm font-medium text-yellow-950 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300">Kakao 계정으로 계속</button> */}
        </div>
      </div>
    </div>
  );
}
