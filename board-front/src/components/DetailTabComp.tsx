import React, { useEffect, useState } from 'react'
import ReviewTabComp from './DetailTab/ReviewTabComp';
import { QnAList } from './DetailTab/QnAList';
import { ProductInfoComp } from './DetailTab/ProductInfoComp';




export const DetailTabComp:React.FC<{productId: number}> = ({ productId }) => {

    const [activeTab, setActiveTab] = useState<string>('상품정보');

    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 700) { // 100px 이상 스크롤됐는지 확인
            setShowButtons(true);
            } else {
            setShowButtons(false);
            }
        };

        // 스크롤 이벤트 리스너 등록
        window.addEventListener('scroll', handleScroll);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // 빈 의존성 배열을 전달하여 컴포넌트 마운트 시에만 실행되도록 함

    // showButtons 상태에 따라 클래스를 조건부로 적용
    const containerClasses = `fixed flex-col gap-2  bottom-[500px] left-[0px] ${showButtons ? 'hidden xl:inline-flex' : 'hidden'}`;


    // 각 탭의 내용을 반환하는 함수입니다.
    const renderContent = () => {
        switch (activeTab) {
            case '상품정보':
                return <ProductInfoComp productId={productId}/>;
            case '구매안내':
                return <div>구매안내 내용입니다.</div>;
            case '후기':
                return <ReviewTabComp productId={productId}/>;
            case 'QnA':
                return <QnAList productId={productId} />;
            default:
                return null;
        }
    };
    // 버튼의 스타일을 결정하는 함수입니다.
    const buttonStyle = (tabName: string) => {
        return `px-4 py-2 border-b hover:border-blue-700 ${activeTab === tabName ? 'text-blue-700 font-bold border-blue-700' : 'tab-inactive'}`;
    }
    const fixedbuttonStyle = (tabName: string) => {
        return `px-4 py-2 border-double border-r-[6px] hover:border-blue-700 text-end ${activeTab === tabName ? 'text-blue-700 font-bold border-blue-700' : 'tab-inactive'}`;
    }

    return (

        <div className="static">
            <div className="flex justify-center space-x-2">
                <button className={buttonStyle('상품정보')} onClick={() => setActiveTab('상품정보')}>상품정보</button>
                <button className={buttonStyle('구매안내')} onClick={() => setActiveTab('구매안내')}>구매안내</button>
                <button className={buttonStyle('후기')} onClick={() => setActiveTab('후기')}>후기</button>
                <button className={buttonStyle('QnA')} onClick={() => setActiveTab('QnA')}>Q&A</button>
            </div>
            <div className={containerClasses}>
                <button className={fixedbuttonStyle('상품정보')} onClick={() => setActiveTab('상품정보')}>상품정보</button>
                <button className={fixedbuttonStyle('구매안내')} onClick={() => setActiveTab('구매안내')}>구매안내</button>
                <button className={fixedbuttonStyle('후기')} onClick={() => setActiveTab('후기')}>후기</button>
                <button className={fixedbuttonStyle('QnA')} onClick={() => setActiveTab('QnA')}>Q&A</button>
            </div>
            <div className="flex justify-center border rounded">
                {renderContent()}
            </div>
        </div>

    );
}
