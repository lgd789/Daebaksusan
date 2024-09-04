import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import axios from 'axios';
import { useAuthContext } from 'hook/AuthProvider';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialReAuthentication } from './SocialReAuthentication';
import { Member } from 'types';

interface MemberDeleteProps {
  userInfo?: Member;
  isSocialAuthenticated: boolean;
  socialToken: string;
}
export const MemberDelete: React.FC<MemberDeleteProps> = ({ userInfo, isSocialAuthenticated, socialToken }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [confirmText, setConfirmText] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmTextError, setConfirmTextError] = useState<string>('');

  const handleLogOut = () => {
    localStorage.removeItem('accessToken'); // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleConfirmTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
    setConfirmTextError('');
  };
  const handleDelete = async () => {
    // 확인 모달 표시
    if (window.confirm("정말로 회원 탈퇴하시겠습니까?")) {
      const url = '/members/withdraw';
      const method = 'DELETE';
      const data = { 
        password: password,
        token: socialToken,
      };

      try {
        const response = await sendRequestWithToken(url, method, data, setIsLoggedIn);
        console.log(response);
        setIsConfirming(false);
        setPassword('');
        setConfirmText('');
        alert("회원 탈퇴가 성공적으로 처리되었습니다!");

        handleLogOut();
        navigate('/');
      } catch (error: any) {
        setIsConfirming(false);
        alert(error.response.data);
      }
    }
  };

  const handleDeleteConfirmation = () => {
    if (confirmText === "탈퇴합니다") {
      setIsConfirming(true);
    } else {
      setConfirmTextError('탈퇴 확인 문구가 일치하지 않습니다.');
    }
  };
  const isSocialUser = userInfo?.type === 'naver' || userInfo?.type === 'kakao';
  return (
    <div className='text-left'>
      <div className='mt-3 text-left text-2xl border-b font-semibold'> 회원 탈퇴 </div>
      <div className='mt-6 w-3/4 sm:w-1/4'>
        {isSocialUser && !isSocialAuthenticated && (
          <SocialReAuthentication provider={userInfo?.type} redirectPath="memberDelete" />
        )}
        {!isSocialUser && (
          <>
            <label htmlFor='password' className='block font-medium mb-1'>
              비밀번호 입력
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={handleInputChange}
              className={`border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordError ? 'border-red-500' : ''}`}
            />
            {passwordError && <p className='text-red-500 mt-1'>{passwordError}</p>}
          </>
        )}
      </div>
      {((isSocialUser && isSocialAuthenticated) || !isSocialUser) && (
        <>
          <div className='mt-6 w-3/4 sm:w-1/4'>
            <label htmlFor='confirmText' className='block font-medium mb-1'>
              탈퇴 확인 문구 입력
            </label>
            <input
              type='text'
              id='confirmText'
              value={confirmText}
              placeholder='"탈퇴합니다"를 입력하세요'
              onChange={handleConfirmTextChange}
              className={`border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${confirmTextError ? 'border-red-500' : ''}`}
            />
            {confirmTextError && <p className='text-red-500 mt-1'>{confirmTextError}</p>}
          </div>
      
          <div className='mt-6'>
            <button onClick={handleDeleteConfirmation} className='bg-red-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'>
              탈퇴하기
            </button>
          </div>
        </>
      )}
      {isConfirming && (
        <div className='fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-md'>
            <p className='text-lg font-semibold'>정말로 탈퇴하시겠습니까?</p>
            <div className='mt-4 flex justify-center'>
              <button onClick={handleDelete} className='bg-red-500 text-white px-4 py-2 rounded-md mr-4 focus:outline-none focus:ring-2 focus:ring-red-500'>
                탈퇴
              </button>
              <button onClick={() => setIsConfirming(false)} className='bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500'>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

