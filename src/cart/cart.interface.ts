export interface CartItem {
    id: number;
    name: string;
    quantity: number;
}

export interface Cart {
    id: number;
    items: CartItem[];
}

/*export interface ConfirmOrder {
    id: number;
    cart: Cart;
}*/