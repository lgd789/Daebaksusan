import ResponseCode from "./enum/response-code.enum";
import SeafoodList from "./interface/seafood-item.interface";
import AddressData from "./interface/address-item.interface";
import AddressObj from "./interface/addressObject-item.interface";
import InputErrors from "./interface/OrderInputError.interface";
import OrdererInfo from "./interface/orderInfo.interface";
import Option from "./interface/option-item.interface";
import Category from "./interface/category.interface";
import SubCategory from "./interface/subCategory.interface";
import Cart from "./interface/cart-item.interface";
import CartItem from "./interface/cart.interface";
import Product from "./interface/product-item.interface";
import CartInput from "./interface/cartInput.interface";
import { ReviewState } from "./interface/review.interface";
import PaymentDetail from "./interface/paymentDetail.interface";
import PaymentItem from "./interface/payment-item.interface";
import Coupon from "./interface/coupon.interface";
import PaymentAndOrderInfo from "./interface/pymentAndOrderInfo.interface";
import ReviewStats from "./interface/reviewStats.interface";
import { PointsDetails } from "./interface/pointsDetail.interface";
import Member from "./interface/member.interface";
import { QnA } from "./interface/qna.interface";
import CarouselItem from "./interface/carousel.interface";
import VideoItem from "./interface/video.interface";


export type{
    ResponseCode,
    SeafoodList,
    Product,
    AddressObj,
    AddressData,
    InputErrors,
    OrdererInfo,
    Option,
    Category,
    SubCategory,
    Cart,
    CartItem,
    CartInput,
    PaymentDetail,
    ReviewState,
    PaymentItem,
    Coupon,
    PaymentAndOrderInfo,
    ReviewStats,
    PointsDetails,
    Member,
    QnA,
    CarouselItem,
    VideoItem,
}