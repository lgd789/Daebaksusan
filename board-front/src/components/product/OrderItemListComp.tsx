import React from 'react';
import { Cart } from 'types';
import styles from './MyCartListComp.module.css';
import styles_m from './MyCartMobile.module.css';

interface OrderItemProps {
    orderItem: Cart;
}


export const OrderItemListComp: React.FC<OrderItemProps> = ({ orderItem }) => {
    const calculateItemTotal = (item: Cart) => {
        const product = item.cartItem.product;
        const quantity = item.cartItem.quantity;
        const boxCount = item.cartItem.boxCnt;
        const optionPrice = boxCount * item.cartItem.option!.addPrice;
        const shippingCost = boxCount * product.shippingCost;
        const itemPrice = (product.regularPrice - product.salePrice) * quantity;
        const totalPrice = itemPrice + optionPrice + shippingCost;
        return totalPrice.toLocaleString();
    };

    return (
        <div className={styles.myCartListComp}>
            <table>
                <colgroup>
                    <col width="30px"></col>
                    <col width="140px"></col>
                    <col></col>
                    <col width="150px"></col>
                    <col width="150px"></col>
                    <col width="150px"></col>
                </colgroup>
                <thead>
                    <tr>
                        <th data-label="칼럼명"></th>
                        <th data-label="이미지"></th>
                        <th data-label="주문 상품 정보">주문 상품 정보</th>
                        <th data-label="상품가격">상품가격</th>
                        <th data-label="수량" style={{ textAlign: 'center' }}>수량</th>
                        <th data-label="가격정보">가격정보</th>
                        <th data-label="합계">합계</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td data-label="칼럼명"></td>
                        <td className={styles.orderImg} data-label="이미지">
                            <img src={orderItem.cartItem.product.imageUrl} alt="사진" style={{ width: 140, height: 140 }} />
                        </td>
                        <td className={styles.orderName} data-label="주문 상품 정보">{orderItem.cartItem.product.name}</td>
                        <td className={styles.orderPrice} data-label="상품가격">{(orderItem.cartItem.product.regularPrice - orderItem.cartItem.product.salePrice).toLocaleString()}원</td>
                        <td className={styles.orderQuantity} data-label="수량">
                            <div className={styles.quantityContainer}>
                                {orderItem.cartItem.quantity}
                            </div>
                        </td>
                        <td data-label="가격정보" className={styles.priceInfo}>
                            <p>박스 개수: {orderItem.cartItem.boxCnt}</p>
                            <p>옵션 가격: {(orderItem.cartItem.boxCnt * orderItem.cartItem.option!.addPrice).toLocaleString()}원</p>
                            <p>배송비: {(orderItem.cartItem.boxCnt * orderItem.cartItem.product.shippingCost).toLocaleString()}원</p>
                        </td>
                        <td data-label="합계">
                            <p className={styles.orderTotal}>{calculateItemTotal(orderItem)}원</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className={styles_m.mobileContainer}>
                <div className="checkBox"></div>
                <div>
                    <img src={orderItem.cartItem.product.imageUrl} alt="사진" style={{ width: 100, height: 100, borderRadius: 10 }} />
                </div>
                <div className={styles_m.orderInfo}>
                    <div className={styles_m.orderName}>
                        {orderItem.cartItem.product.name}
                    </div>
                    <div className={styles_m.orderOption}>
                        옵션
                    </div>
                    <div className={styles_m.quantityContainer}>
                        수량: {orderItem.cartItem.quantity}
                    </div>
                    <div className={styles_m.orderTotal}>
                        <div className={styles_m.priceInfo}>
                            <p>박스 개수: {orderItem.cartItem.boxCnt}</p>
                            <p>옵션 가격: {(orderItem.cartItem.boxCnt * orderItem.cartItem.option!.addPrice).toLocaleString()}원</p>
                            <p>배송비: {(orderItem.cartItem.boxCnt * orderItem.cartItem.product.shippingCost).toLocaleString()}원</p>
                            <p className={styles_m.total}>합계 : {calculateItemTotal(orderItem)}원</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
