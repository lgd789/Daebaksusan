import React from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Product } from 'types';
import styles from './ProductListComp.module.css';
import bestProductIcon from 'assets/bestProductIcon.png';

interface ProductListCompProps {
    product: Product;
    size: string;
    fontSize: string;
}

export const ProductListComp: React.FC<ProductListCompProps> = ({ product, size, fontSize }) => {
   

    const discountRate = Math.round((product.salePrice / product.regularPrice) * 100);

    return (
        <Link to={`/detail/${product.productId}`} className={styles.detailLink}>
            <div style={{
                '--card-size': size,
                '--card-font-size': fontSize,
            } as React.CSSProperties}
                className={styles.productInfoCard}
            >
                <div className={styles.productImgWrapper}>
                    {product.recommended && (
                        <img src={bestProductIcon} alt="추천 아이콘" className={styles.bestProductIcon} />
                    )}
                    <img src={product.imageUrl} alt={product.name}
                        style={{
                            '--card-size': size,
                            '--card-height': size,
                        } as React.CSSProperties}
                        className={styles.productImg}
                    />
                </div>
                <hr />
                <div className={styles.productInfo}>
                    <p className={styles.productTitle}>
                        {product.salePrice !== 0 && (
                            <span className={styles.discountRateBox}>{discountRate.toFixed(0)}%</span>
                        )}
                        {product.name}
                    </p>
                    <p className={styles.productSp}>{product.description}</p>
                    <div className={styles.productPrice}>
                        <p className={styles.productDiscount}>{(product.regularPrice - product.salePrice).toLocaleString()}원</p>
                        {product.salePrice !== 0 && (
                            <p className={styles.productPriceBefore}>{product.regularPrice.toLocaleString()}원</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
