"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getOrderOption, type Customization } from "@/lib/order";

type OrderSelection = {
  product: string;
  quantity: number;
  customization: Customization | "";
};

type OrderContextValue = OrderSelection & {
  setProduct: (product: string) => void;
  setQuantity: (quantity: number) => void;
  setCustomization: (customization: Customization) => void;
  /** Preselecciona un producto o pack (desde cualquier botón de compra). */
  select: (product: string, quantity?: number) => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

/**
 * Comparte la selección de producto entre los botones de compra de la página
 * y el formulario de pedido, para que llegue ya rellenado.
 */
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<OrderSelection>({
    product: "",
    quantity: 1,
    customization: "",
  });

  const setProduct = useCallback((product: string) => {
    setSelection((prev) => {
      const option = getOrderOption(product);
      return {
        product,
        quantity: option ? Math.max(prev.quantity, option.minQuantity) : prev.quantity,
        customization: option?.customization ?? prev.customization,
      };
    });
  }, []);

  const select = useCallback((product: string, quantity?: number) => {
    const option = getOrderOption(product);
    setSelection((prev) => ({
      product,
      quantity: quantity ?? option?.minQuantity ?? 1,
      customization: option?.customization ?? prev.customization,
    }));
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    setSelection((prev) => ({ ...prev, quantity }));
  }, []);

  const setCustomization = useCallback((customization: Customization) => {
    setSelection((prev) => ({ ...prev, customization }));
  }, []);

  const value = useMemo(
    () => ({ ...selection, setProduct, setQuantity, setCustomization, select }),
    [selection, setProduct, setQuantity, setCustomization, select],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder debe usarse dentro de <OrderProvider>");
  return ctx;
}
