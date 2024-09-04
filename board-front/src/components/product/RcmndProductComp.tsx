import { Product } from 'types';
import styles from './RcmndProductComp.module.css';
import tag from 'assets/bestProductIcon.png';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

interface RcmndProductCompProps {
    product: Product;
    imgSize_w_per: number;
    imgSize_h_px: string;
    fontSize: string;
    radius?: number;
    shadow?: boolean;
}

export const RcmndProductComp: React.FC<RcmndProductCompProps> = ({ product, imgSize_w_per, imgSize_h_px, fontSize, radius = 3, shadow = false }) => {
    return (
        <Link to={`/detail/${product.productId}`} className={styles.detailLink}>
            <div className={`${styles.container} ${shadow ? 'shadow-md' : ''}`}
                style={{
                    '--border-radius': `${radius}%`
                } as React.CSSProperties}>
                <div className={styles.imgContainer}
                    style={{
                        '--w-size': `${imgSize_w_per}%`,
                        '--h-size': `${imgSize_h_px}`,

                    } as React.CSSProperties}>
                    <img
                        src={product.imageUrl}
                        alt='추천 상품'
                        className={styles.rcmdImg}
                        style={{
                            '--w-size': `${imgSize_w_per}%`,
                            '--h-size': `${imgSize_h_px}`,
                            '--border-radius': `${radius}%`
                        } as React.CSSProperties} />
                    {product.recommended &&
                        <img src={tag} alt='추천 상품' className={styles.rcmdTag} />
                    }
                </div>
                <div className={styles.rcmdInfo}
                    style={{
                        '--w-size': `${100 - imgSize_w_per}%`,
                        '--font-size': `${fontSize}`,
                    } as React.CSSProperties}>
                    <p className={styles.title}> {product.name} </p>
                    {product.salePrice !== 0 && (
                        <p className={styles.beforeprice}> {product.regularPrice.toLocaleString()}원 </p>
                    )}
                    <p className={styles.afterprice}>  {(product.regularPrice - product.salePrice).toLocaleString()}원 </p>
                </div>
            </div>
        </Link>
    );
};
