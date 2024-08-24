// context/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Item {
  name: string;
  price: number;
  imgUrl: string;
  type: string;
  quantity: number;
}

interface CartContextType {
  cartItems: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Item[]>([]);

  const addToCart = (item: Item) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === item.name);

    if (existingItemIndex >= 0) {
      // If item already exists, update the quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedCart);
    } else {
      // Otherwise, add the new item to the cart
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const updateCartItem = (index: number, quantity: number) => {
    const updatedCart = [...cartItems];
    if (quantity > 0) {
      updatedCart[index].quantity = quantity;
      setCartItems(updatedCart);
    } else {
      // Remove item if quantity is set to 0
      removeFromCart(index);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem, clearCart }}>
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
