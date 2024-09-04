import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { Product } from 'types';
import styles from './RecentProducts.module.css'; // 스타일링에 맞게 css 파일을 생성해주세요.
import { Link } from 'react-router-dom';

const RecentProducts: React.FC = () => {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const productListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const products = Cookies.get('recentProducts');
        if (products) {
            setRecentProducts(JSON.parse(products));
        }
    }, [Cookies.get('recentProducts')]);

    
    const scrollProductList = (direction: 'up' | 'down') => {
        if (productListRef.current) {
            const { current: list } = productListRef;
            // 방향에 따라 스크롤 양 조정
            const scrollAmount = direction === 'down' ? -list.offsetHeight-20 : list.offsetHeight+20;
            productListRef.current.scrollTop -= scrollAmount;
        }
    };
    
    return (
        <div className={styles.recentProductsContainer}>
            <div className={styles.title}>최근 본 상품</div>
            <div>
                <ul ref={productListRef}>
                    {recentProducts.map(product => (
                        <li key={product.productId}>
                            <Link to={`/detail/${product.productId}`} > <img src={product.imageUrl} alt="사진" className={styles.recentProductImg}/> </Link>
                        </li>
                    ))}
                </ul>

            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => scrollProductList('up')} className={styles.scrollButton}>이전</button> 
                <button onClick={() => scrollProductList('down')} className={styles.scrollButton}>다음</button>
            </div>
        </div>
    );
};

export default RecentProducts;
