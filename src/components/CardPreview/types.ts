export type TCardPreviewProps = { 
    card: {
        photo_url?: string;
        shortDesc?: string;
        price_currency?: number;
        price_points?: number;
        percent_discount?: number;
        rating?: number;
        title?: string;
        comments?: number;
    }  
}