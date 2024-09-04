import {Coupon, PaymentItem } from "types";


export default interface PaymentDetail {
    orderNumber: string,
    orderDate: Date,
    orderItems: PaymentItem[],
    coupon: Coupon,
    points: number,
    status: string,
}