import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

interface ProductContextType {
  triggerRefresh: () => void;
  registerRefreshCallback: (callback: () => void) => () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

interface ProductProviderProps {
  children: React.ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const refreshCallbacksRef = useRef<Set<() => void>>(new Set());

  const registerRefreshCallback = useCallback((callback: () => void) => {
    refreshCallbacksRef.current.add(callback);

    // Return cleanup function
    return () => {
      refreshCallbacksRef.current.delete(callback);
    };
  }, []);

  const triggerRefresh = useCallback(() => {
    refreshCallbacksRef.current.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in refresh callback:", error);
      }
    });
  }, []);

  return (
    <ProductContext.Provider
      value={{
        triggerRefresh,
        registerRefreshCallback,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
