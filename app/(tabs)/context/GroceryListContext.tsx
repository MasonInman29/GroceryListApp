// app/context/GroceryListContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  count: number;
}

interface GroceryListContextType {
  items: GroceryItem[];
  setItems: React.Dispatch<React.SetStateAction<GroceryItem[]>>;
}

const GroceryListContext = createContext<GroceryListContextType | undefined>(undefined);

export const useGroceryList = () => {
  const context = useContext(GroceryListContext);
  if (!context) {
    throw new Error('useGroceryList must be used within a GroceryListProvider');
  }
  return context;
};

export const GroceryListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<GroceryItem[]>([]);

  return (
    <GroceryListContext.Provider value={{ items, setItems }}>
      {children}
    </GroceryListContext.Provider>
  );
};
