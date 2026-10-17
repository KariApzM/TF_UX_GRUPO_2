import type { Price, Promotion } from "../types";
import { products } from "./products";
export const prices: Price[] = products.map(
  ({ id, regularPrice, massPrice }) => ({
    productId: id,
    regularPrice,
    massPrice,
  }),
);
export const promotions: Promotion[] = [
  {
    id: "promo1",
    name: "Bajón de Precios Mass · Octubre 2024",
    start: "2024-10-01",
    end: "2024-10-31",
    enabled: true,
  },
];
