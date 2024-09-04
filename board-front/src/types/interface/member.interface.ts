import { Coupon } from "types";

export default interface Member {
    memberId: number,
    id: string,
    password: string,
    name: string,
    phone: string,
    email: string,
    postalCode: string,
    address: string,
    detailAddress: string,
    type: string,
    role: string,
    coupons: Coupon[],
    points: number,
    paymentStatusCounts?: PaymentStatusCounts;
};

export interface PaymentStatusCounts {
    paidCount: number;
    readyCount: number;
    failedCount: number;
    cancelledCount: number;
}