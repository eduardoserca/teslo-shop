import { createContext } from 'react';
import { IAddress, ICartProduct } from '@/interfaces';


interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    
    shippingAddress?: IAddress;

    //Method
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (address: IAddress) => void;

    //Orders
    createOrder: () => Promise<{ hasError: boolean; message: string; }>;

}

export const CartContext = createContext({} as ContextProps);