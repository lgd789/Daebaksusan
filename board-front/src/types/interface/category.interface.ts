import { SubCategory } from "types";

export default interface Category {
    id: number;
    name: string;
    imageUrl: string;
    subcategories: SubCategory[];
}