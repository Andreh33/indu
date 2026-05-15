import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/* ============================================================
 * Helpers
 * ============================================================ */
const uuid = (name: string) =>
  text(name)
    .$defaultFn(() => crypto.randomUUID())
    .notNull();

const createdAt = (name = 'created_at') =>
  integer(name, { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date());

const updatedAt = (name = 'updated_at') =>
  integer(name, { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date());

/* ============================================================
 * Categorías
 * ============================================================ */
export const categories = sqliteTable('categories', {
  id: uuid('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/* ============================================================
 * Productos
 * ============================================================ */
export type ProductStatus = 'draft' | 'published' | 'archived';

export type ColorOption = { name: string; hex: string };
export type CustomizationConfig = {
  frontText?: { enabled: boolean; maxLength: number };
  backText?: { enabled: boolean; maxLength: number };
  flag?: { enabled: boolean; options: string[] };
  font?: { enabled: boolean; options: string[] };
  customImage?: { enabled: boolean };
  embroideryNotes?: { enabled: boolean };
};
export type ProductDetails = {
  sizing?: string;
  materials?: string;
  care?: string;
  customization?: string;
};

export const products = sqliteTable('products', {
  id: uuid('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  type: text('type'),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  basePriceCents: integer('base_price_cents').notNull(),
  status: text('status').$type<ProductStatus>().notNull().default('draft'),
  displayOrder: integer('display_order').notNull().default(0),
  availableSizes: text('available_sizes', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  availableColors: text('available_colors', { mode: 'json' }).$type<ColorOption[]>().notNull().default(sql`'[]'`),
  availableWeights: text('available_weights', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  availableFits: text('available_fits', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  customizationConfig: text('customization_config', { mode: 'json' }).$type<CustomizationConfig>().notNull().default(sql`'{}'`),
  details: text('details', { mode: 'json' }).$type<ProductDetails>().notNull().default(sql`'{}'`),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ogImageUrl: text('og_image_url'),
  relatedProductIds: text('related_product_ids', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/* ============================================================
 * Variantes de producto (SKU + stock + precio override).
 * Una variante = UNA combinación concreta (talla L · color rojo · peso 12oz).
 * Stock null = stock infinito. priceCents null = usa basePriceCents del producto.
 * Si el producto no tiene variantes, se trata como stock infinito (legacy mode).
 * ============================================================ */
export const productVariants = sqliteTable('product_variants', {
  id: uuid('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull(),
  size: text('size'),
  color: text('color'),
  weight: text('weight'),
  stockQuantity: integer('stock_quantity'),
  priceCents: integer('price_cents'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type ProductVariant = typeof productVariants.$inferSelect;

/* ============================================================
 * Imágenes de producto
 * ============================================================ */
export const productImages = sqliteTable('product_images', {
  id: uuid('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  cloudinaryPublicId: text('cloudinary_public_id'),
  alt: text('alt'),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: createdAt(),
});

/* ============================================================
 * Trabajos (galería)
 * ============================================================ */
export type WorkType = 'gym' | 'fighter' | 'event' | 'brand';
export type WorkQuote = { text: string; author: string; role?: string };

export const works = sqliteTable('works', {
  id: uuid('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  clientName: text('client_name').notNull(),
  city: text('city'),
  year: integer('year'),
  type: text('type').$type<WorkType>().notNull(),
  units: integer('units').notNull().default(1),
  brief: text('brief'),
  process: text('process'),
  quote: text('quote', { mode: 'json' }).$type<WorkQuote | null>(),
  relatedProductIds: text('related_product_ids', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
  displayOrder: integer('display_order').notNull().default(0),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type WorkImageType = 'hero' | 'process' | 'result';

export const workImages = sqliteTable('work_images', {
  id: uuid('id').primaryKey(),
  workId: text('work_id')
    .notNull()
    .references(() => works.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  cloudinaryPublicId: text('cloudinary_public_id'),
  alt: text('alt'),
  caption: text('caption'),
  type: text('type').$type<WorkImageType>().notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: createdAt(),
});

/* ============================================================
 * Log de intentos de pedido (RGPD: IP truncada, autopurga 90d)
 * ============================================================ */
export const orderAttempts = sqliteTable('order_attempts', {
  id: uuid('id').primaryKey(),
  items: text('items', { mode: 'json' }).notNull(),
  totalCents: integer('total_cents').notNull(),
  ipTruncated: text('ip_truncated'),
  userAgent: text('user_agent'),
  createdAt: createdAt(),
});

/* ============================================================
 * Instagram items (manual fallback o feed real)
 * ============================================================ */
export const instagramItems = sqliteTable('instagram_items', {
  id: uuid('id').primaryKey(),
  igId: text('ig_id').unique(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  permalink: text('permalink'),
  displayOrder: integer('display_order').notNull().default(0),
  isManual: integer('is_manual', { mode: 'boolean' }).notNull().default(false),
  createdAt: createdAt(),
});

/* ============================================================
 * Settings (key-value)
 * ============================================================ */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' }).notNull(),
  updatedAt: updatedAt(),
  updatedBy: text('updated_by'),
});

/* ============================================================
 * Usuarios admin (auth se cierra en Fase 4)
 * ============================================================ */
export const adminUsers = sqliteTable('admin_users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name'),
  firstLogin: integer('first_login', { mode: 'boolean' }).notNull().default(true),
  createdAt: createdAt(),
});

/* ============================================================
 * Blog posts (diario)
 * ============================================================ */
export type PostStatus = 'draft' | 'published';

export const posts = sqliteTable('posts', {
  id: uuid('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(), // markdown
  coverUrl: text('cover_url'),
  authorName: text('author_name').default('Industrial Fighters'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  status: text('status').$type<PostStatus>().notNull().default('draft'),
  publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type Post = typeof posts.$inferSelect;

export const adminAudit = sqliteTable('admin_audit', {
  id: uuid('id').primaryKey(),
  actorId: text('actor_id').references(() => adminUsers.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: createdAt(),
});

/* ============================================================
 * Exports tipados
 * ============================================================ */
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type Work = typeof works.$inferSelect;
export type WorkImage = typeof workImages.$inferSelect;
export type OrderAttempt = typeof orderAttempts.$inferSelect;
export type InstagramItem = typeof instagramItems.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
