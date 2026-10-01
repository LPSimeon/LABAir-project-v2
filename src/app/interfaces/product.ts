import { productImage } from "./productImage";

export interface Product {
    id: number;
    nome: string;
    categoria: string;
    prezzo: number;

    taglie_disponibili: string[];
    colori_disponibili: string[];

    descrizione: string;
    immagine_cover: string;
    immagini_scarpa: productImage[];

    nuovi_arrivi?: boolean;
    best_seller: number;
}