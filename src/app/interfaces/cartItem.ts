import { ProductData } from "./productData";
import { User } from "./user";

export interface CartItem extends ProductData {
    id: string;
    quantita: number;
    user?: User;
}