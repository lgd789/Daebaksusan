import { Product } from "types";
import Option from "./option-item.interface";

export default interface CartItem {
    product: Product,
    option?: Option | null;
    quantity: number,
    boxCnt: number,
};