import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import { Cart } from 'types';

interface CartContextType {
    cartItems: Cart[];
    setCartItems: Dispatch<SetStateAction<Cart[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<Cart[]>([]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
