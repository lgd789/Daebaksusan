// DaumPost.tsx

import React from 'react';
import './DaumPost.css';
import { AddressData, AddressObj, InputErrors } from 'types';
import { AddressFinderButton } from './Button/AddressFinderButton';

interface DaumPostProps {
  addressObj: AddressObj;
  setAddressObj: (obj: AddressObj) => void;
  inputErrors: InputErrors;
  setInputErrors: (obj: InputErrors) => void;
}

export const DaumPost: React.FC<DaumPostProps> = ({ addressObj, setAddressObj, inputErrors, setInputErrors}) => {
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
      setInputErrors({
        ...inputErrors,
        ['address']: false,
        ['zip']: false,
      });

      setAddressObj(newAddressObj); // 부모 컴포넌트에 주소 객체 전달
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

  return (
    <>
      <div className="addresContainer">
        <input
          type="text"
          className={`address ${inputErrors.zip ? 'error' : ''}`}
          placeholder="우편 번호"
          title="우편 번호"
          id="zipCode"
          value={addressObj.zip}
          readOnly
        />
        <AddressFinderButton onCompletePostcode={onCompletePostcode} /> {/* 새로운 컴포넌트를 사용합니다. */}
      </div>
      <input
        type='text'
        className={`address ${inputErrors.address ? 'error' : ''}`}
        placeholder='주소'
        title='주소'
        id='fullAddress'
        value={addressObj.address}
        readOnly
      />
      <input
        type='text'
        className='address'
        placeholder='상세 주소'
        title='상세 주소'
        id='detailAddress'
        value={addressObj.details}
        onChange={handleDetailAddressChange} // onChange 이벤트 핸들러 추가
      />
    </>
  );
};

export default DaumPost;
