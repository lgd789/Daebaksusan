import { useEffect, useMemo, useState } from 'react'
import styles from './MyCart.module.css'
import { Cart } from 'types';
import { MyCartListComp } from 'components/product/MyCartListComp';
import { OrderFlow } from 'components/OrderFlow';
import { Link } from 'react-router-dom';
import { fetchCartItemsDelete, fetchCartItems } from 'utils/cartUtils';
import { useAuthContext } from 'hook/AuthProvider';
import { useCart } from 'hook/CartProvider';

export const MyCart = () => {
    const { cartItems, setCartItems } = useCart();
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const [selectAll, setSelectAll] = useState(true);

    const handleQuantityChange = (id: number, quantity: number, boxCnt: number) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.cartId === id) {
                    return {
                        ...item,
                        cartItem: {
                            ...item.cartItem,
                            quantity: quantity,
                            boxCnt: boxCnt,
                        }
                    };
                } else {
                    return item;
                }
            })
        );
        console.log(cartItems)
    };

    const handleSelectedChange = (id: number, isSelected: boolean) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartId === id ? { ...item, isSelected } : item
            )
        );
    };

    const toggleSelectAll = () => {
        const newCartItems = cartItems.map(item => ({
            ...item,
            isSelected: !selectAll, // 전체 선택 상태를 반전시킵니다.
        }));
        setCartItems(newCartItems);
        setSelectAll(!selectAll);
    };

    const deleteSelectedItems = async () => {
        fetchCartItemsDelete(cartItems, setCartItems, setIsLoggedIn)
    };


    const productCostTotal = () => {
        return cartItems
            .filter(item => item.isSelected)
            .reduce((total, item) => {
                const itemPrice = (item.cartItem.product.regularPrice - item.cartItem.product.salePrice) * item.cartItem.quantity;
                const itemOptionCost = item.cartItem.option!.addPrice * item.cartItem.boxCnt;
                console.log(item)
                return total + itemPrice + itemOptionCost; // 각 항목의 상품 가격과 배송비를 합산
            }, 0);
    };


    const shippingCostTotal = () => {
        return cartItems
            .filter(item => item.isSelected)
            .reduce((total, item) => {
                const itemShippingCost = item.cartItem.product.shippingCost * item.cartItem.boxCnt;
                return total + itemShippingCost; // 각 항목의 상품 가격과 배송비를 합산
            }, 0);
    };

    const productTotal = productCostTotal();
    const shippingTotal = shippingCostTotal();
    const orderTotal = productTotal + shippingTotal;
    const filteredCartItems = cartItems.filter(item => item.isSelected === true);

    return (
        <div className={styles.myCartContainer}>
            <OrderFlow currentStep={1} />
            <div className={styles.selectAllContainer}>
                <label>
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                    />
                    전체 선택
                </label>
                <button onClick={deleteSelectedItems} className={styles.deleteSelectedBtn}>선택상품 삭제</button>

            </div>

            <ul className={styles.cartItemList}>
                {cartItems.map((cartItem: Cart) => (
                    <li key={cartItem.cartId}>
                        <MyCartListComp cartItem={cartItem} selectAll={selectAll} onQuantityChange={handleQuantityChange} onSelectedChange={handleSelectedChange} />
                    </li>
                ))}
            </ul>

            <div className={styles.orderContainer}>
                <ul>
                    <li>
                        <div className={styles.priceTitle}>총 상품 합계 금액</div>
                        <div className={styles.price}>{productTotal.toLocaleString()}원</div>
                    </li>

                    <li>
                        <div className={styles.op}>+</div>
                    </li>

                    <li>
                        <div className={styles.priceTitle}>배송비 합계 금액</div>
                        <div className={styles.price}>{shippingTotal.toLocaleString()}</div>
                    </li>

                    <li>
                        <div className={styles.op}>=</div>
                    </li>

                    <li>
                        <div className={styles.priceTitle}>총 주문 합계 금액</div>
                        <div className={styles.price}>{orderTotal.toLocaleString()}원</div>
                    </li>
                </ul>

                {filteredCartItems.length > 0 ? (
                    <Link to="/order" state={{ cartItems: filteredCartItems }}>
                        <div className={styles.orderBtn}>
                            선택상품 주문하기
                        </div>
                    </Link>
                ) : (
                    <div className={styles.orderBtn}>
                        선택된 상품이 없습니다.
                    </div>
                )}

            </div>
        </div>
    )
}
