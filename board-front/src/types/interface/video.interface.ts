import Product from "./product-item.interface";

export default interface VideoItem {
    videoId: number;
    videoUrl: string;
    link: string;
    products: Product[]
}