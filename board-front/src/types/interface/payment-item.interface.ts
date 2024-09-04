import Cart from "./cart-item.interface";

export default interface PaymentItem extends Cart {
    isReview: boolean
}