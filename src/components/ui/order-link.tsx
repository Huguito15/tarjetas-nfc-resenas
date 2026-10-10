"use client";

import { useOrder } from "@/components/providers/order-provider";

type OrderLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  product: string;
  quantity?: number;
};

/** Enlace de compra: lleva al formulario con el producto ya seleccionado. */
export function OrderLink({ product, quantity, onClick, ...props }: OrderLinkProps) {
  const { select } = useOrder();
  return (
    <a
      href="#contacto"
      onClick={(event) => {
        select(product, quantity);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
