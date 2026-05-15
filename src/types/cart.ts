export type ProductConfiguration = {
  size?: string;
  color?: string;
  beltColor?: string;
  weight?: string;
  fit?: string;
  closure?: 'velcro' | 'cordon';
  hand?: 'diestro' | 'zurdo';
};

export type ProductCustomization = {
  frontText?: string;
  backText?: string;
  flag?: string;
  font?: string;
  embroideryNotes?: string;
  customImageUrl?: string;
};

export type CartItem = {
  /** ID único del item en el carrito (no del producto) */
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  category: string;
  basePriceCents: number;
  variants: ProductConfiguration;
  customization: ProductCustomization;
  quantity: number;
  addedAt: number;
};
