// src/components/FindAccount.tsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const FindId: React.FC = () => {
  const [name, setName] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (selectedDomain !== 'custom') {
      setEmailDomain(selectedDomain);
    }
  }, [selectedDomain]);

  const getEmail = () => {
    return `${emailLocal}@${emailDomain}`;
  };

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = getEmail();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/members/findId`, {
        name: name,
        email: email,
      });

      console.log(response);
      setResult(`아이디: ${response.data}`);
    } catch (e: any) {
      alert(e.response.data);
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailDomain(e.target.value);
    setSelectedDomain('custom');
  };

  return (
    <div className="max-w-md p-6 bg-white shadow-md rounded-md mt-10 mb-10">
      <h2 className="text-left text-xl font-semibold pb-2 mb-4 border-b-2 border-blue-700">아이디 찾기</h2>
      <form className="px-4" onSubmit={handleFindId}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="이메일"
            value={emailLocal}
            onChange={(e) => setEmailLocal(e.target.value)}
            className="w-1/3 h-full p-2 border border-gray-300 rounded"
            required
          />
          <span className="p-2">@</span>
          <input
            type="text"
            placeholder="도메인"
            value={emailDomain}
            onChange={handleDomainChange}
            className="w-1/3 h-full p-2 border border-gray-300 rounded"
            required
          />
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-1/3 h-full p-2 ml-2 border border-gray-300 rounded"
          >
            <option value="custom">직접입력</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
            <option value="google.com">google.com</option>
          </select>
        </div>
        <div className="mb-4 invisible">
          <input
            type="text"
            placeholder="비어있는 칸"
            className="p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white rounded"
        >
          아이디 찾기
        </button>
      </form>
      {result && 
        <div>
          <p className="mt-10 pt-2 text-lg font-bold border-t-2 border-blue-700">아이디 정보</p>
          <p className="ml-2">
            {result}
          </p>
        </div>
      }
    </div>
  );
};

const FindPassword: React.FC = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (selectedDomain !== 'custom') {
      setEmailDomain(selectedDomain);
    }
  }, [selectedDomain]);

  const getEmail = () => {
    return `${emailLocal}@${emailDomain}`;
  };

  const handleFindPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = getEmail();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/members/findPassword`, {
        name: name,
        id: id,
        email: email,
      });
      setResult(response.data);
    } catch (e: any) {
      alert(e.response.data);
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailDomain(e.target.value);
    setSelectedDomain('custom');
  };

  return (
    <div className="max-w-md p-6 bg-white shadow-md rounded-md mt-10 mb-10">
      <h2 className="text-left text-xl font-semibold pb-2 mb-4 border-b-2 border-blue-700">비밀번호 찾기</h2>
      <form className="px-4" onSubmit={handleFindPassword}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full h-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="이메일"
            value={emailLocal}
            onChange={(e) => setEmailLocal(e.target.value)}
            className="w-1/3 h-full p-2 border border-gray-300 rounded"
            required
          />
          <span className="p-2">@</span>
          <input
            type="text"
            placeholder="도메인"
            value={emailDomain}
            onChange={handleDomainChange}
            className="w-1/3 h-full p-2 border border-gray-300 rounded"
            required
          />
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-1/3 h-full p-2 ml-2 border border-gray-300 rounded"
          >
            <option value="custom">직접입력</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
            <option value="google.com">google.com</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white rounded"
        >
          비밀번호 찾기
        </button>
      </form>
      {result && <p className="mt-4">{result}</p>}
    </div>
  );
};

export const FindAccount: React.FC = () => {
  return (
    <div className="sm:flex justify-center gap-10">
      <FindId />
      <FindPassword />
    </div>
  );
};
