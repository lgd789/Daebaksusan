import { Coupon } from "types";

export default interface PaymentAndOrderInfo {
    orderNumber: string;
    orderAt: number; // UNIX timestamp로 변경
    productName: string;
    name: string;
    postCode: string;
    address: string;
    phone: string;
    paymentAt: string; // ISO 8601 형식의 문자열로 변경
    paymentStatus: string;
    paymentMethod: string;
    amount: number;
    pgProvider: string;
    payerName: string;
    cardName: string;
    installmentMonths: number | null;
    bankName: string;
    cardNumber: string;
    vbankName: string;
    vbankNum: string;
    vbankHolder: string;
    vbanIssuedAt: number;
    bankNum: string;
    bankHolder: string;
    coupon: Coupon;
    points: number;
}