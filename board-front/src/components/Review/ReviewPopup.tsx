import { sendRequestWithToken } from 'apis/sendRequestWithToken';
import { reverse } from 'dns';
import { useAuthContext } from 'hook/AuthProvider';
import React, { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Option, Product, ReviewState } from 'types';

interface ReviewPopupProps {
    onClose: () => void; // 팝업 닫기 함수
    product: Product;
    option?: Option | null;
    orderNumber: string;
    onReviewStatusChange: (newValue: boolean) => void;
}

export const ReviewPopup: React.FC<ReviewPopupProps> = ({ onClose, orderNumber, product, option, onReviewStatusChange }) => {
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    
    const initialState: ReviewState = {
        orderNumber: orderNumber,
        productId: product.productId,
        optionId: option?.optionId ?? null,
        score: 5,
        contents: '',
        imageFiles: [],
    };

    const [reviewState, setReviewState] = useState<ReviewState>(initialState);

    // 별점 변경 핸들러
    const handlescoreChange = (newscore: number) => {
        setReviewState({
            ...reviewState,
            score: newscore,
        });
    };

    const handleContentsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReviewState({
            ...reviewState,
            contents: event.target.value,
        });
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileList = Array.from(files);
            setReviewState({
                ...reviewState,
                imageFiles: [...reviewState.imageFiles, ...fileList],
            });
        }
    };

    const handleDeleteImage = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // 기본 동작 중지

        const newSelectedFiles = [...reviewState.imageFiles];
        newSelectedFiles.splice(index, 1);
        setReviewState({
            ...reviewState,
            imageFiles: newSelectedFiles,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const url = '/info/reviewSave';
            const method = 'POST';
            const formData = new FormData();
    
            // ReviewState의 필드를 FormData에 추가
            formData.append('orderNumber', reviewState.orderNumber);
            formData.append('productId', reviewState.productId.toString());
            if (reviewState.optionId !== null) {
                formData.append('optionId', reviewState.optionId.toString());
            }
            formData.append('score', reviewState.score.toString());
            formData.append('contents', reviewState.contents);
            
            // 이미지 파일도 FormData에 추가
            reviewState.imageFiles.forEach((file) => {
                formData.append('imageFiles', file);
            });

            
            console.log(formData)
            // FormData를 서버로 전송
            const response = await sendRequestWithToken(url, method, formData, setIsLoggedIn);
            onReviewStatusChange(true);

            // isReivew -> true
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    
        onClose(); // 팝업 닫기
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className="cursor-pointer" onClick={() => handlescoreChange(i)}>
                    {i <= reviewState.score ? <AiFillStar className="text-yellow-500" /> : <AiOutlineStar className="text-gray-300" />}
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 w-96">
                <div className="flex justify-between items-center mb-6">
                    <div className='max-w-[80%]'>
                        <h2 className="m-0 text-lg font-bold overflow-hidden overflow-ellipsis whitespace-nowrap">{product.name}</h2>
                        {option && (
                            <div className="text-start text-sm text-gray-500">- {option.name}</div>
                        )}
                    </div>

                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                    <div>
                        <label htmlFor="score" className="block font-semibold">별점:</label>
                        <div className="flex justify-center text-2xl">{renderStars()}</div>
                    </div>
                    <div>
                        <label htmlFor="contents" className="block font-semibold">내용:</label>
                        <textarea id="contents" value={reviewState.contents} onChange={handleContentsChange} className="border border-gray-300 rounded-md py-2 px-4 w-full h-24 resize-none" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="photo" className="block font-semibold mb-1">사진 첨부:</label>
                        <input id="photo" type="file" accept="image/*" onChange={handleFileSelect} multiple className="hidden" />
                        <div className={`flex flex-wrap items-center ${reviewState.imageFiles.length > 1 ? 'overflow-y-auto max-h-40' : ''}`}>
                            {reviewState.imageFiles.map((file, index) => (
                                <div key={index} className="w-20 h-20 mr-2 mb-2 relative">
                                    <button className="absolute top-0 right-0 bg-red-500 rounded-full p-1" onClick={(e) => handleDeleteImage(index, e)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <img src={URL.createObjectURL(file)} alt={`Selected File ${index}`} className="w-full h-full object-cover rounded-md" />
                                </div>
                            ))}
                        </div>

                        <label htmlFor="photo" className="border border-gray-300 rounded-md py-2 px-4 w-full cursor-pointer hover:bg-gray-100 text-center">
                            {reviewState.imageFiles.length > 0 ? `${reviewState.imageFiles.length}개의 파일 선택됨` : '파일 선택'}
                        </label>
                    </div>

                    <button type="submit" className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 mt-4">작성 하기</button>
                </form>
            </div>
        </div>
    );
};
