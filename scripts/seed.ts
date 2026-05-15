/**
 * Seed inicial: categorías, productos, imágenes, trabajos, settings.
 *
 * Uso: pnpm db:seed
 *
 * Idempotente: borra y reinserta. NO usar en producción tras el lanzamiento.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/lib/db/schema';

loadEnv({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error('TURSO_DATABASE_URL missing');

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

async function main() {
  console.log('🌱 Seeding Industrial Fighters DB...');

  console.log('  · wiping existing rows');
  await db.delete(schema.workImages);
  await db.delete(schema.works);
  await db.delete(schema.productImages);
  await db.delete(schema.products);
  await db.delete(schema.categories);
  await db.delete(schema.settings);

  // ---------- Categorías ----------
  console.log('  · inserting categories');
  const muayThaiId = crypto.randomUUID();
  const mmaId = crypto.randomUUID();
  const boxeoId = crypto.randomUUID();
  const camisetasId = crypto.randomUUID();
  const bucalesId = crypto.randomUUID();

  await db.insert(schema.categories).values([
    { id: muayThaiId, slug: 'muay-thai', name: 'Muay Thai', displayOrder: 1 },
    { id: mmaId, slug: 'mma', name: 'MMA', displayOrder: 2 },
    { id: boxeoId, slug: 'boxeo', name: 'Boxeo', displayOrder: 3 },
    { id: camisetasId, slug: 'camisetas', name: 'Camisetas', displayOrder: 4 },
    { id: bucalesId, slug: 'bucales', name: 'Bucales', displayOrder: 5 },
  ]);

  // ---------- Productos ----------
  console.log('  · inserting products');

  // URLs absolutas — Pexels para boxing/MMA atmosférico real, Unsplash como complemento.
  // Verificadas visualmente (HEAD 200 + thumbnail revisado).
  const PEXELS = (id: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?w=900&auto=compress&cs=tinysrgb`;
  const UNSPLASH = (id: string) =>
    `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;

  // Pool de fotos curadas (todas verificadas visualmente).
  const PHOTO_SETS: Record<string, [string, string]> = {
    'shorts-muay-thai-rojo-bandera': [
      PEXELS(4761779), // fighter ring oscuro, atmosférico
      UNSPLASH('photo-1599058945522-28d584b6f0ff'), // muay thai fighter rojo
    ],
    'shorts-muay-thai-negro-mate': [
      PEXELS(7991668), // Muay Thai patada saco
      PEXELS(4761783), // vendas boxeo close-up
    ],
    'shorts-mma-fight-grit': [
      PEXELS(7045617), // sparring estudio
      PEXELS(6253307), // judo/karate gi
    ],
    'guantes-boxeo-12oz-rojo': [
      UNSPLASH('photo-1622279457486-62dcc4a431d6'), // guantes boxeo rojo
      PEXELS(4761792), // fighter manos guantes dorados/negros
    ],
    'guantes-boxeo-14oz-blanco-hueso': [
      PEXELS(4761669), // fighter torso tatuado con guantes
      UNSPLASH('photo-1591117207239-788bf8de6c3b'), // guante detalle
    ],
    'guantes-muay-thai-10oz-negro': [
      UNSPLASH('photo-1591769225440-811ad7d6eab3'), // guantes negros saco
      PEXELS(4761792), // fighter manos
    ],
    'rashguard-mma-grit': [
      PEXELS(4761669), // fighter torso
      PEXELS(7045617), // sparring
    ],
    'camiseta-gym-block': [
      PEXELS(4761779), // fighter ring
      PEXELS(4761783), // vendas
    ],
    'camiseta-team-noche-fight': [
      PEXELS(7991668), // patada saco
      PEXELS(4761779), // fighter ring
    ],
    'hoodie-industrial-heavyweight': [
      PEXELS(4761669), // fighter torso
      PEXELS(4761779), // fighter ring
    ],
    'bucal-termoformable-rojo-negro': [
      UNSPLASH('photo-1607627000458-210e8d2bdb1d'), // boxeador puño
      UNSPLASH('photo-1622279457486-62dcc4a431d6'), // guante rojo
    ],
    'bucal-junior-azul-blanco': [
      PEXELS(4761783), // vendas close-up
      UNSPLASH('photo-1607627000458-210e8d2bdb1d'),
    ],
  };

  const productsData = [
    {
      id: crypto.randomUUID(),
      slug: 'shorts-muay-thai-rojo-bandera',
      name: 'Shorts Muay Thai Rojo Bandera',
      categoryId: muayThaiId,
      type: 'shorts',
      shortDescription: 'Shorts tailandeses cortados a mano. Tejido satinado, cinturón ancho.',
      longDescription:
        'Los shorts que llevarías a un combate sabiendo que aguantan. Tejido satinado fluido, cinturón ancho con bordado central y banda lateral firmada.',
      basePriceCents: 8500,
      status: 'published' as const,
      displayOrder: 1,
      availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      availableColors: [
        { name: 'Rojo bandera', hex: '#ED2939' },
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Azul royal', hex: '#1F3A8A' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 12 },
        backText: { enabled: true, maxLength: 12 },
        flag: {
          enabled: true,
          options: ['España', 'Tailandia', 'Brasil', 'USA', 'México', 'Ninguna'],
        },
        font: { enabled: true, options: ['Industrial', 'Brush', 'Block', 'Script'] },
      },
      details: {
        sizing: 'Talla estándar Muay Thai. Si dudas, sube una talla.',
        materials: 'Satén 100% poliéster. Cintura con elástico interior y cordón.',
        care: 'Lavado a mano o programa delicado a 30°. No usar secadora.',
        customization:
          'Bordado del nombre incluido. Bandera y detalles según tu elección al confirmar el pedido.',
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'shorts-muay-thai-negro-mate',
      name: 'Shorts Muay Thai Negro Mate',
      categoryId: muayThaiId,
      type: 'shorts',
      shortDescription: 'Sobrios. Negros. Para quien deja hablar al puño.',
      basePriceCents: 8500,
      status: 'published' as const,
      displayOrder: 2,
      availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      availableColors: [
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Gris hormigón', hex: '#555246' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 12 },
        backText: { enabled: true, maxLength: 12 },
        flag: { enabled: true, options: ['España', 'Tailandia', 'Ninguna'] },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'guantes-boxeo-12oz-rojo',
      name: 'Guantes Boxeo 12oz Rojo',
      categoryId: boxeoId,
      type: 'gloves',
      shortDescription: 'Hechos para entrenar todos los días sin que se queje la muñeca.',
      basePriceCents: 9500,
      status: 'published' as const,
      displayOrder: 1,
      availableWeights: ['8oz', '10oz', '12oz', '14oz', '16oz'],
      availableColors: [
        { name: 'Rojo bandera', hex: '#ED2939' },
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Blanco hueso', hex: '#FAFAF7' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 8 },
        flag: { enabled: true, options: ['España', 'Tailandia', 'México', 'Ninguna'] },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'guantes-muay-thai-10oz-negro',
      name: 'Guantes Muay Thai 10oz Negro',
      categoryId: muayThaiId,
      type: 'gloves',
      shortDescription: 'Cierre velcro reforzado. Velo interno acolchado.',
      basePriceCents: 9500,
      status: 'published' as const,
      displayOrder: 3,
      availableWeights: ['8oz', '10oz', '12oz', '14oz'],
      availableColors: [
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Rojo bandera', hex: '#ED2939' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 8 },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'rashguard-mma-grit',
      name: 'Rashguard MMA Grit',
      categoryId: mmaId,
      type: 'rashguard',
      shortDescription: 'Compresión sin asfixia. Costura plana sin marca.',
      basePriceCents: 4500,
      status: 'published' as const,
      displayOrder: 1,
      availableSizes: ['S', 'M', 'L', 'XL'],
      availableColors: [
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Rojo bandera', hex: '#ED2939' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 12 },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'camiseta-gym-block',
      name: 'Camiseta Gym Block',
      categoryId: camisetasId,
      type: 'tee',
      shortDescription: 'Algodón pesado 220gsm. Hombros cruzados.',
      basePriceCents: 2500,
      status: 'published' as const,
      displayOrder: 1,
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      availableColors: [
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Blanco hueso', hex: '#FAFAF7' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 16 },
        backText: { enabled: true, maxLength: 16 },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'bucal-termoformable-rojo-negro',
      name: 'Bucal termoformable rojo/negro',
      categoryId: bucalesId,
      type: 'mouthguard',
      shortDescription: 'Doble densidad. Personalizable con texto interior.',
      basePriceCents: 1900,
      status: 'published' as const,
      displayOrder: 1,
      availableSizes: ['Adulto', 'Junior'],
      availableColors: [
        { name: 'Rojo / Negro', hex: '#ED2939' },
        { name: 'Azul / Blanco', hex: '#1F3A8A' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 15 },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'shorts-mma-fight-grit',
      name: 'Shorts MMA Fight Grit',
      categoryId: mmaId,
      type: 'shorts',
      shortDescription: 'Cierre velcro + cordón. Spandex en la entrepierna para libertad de movimiento.',
      basePriceCents: 6900,
      status: 'published' as const,
      displayOrder: 2,
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      availableColors: [
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Rojo bandera', hex: '#ED2939' },
        { name: 'Gris hormigón', hex: '#555246' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 10 },
        backText: { enabled: true, maxLength: 10 },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'guantes-boxeo-14oz-blanco-hueso',
      name: 'Guantes Boxeo 14oz Blanco Hueso',
      categoryId: boxeoId,
      type: 'gloves',
      shortDescription: 'Para sparring intenso. Triple capa de espuma alta densidad.',
      basePriceCents: 11500,
      status: 'published' as const,
      displayOrder: 2,
      availableWeights: ['10oz', '12oz', '14oz', '16oz'],
      availableColors: [
        { name: 'Blanco hueso', hex: '#FAFAF7' },
        { name: 'Negro mate', hex: '#0E0E0C' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 8 },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'camiseta-team-noche-fight',
      name: 'Camiseta Team · edición Noche Fight',
      categoryId: camisetasId,
      type: 'tee',
      shortDescription: 'Edición limitada. Tipografía pesada en pecho y espalda.',
      basePriceCents: 2900,
      status: 'published' as const,
      displayOrder: 2,
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      availableColors: [
        { name: 'Negro mate', hex: '#0E0E0C' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 16 },
        backText: { enabled: true, maxLength: 16 },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'hoodie-industrial-heavyweight',
      name: 'Hoodie Industrial Heavyweight',
      categoryId: camisetasId,
      type: 'hoodie',
      shortDescription: 'Algodón 380gsm. Capucha doble forro. Bolsillo canguro reforzado.',
      basePriceCents: 5900,
      status: 'published' as const,
      displayOrder: 3,
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      availableColors: [
        { name: 'Negro mate', hex: '#0E0E0C' },
        { name: 'Gris hormigón', hex: '#555246' },
        { name: 'Lona blanca', hex: '#FAFAF7' },
      ],
      customizationConfig: {
        backText: { enabled: true, maxLength: 16 },
        font: { enabled: true, options: ['Industrial', 'Block', 'Brush'] },
      },
    },
    {
      id: crypto.randomUUID(),
      slug: 'bucal-junior-azul-blanco',
      name: 'Bucal junior azul/blanco',
      categoryId: bucalesId,
      type: 'mouthguard',
      shortDescription: 'Diseño junior. Mismo material termoformable, talla más pequeña.',
      basePriceCents: 1700,
      status: 'published' as const,
      displayOrder: 2,
      availableSizes: ['Junior'],
      availableColors: [
        { name: 'Azul / Blanco', hex: '#1F3A8A' },
        { name: 'Rojo / Negro', hex: '#ED2939' },
      ],
      customizationConfig: {
        frontText: { enabled: true, maxLength: 12 },
      },
    },
  ];

  await db.insert(schema.products).values(productsData);

  // ---------- Imágenes ----------
  console.log('  · inserting product images');
  const productImages: (typeof schema.productImages.$inferInsert)[] = [];
  for (const p of productsData) {
    const pair = PHOTO_SETS[p.slug] ?? [PEXELS(4761779), PEXELS(4761669)];
    productImages.push({
      id: crypto.randomUUID(),
      productId: p.id,
      url: pair[0],
      alt: p.name,
      isPrimary: true,
      displayOrder: 0,
    });
    productImages.push({
      id: crypto.randomUUID(),
      productId: p.id,
      url: pair[1],
      alt: `${p.name} — detalle`,
      isPrimary: false,
      displayOrder: 1,
    });
  }
  await db.insert(schema.productImages).values(productImages);

  // ---------- Trabajos ----------
  console.log('  · inserting works');
  const worksData = [
    {
      id: crypto.randomUUID(),
      slug: 'gimnasio-corona-bilbao',
      title: 'Equipación Gimnasio Corona',
      clientName: 'Gimnasio Corona',
      city: 'Bilbao',
      year: 2025,
      type: 'gym' as const,
      units: 22,
      brief:
        'El Corona cumplía 10 años y quería equipación para los 22 alumnos de competición. Misma identidad, número en la espalda, bandera del barrio.',
      process:
        'Bocetamos tres opciones. Eligieron la de cinta negra con costura blanca. Cuarenta días entre brief y entrega.',
      quote: {
        text: 'Salimos al ring y parecíamos otra cosa.',
        author: 'Iker Goikoetxea',
        role: 'Cabeza de equipo · Gimnasio Corona',
      },
      published: true,
      publishedAt: new Date('2025-11-04'),
      displayOrder: 1,
    },
    {
      id: crypto.randomUUID(),
      slug: 'fighter-tony-cardenas',
      title: 'Tony Cárdenas · K-1 World Series',
      clientName: 'Tony Cárdenas',
      city: 'Madrid',
      year: 2025,
      type: 'fighter' as const,
      units: 4,
      brief:
        'Tony peleaba en Lyon y quería cuatro shorts. Uno para el combate, tres para los entrenamientos previos.',
      process:
        'Tres iteraciones del bordado central. Aterrizamos en una cruz minimalista con su apellido en bloque debajo.',
      quote: {
        text: 'Los shorts se rompen antes que yo.',
        author: 'Tony Cárdenas',
        role: 'Fighter · K-1 World Series',
      },
      published: true,
      publishedAt: new Date('2025-09-12'),
      displayOrder: 2,
    },
    {
      id: crypto.randomUUID(),
      slug: 'evento-noche-fight-night',
      title: 'Noche Fight Night Vol. 3',
      clientName: 'Noche Productions',
      city: 'Barcelona',
      year: 2025,
      type: 'event' as const,
      units: 60,
      brief:
        'Sesenta camisetas para el staff de Noche Fight Night Vol. 3. Tipografía pesada, espalda al fondo del evento.',
      process:
        'Test de impresión en algodón 220gsm. Producción en 12 días para llegar a la prueba de sonido.',
      published: true,
      publishedAt: new Date('2025-06-21'),
      displayOrder: 3,
    },
    {
      id: crypto.randomUUID(),
      slug: 'gimnasio-furia-malaga',
      title: 'Cápsula 10º aniversario · Furia',
      clientName: 'Gimnasio Furia',
      city: 'Málaga',
      year: 2025,
      type: 'gym' as const,
      units: 80,
      brief:
        'Furia cumplía diez años. Querían una cápsula que vistiera a los alumnos en el evento del aniversario: camiseta, hoodie y bucal a juego.',
      process:
        'Diseñamos una identidad tipográfica nueva basada en su escudo original. 80 piezas en 14 días.',
      quote: {
        text: 'Los alumnos se quitaban las camisetas para llevárselas firmadas.',
        author: 'Lara Sanz',
        role: 'Directora · Gimnasio Furia',
      },
      published: true,
      publishedAt: new Date('2025-08-30'),
      displayOrder: 4,
    },
    {
      id: crypto.randomUUID(),
      slug: 'fighter-marta-ostendi',
      title: 'Marta Ostendi · Liga BCF',
      clientName: 'Marta Ostendi',
      city: 'Sevilla',
      year: 2024,
      type: 'fighter' as const,
      units: 6,
      brief:
        'Marta lleva tres temporadas en la Liga BCF. Quería un set completo: dos pantalones de combate, dos shorts de entrenamiento, dos rashguards.',
      process:
        'Estudiamos los colores oficiales de su club, propusimos tres opciones, eligió la más austera: negro mate con un trazo rojo en la pantorrilla.',
      published: true,
      publishedAt: new Date('2024-11-12'),
      displayOrder: 5,
    },
    {
      id: crypto.randomUUID(),
      slug: 'marca-corner-supplements',
      title: 'Cápsula Corner Supplements',
      clientName: 'Corner Supplements',
      city: 'Madrid',
      year: 2024,
      type: 'brand' as const,
      units: 150,
      brief:
        'Corner Supplements quería regalar 150 hoodies a sus afiliados gym. Pidieron que el bordado del pecho fuese discreto pero pesado al tacto.',
      process:
        'Bordado de 3D puff en hilo de algodón mercerizado. Tres pruebas hasta dar con el relieve adecuado.',
      published: true,
      publishedAt: new Date('2024-09-04'),
      displayOrder: 6,
    },
  ];
  await db.insert(schema.works).values(worksData);

  // ---------- Work images ----------
  console.log('  · inserting work images');
  const workImageRows: (typeof schema.workImages.$inferInsert)[] = [];

  // URLs absolutas (Pexels + Unsplash verificadas visualmente)
  const WORK_PHOTOS: Record<string, [string, string]> = {
    'gimnasio-corona-bilbao': [
      PEXELS(4761779), // fighter ring atmosférico
      PEXELS(4761669), // fighter torso
    ],
    'fighter-tony-cardenas': [
      UNSPLASH('photo-1599058945522-28d584b6f0ff'), // muay thai fighter rojo
      PEXELS(4761792), // manos guantes
    ],
    'evento-noche-fight-night': [
      PEXELS(7991668), // patada saco
      PEXELS(4761783), // vendas
    ],
    'gimnasio-furia-malaga': [
      PEXELS(4761669), // fighter torso
      PEXELS(7045617), // sparring
    ],
    'fighter-marta-ostendi': [
      UNSPLASH('photo-1607627000458-210e8d2bdb1d'), // boxeador puño
      UNSPLASH('photo-1591117207239-788bf8de6c3b'), // guante detalle
    ],
    'marca-corner-supplements': [
      PEXELS(4761779), // fighter ring
      PEXELS(6253307), // judo gi
    ],
  };

  for (const w of worksData) {
    const pair = WORK_PHOTOS[w.slug] ?? [PEXELS(4761779), PEXELS(4761669)];
    workImageRows.push({
      id: crypto.randomUUID(),
      workId: w.id,
      url: pair[0],
      alt: `${w.title} — hero`,
      type: 'hero',
      displayOrder: 0,
    });
    workImageRows.push({
      id: crypto.randomUUID(),
      workId: w.id,
      url: pair[1],
      alt: `${w.title} — detalle`,
      type: 'result',
      displayOrder: 1,
    });
  }
  await db.insert(schema.workImages).values(workImageRows);

  // ---------- Settings ----------
  console.log('  · inserting settings');
  await db.insert(schema.settings).values([
    {
      key: 'contact',
      value: {
        whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34600000000',
        email: 'hola@industrialfighters.com',
        address: '',
      },
    },
    {
      key: 'socials',
      value: {
        instagram: 'https://instagram.com/industrialfighters',
        tiktok: 'https://tiktok.com/@industrialfighters',
      },
    },
    {
      key: 'announcement_bar',
      value: {
        enabled: true,
        messages: [
          'ENVÍO 24/48H A TODA ESPAÑA. INTERNACIONAL CONSULTAR.',
          'PERSONALIZACIÓN INCLUIDA EN TODOS LOS PRODUCTOS.',
          'DE DONDE VENIMOS SE LUCHA CADA DÍA.',
        ],
      },
    },
    {
      key: 'about',
      value: {
        slogan: 'De donde venimos se lucha cada día.',
        manifesto:
          'No vendemos ropa. Vendemos lo que te pones para trabajar. Cada pantalón lo hacemos porque alguien tiene un combate el sábado. Cada guante porque alguien entrena a las seis de la mañana. Cada camiseta porque un gimnasio cumple diez años y sus alumnos quieren llevarlo puesto.',
        origin:
          'Empezamos en un gimnasio de barrio de Bilbao en 2019. Una máquina de coser de segunda mano y dos clientes. Hoy seguimos cosiendo nosotros mismos cada prenda.',
      },
    },
  ]);

  console.log('✅ Seed completo.');
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
