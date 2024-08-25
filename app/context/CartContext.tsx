import React, { createContext, useState, useContext, ReactNode } from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system"; // Import FileSystem to work with files

const FILEDIRECTORY = "data/";
const FILENAME = "savedCartsData.json";

interface Item {
  name: string;
  price: number;
  imgUrl: string;
  type: string;
  quantity: number;
}

interface SavedCart {
  items: Item[];
  title: string;
}

interface CartContextType {
  cartItems: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, quantity: number) => void;
  clearCart: () => void;
  saveCart: (title: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<Item[]>([]);

  const addToCart = (item: Item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.name === item.name
    );

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

  const saveCart = async (cartName: string) => {
    const fileUri = FILEDIRECTORY + FILENAME;
    try {
      const cartId = new Date().getTime().toString(); // Generate a unique ID based on the current timestamp
      const newCart = { id: cartId, name: cartName, items: cartItems };

      if (Platform.OS === 'web') {
        // On web, use localStorage
        const existingData = JSON.parse(localStorage.getItem(FILENAME) || '[]');
        const updatedData = [...existingData, newCart];
        //LocalStorage stores in SQLite file in systems AppData
        console.log("New data: " + updatedData);
        localStorage.setItem(FILENAME, JSON.stringify(updatedData, null, 2));
        console.log('Cart data saved successfully on web.');
      } else {
        // On native platforms, use FileSystem
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        let existingData: any[] = [];

        if (fileInfo.exists) {
          const fileContents = await FileSystem.readAsStringAsync(fileUri);
          existingData = JSON.parse(fileContents);
        }

        const updatedData = [...existingData, newCart];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData, null, 2));
        console.log('Cart data saved successfully on native platform.');
      }
    } catch (error) {
      console.error('Failed to save cart data:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        saveCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
