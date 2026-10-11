"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ProductId } from "@/data/content";
import { getOrderOption, type Customization } from "@/lib/order";

type OrderSelection = {
  product: string;
  quantity: number;
  customization: Customization | "";
  /** "calculadora" si el formulario se ha rellenado desde la calculadora (y no se ha cambiado después). */
  source: "calculadora" | null;
};

export type CalculatorSelection = { product: ProductId; quantity: number };

type OrderContextValue = OrderSelection & {
  setProduct: (product: string) => void;
  setQuantity: (quantity: number) => void;
  setCustomization: (customization: Customization) => void;
  /** Preselecciona un producto o pack (desde cualquier botón de compra). */
  select: (product: string, quantity?: number, source?: OrderSelection["source"]) => void;
  /** Última selección hecha en la calculadora (null si no se ha usado). */
  calculator: CalculatorSelection | null;
  setCalculator: (selection: CalculatorSelection) => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

/**
 * Comparte la selección de producto entre los botones de compra, la
 * calculadora, el botón de WhatsApp y el formulario de pedido.
 */
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<OrderSelection>({
    product: "",
    quantity: 1,
    customization: "",
    source: null,
  });
  const [calculator, setCalculator] = useState<CalculatorSelection | null>(null);

  const setProduct = useCallback((product: string) => {
    setSelection((prev) => {
      const option = getOrderOption(product);
      return {
        product,
        quantity: option ? Math.max(prev.quantity, option.minQuantity) : prev.quantity,
        customization: option?.customization ?? prev.customization,
        source: null,
      };
    });
  }, []);

  const select = useCallback((product: string, quantity?: number, source: OrderSelection["source"] = null) => {
    const option = getOrderOption(product);
    setSelection((prev) => ({
      product,
      quantity: quantity ?? option?.minQuantity ?? 1,
      customization: option?.customization ?? prev.customization,
      source,
    }));
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    setSelection((prev) => ({ ...prev, quantity, source: null }));
  }, []);

  const setCustomization = useCallback((customization: Customization) => {
    setSelection((prev) => ({ ...prev, customization }));
  }, []);

  const value = useMemo(
    () => ({ ...selection, setProduct, setQuantity, setCustomization, select, calculator, setCalculator }),
    [selection, setProduct, setQuantity, setCustomization, select, calculator],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder debe usarse dentro de <OrderProvider>");
  return ctx;
}
