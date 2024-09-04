import React, { useState } from 'react'
import styles from './PasswordConfirmation.module.css';
import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { useAuthContext } from 'hook/AuthProvider';

interface PasswordConfirmationProps {
  onConfirm: (isConfirmed: boolean) => void;
}

export const PasswordConfirmation: React.FC<PasswordConfirmationProps> = ({ onConfirm }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');


  const handleConfirm = async () => {
    const url = '/members/authenticate';
    const method = 'POST';
    const data = { password: password };

    try {
      const response = await sendRequestWithToken(url, method, data, setIsLoggedIn);

      if (response === true) {
        onConfirm(true);
        setPassword('');
      }
      else {
        setPasswordError('비밀번호가 일치하지 않습니다.');
      }

    } catch (error: any) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
    }

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  return (
    <div>
      <div className='mt-6'>
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
      </div>

      <div className='mt-6'>
        <button onClick={handleConfirm} className='bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
          확인
        </button>
      </div>

    </div>
  );
}
