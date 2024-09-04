// AddressFinderButton.tsx

import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

interface AddressFinderButtonProps {
  onCompletePostcode: (data: any) => void; // onCompletePostcode 함수를 받아옵니다.
  className?: string; // className을 옵셔널하게 받습니다.
}

export const AddressFinderButton: React.FC<AddressFinderButtonProps> = ({ onCompletePostcode, className }) => {
  const postcodeScriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const openPostcodePopup = useDaumPostcodePopup(postcodeScriptUrl);

  const handleOpenPostcodePopup = () => {
    openPostcodePopup({ onComplete: onCompletePostcode });
  };


  const buttonClassName = className ? className : "w-32 h-10 ml-4 bg-blue-700 text-white font-bold rounded-md cursor-pointer flex justify-center items-center transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 whitespace-nowrap";

  return (
    <button className={buttonClassName} onClick={handleOpenPostcodePopup}>
      주소 찾기
    </button>
  );
};
