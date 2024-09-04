export default interface Coupon {
    id: number,
    couponId: number,
    couponName: string,
    discount: number,
    minimumOrderAmount: number,
    issueDate: Date,
    validUntil: Date
}