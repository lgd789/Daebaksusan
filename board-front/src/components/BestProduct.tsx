import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import styles from './BestProduct.module.css';
import leftArrow from '../assets/leftArrow.png';
import rightArrow from '../assets/rightArrow.png';
import { Product } from 'types';
import { ProductListComp } from 'components/product/ProductListComp';
import { Link } from 'react-router-dom';
import { CategoryMenuBar } from 'layouts/CategoryMenuBar';
import ImageGalleryComp from './ImageGallery/ImageGalleryComp';

interface CategoryProductProp {
    category: string;
}

export const BestProduct: React.FC<CategoryProductProp> = ({ category }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    let pageTitle;

    switch (category) {
        case 'best':
            pageTitle = '🔥 인기 상품';
            break;
        case 'new':
            pageTitle = '🔔 최신 상품';
            break;
        case 'recommendedProducts':
            pageTitle = '✨🎉 추천 상품';
            break;
        case 'all':
            pageTitle = '🐟 모든 상품';
            break;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${process.env.REACT_APP_API_URL}/product/${category}`;
                const response = await axios.get<Product[]>(url);
                setProducts(response.data.slice(0, 10));
            } catch (error) {
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, [category]);


    return (
        products.length > 0 ? (
            <div className={styles.homeContainer}>
                <div className={styles.productListContainer}>
                    <div className={styles.titleContainer}>
                        <div className={styles.productListTitleContainer}>
                            <Link to={category} state={{ category: null }} className={styles.productListTitle}>
                                {pageTitle}
                            </Link>
                            {/* <CategoryMenuBar onCategoryChange={handleCategoryChange} /> */}
                        </div>

                        <Link to={category} state={{ category: null }} className={styles.moreButton}>
                            더보기
                        </Link>
                    </div>
                    {/* <div className={styles.productList}>
                        <button className={styles.moveButton} onClick={() => scrollLeft()}>
                            <img width="35" height="35" src={leftArrow} />
                        </button>
                        <div className={styles.wrapScorll} ref={scrollRef}>
                            <ul>
                                {products.map((product: Product) => (
                                    <li key={product.productId}>
                                        <ProductListComp product={product} size="275px" fontSize="7px" />
                                    </li>
                                ))}
                                
                            </ul>
                        </div>

                        <button className={styles.moveButton} onClick={() => scrollRight()}>
                            <img width="35" height="35" src={rightArrow} />
                        </button>
                    </div> */}
                    <div className='border-t-2 border-blue-700 p-3'>
                        <ImageGalleryComp items={products} size="275px" fontSize="7px" component={ProductListComp}/>
                    </div>
                </div>
            </div>
        ) : null
    );
};
