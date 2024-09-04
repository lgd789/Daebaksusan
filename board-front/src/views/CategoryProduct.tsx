import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Product } from 'types';
import { ProductListComp } from '../components/product/ProductListComp';
import styles from './CategoryProduct.module.css';
import { useParams } from 'react-router-dom';

interface CategoryProductProp {
    path: string;
}

export const CategoryProduct: React.FC<CategoryProductProp> = ({ path }) => {
    const { mainCategory, subCategory } = useParams<{ mainCategory: string, subCategory: string }>();

    const [products, setProducts] = useState<Product[]>([]);
    const [colums, setColums] = useState<number>(4);
    const [rows, setRows] = useState<number>(4);
    const [visibleCount, setVisibleCount] = useState<number>(colums * rows);
    const [sortBy, setSortBy] = useState<string>();

    let pageTitle;

    switch (path) {
        case 'best':
            pageTitle = '인기 상품';
            break;
        case 'new':
            pageTitle = '최신 상품';
            break;
        case 'recommend':
            pageTitle = '추천 상품';
            break;
        case 'timeDeal':
            pageTitle = '특가 상품';
            break;
        case 'all':
            pageTitle = '모든 상품';
            break;
        case 'categoryProducts/category':
            pageTitle = mainCategory;
            break;
        case 'categoryProducts/category/sub':
            pageTitle = `${mainCategory} / ${subCategory}`;
            break;
        case 'search':
            pageTitle = `'${mainCategory}'의 검색 결과 입니다.`;
            break;
        default:
            pageTitle = '';
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = '';
                switch (path) {
                    case 'categoryProducts/category':
                        url = `${process.env.REACT_APP_API_URL}/product/category/${mainCategory}`;
                        break;
                    case 'categoryProducts/category/sub':
                        url = `${process.env.REACT_APP_API_URL}/product/category/sub/${subCategory}`;
                        break;
                    case 'search':
                        url = `${process.env.REACT_APP_API_URL}/product/search?query=${mainCategory}`;
                        break;
                    default:
                        url = `${process.env.REACT_APP_API_URL}/product/${path}`;
                }

                const response = await axios.get<Product[]>(url);
				console.log(path, subCategory, response.data);
                setProducts(response.data);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, [path, mainCategory, subCategory]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 480) {
                setVisibleCount(2 * rows);
                setColums(2);
            } else if (window.innerWidth < 768) {
                setVisibleCount(3 * rows);
                setColums(3);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(3 * rows);
                setColums(3);
            } else {
                setColums(4);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [rows]);

    const getCurrentPageData = () => {
        return products.slice(0, visibleCount);
    };

    const handleMoreClick = () => {
        setVisibleCount(prevCount => Math.min(prevCount + (rows * colums), products.length));
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const sortedProducts = () => {
        switch (sortBy) {
			case 'categories':
				// 카테고리 정보가 있는 경우
				if (products.length > 0 && products[0].category !== undefined) {
					return [...products].sort((a, b) => a.category - b.category);
				} else {
					// 카테고리 정보가 없는 경우 원래 순서 그대로 반환
					return products;
				}
            case 'name':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return [...products].sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());
            case 'price':
                return [...products].sort((a, b) => a.regularPrice - b.regularPrice);
            case 'priceDesc':
                return [...products].sort((a, b) => b.regularPrice - a.regularPrice);
            default:
                return products;
        }
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.productListContainer}>
                <div className={styles.productListHeader}>
                    <div className={styles.productListTitle}>{pageTitle}</div>
                    <select value={sortBy} onChange={handleSortChange} className={styles.sortSelect}>
                        <option value="newest">최신순</option>
                        <option value="categories">카테고리순</option>
                        <option value="price">낮은가격순</option>
                        <option value="priceDesc">높은가격순</option>
                    </select>
                </div>
                <div>
					{products && 
						<ul className={styles.productList}>
							{sortedProducts().slice(0, visibleCount).map((product: Product, index: number) => (
								<li key={product.productId} className={index >= visibleCount - colums && visibleCount < products.length ? `${styles.blurEffect}` : ''}>
									<ProductListComp product={product} size='255px' fontSize='7px' />
								</li>
							))}
						</ul>
					}
                </div>
            </div>
            {visibleCount < products.length && (
                <button className={styles.moreButtonContainer} onClick={handleMoreClick}>더 보기</button>
            )}
        </div>
    );
}
