import Link from 'next/link';
import Container from '@/components/ui/container';
import ScrollReveal from '@/components/motion/scroll-reveal';
import RoundCounter from '@/components/home/round-counter';
import AnimatedCounter from '@/components/motion/animated-counter';
import Marquee from '@/components/motion/marquee';
import ScrollFillText from '@/components/motion/scroll-fill-text';
import SplitText from '@/components/motion/split-text';
import ScrollPathDraw from '@/components/motion/scroll-path-draw';
import JsonLd from '@/components/seo/json-ld';
import { CategoryIcon } from '@/components/brand/icons';
import HeroBackdrop from '@/components/home/hero-backdrop';
import WorkCard from '@/components/shop/work-card';
import Product3DPreview from '@/components/shop/product-3d-preview';
import { getCategories, getPublishedProducts } from '@/server/queries/products';
import { getFeaturedWorks } from '@/server/queries/works';
import { getSocials } from '@/server/queries/settings';
import { formatPriceEUR } from '@/lib/utils/format-price';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://industrialfighters.com';

const CATEGORY_BG: Record<string, string> = {
  'muay-thai':
    'https://images.pexels.com/photos/7991668/pexels-photo-7991668.jpeg?w=800&auto=compress&cs=tinysrgb',
  mma: 'https://images.pexels.com/photos/7045617/pexels-photo-7045617.jpeg?w=800&auto=compress&cs=tinysrgb',
  boxeo:
    'https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?w=800&auto=compress&cs=tinysrgb',
  camisetas:
    'https://images.pexels.com/photos/4761669/pexels-photo-4761669.jpeg?w=800&auto=compress&cs=tinysrgb',
  bucales:
    'https://images.pexels.com/photos/4761783/pexels-photo-4761783.jpeg?w=800&auto=compress&cs=tinysrgb',
  default:
    'https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg?w=800&auto=compress&cs=tinysrgb',
};

const MATERIALS = [
  {
    code: 'M-01',
    name: 'Satén 100% poliéster',
    spec: '120 g/m² · Tejido fluido para shorts Muay Thai',
    detail:
      'Aguanta lavados, conserva el brillo y se mueve sin pesar. Cinturón ancho con elástico interior.',
  },
  {
    code: 'M-02',
    name: 'Algodón pesado 220 g/m²',
    spec: 'Camisetas. Hombros cruzados, cuello reforzado',
    detail:
      'No se deforma tras 50 lavados. Bordado interior con cinta de algodón para que la nuca no roce.',
  },
  {
    code: 'M-03',
    name: 'Piel sintética premium + espuma alta densidad',
    spec: 'Guantes 8–16 oz. Triple capa en nudillo',
    detail:
      'Cierre velcro reforzado o cordón a elección. Velo interior absorbente y antibacteriano.',
  },
  {
    code: 'M-04',
    name: 'EVA termoformable doble densidad',
    spec: 'Bucales. Adulto y junior',
    detail:
      'Adaptación perfecta a la mordida con agua a 65°. Diseño interior personalizable.',
  },
];

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Brief',
    body: 'Hablamos contigo. Qué necesitas, cuándo, cuántas piezas, qué identidad. Sin formularios robóticos.',
  },
  {
    n: '02',
    title: 'Bocetos',
    body: 'En 48–72 h te mandamos 2 o 3 opciones reales. Modificamos hasta que la pieza es tuya, no nuestra.',
  },
  {
    n: '03',
    title: 'Producción',
    body: 'Cortamos, cosemos y bordamos en nuestro taller en España. Sin subcontratas. Sin "fabricado en otra parte".',
  },
  {
    n: '04',
    title: 'Entrega',
    body: 'Envío 24–48 h península. Si el sábado peleas, lo tienes el jueves. Si entrenas el lunes, lo tienes el viernes.',
  },
];

const TESTIMONIOS = [
  {
    quote: 'Salimos al ring y parecíamos otra cosa. Mis alumnos no se quieren quitar los shorts.',
    author: 'Iker Goikoetxea',
    role: 'Cabeza de equipo · Gimnasio Corona, Bilbao',
  },
  {
    quote: 'Los shorts se rompen antes que yo. Y eso es mucho decir.',
    author: 'Tony Cárdenas',
    role: 'Fighter · K-1 World Series',
  },
  {
    quote:
      'Llamé un martes pidiendo 60 camisetas para el sábado. El sábado las teníamos. Otra gente ni te coge el teléfono.',
    author: 'Pau Riera',
    role: 'Productor · Noche Fight Night',
  },
];

const EQUIPOS = [
  'Gimnasio Corona · Bilbao',
  'Gimnasio Furia · Málaga',
  'Tony Cárdenas',
  'Noche Productions · Barcelona',
  'Marta Ostendi · BCF',
  'Corner Supplements · Madrid',
  'Equipo Rincón · Valencia',
  'Saco Roto · Granada',
  'Club Esquinazo · Donostia',
];

export default async function HomePage() {
  const [categories, allProducts, featured, socials] = await Promise.all([
    getCategories(),
    getPublishedProducts(),
    getFeaturedWorks(3),
    getSocials(),
  ]);

  // Producto destacado: el primero publicado con foto.
  const heroProduct =
    allProducts.find((p) => p.slug === 'shorts-muay-thai-rojo-bandera') ?? allProducts[0];

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Industrial Fighters',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.svg`,
    description:
      'Equipamiento de combate hecho a mano en España. Personalizado producto a producto.',
    sameAs: [socials.instagram, socials.tiktok, socials.youtube, socials.twitter].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <RoundCounter />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-12 pb-20 text-center">
        <HeroBackdrop />
        <Container size="xl" className="relative z-[1] flex flex-col items-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// ROUND 1 — IDENTIDAD · EST. 2019'}
          </p>
          <SplitText
            as="h1"
            text={'De donde\nvenimos\nse lucha\ncada día.'}
            staggerChildren={0.025}
            delayChildren={0.25}
            className="mt-10 font-display uppercase leading-[0.85] tracking-[-0.03em] text-[length:var(--text-hero)] text-[var(--color-canvas-0)]"
          />
          <p className="mt-12 max-w-[44ch] text-[length:var(--text-lg)] text-[var(--color-fg-muted)]">
            Equipamiento de combate hecho a mano en España.
            <br />
            Personalizado producto a producto.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <Link
              href="/shop"
              className="inline-flex h-14 items-center bg-[var(--color-blood-400)] px-10 font-display text-base uppercase tracking-[0.06em] text-[var(--color-canvas-0)] transition-colors hover:bg-[var(--color-blood-300)]"
            >
              Ver tienda →
            </Link>
            <Link
              href="/trabajos"
              className="inline-flex h-14 items-center border border-[var(--color-canvas-300)] px-10 font-display text-base uppercase tracking-[0.06em] text-[var(--color-canvas-0)] transition-colors hover:border-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
            >
              Ver trabajos
            </Link>
          </div>
        </Container>
      </section>

      {/* MARQUEE EQUIPOS */}
      <div className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 py-6 backdrop-blur-sm">
        <Marquee
          items={EQUIPOS}
          speed={50}
          className="font-mono text-xs tracking-[0.3em] text-[var(--color-fg-muted)]"
        />
      </div>

      {/* CATEGORÍAS */}
      <section className="border-b border-[var(--color-border)] py-24">
        <Container size="max">
          <ScrollReveal className="mb-12 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
                {'// ROUND 2 — CATEGORÍAS'}
              </p>
              <h2
                className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
                style={{ fontSize: 'var(--text-4xl)' }}
              >
                Cada esquina,
                <br /> su equipo.
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-blood-300)] md:block"
            >
              Ver catálogo completo →
            </Link>
          </ScrollReveal>
          <ul className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--color-border)] md:grid-cols-4 lg:grid-cols-5">
            {categories.map((c) => {
              const bg = CATEGORY_BG[c.slug] ?? CATEGORY_BG.default;
              return (
                <li key={c.id}>
                  <Link
                    href={`/shop/${c.slug}`}
                    className="group relative flex aspect-[3/4] flex-col items-start justify-end overflow-hidden bg-[var(--color-bg-elevated)] p-5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bg}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale transition-all duration-[800ms] ease-[var(--ease-fight)] group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-canvas-950)] via-[var(--color-canvas-950)]/40 to-transparent" />
                    {/* Icono de marca arriba-derecha */}
                    <CategoryIcon
                      slug={c.slug}
                      className="absolute right-4 top-4 h-8 w-8 text-[var(--color-canvas-0)] opacity-70 transition-opacity group-hover:text-[var(--color-blood-300)] group-hover:opacity-100"
                    />
                    <div className="relative">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] group-hover:text-[var(--color-blood-300)]">
                        0{c.displayOrder}
                      </p>
                      <h3 className="mt-2 font-display text-2xl uppercase leading-tight text-[var(--color-canvas-0)]">
                        {c.name}
                      </h3>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] group-hover:text-[var(--color-canvas-0)]">
                        Explorar →
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* NÚMEROS */}
      <section className="border-b border-[var(--color-border)] py-24">
        <Container size="max">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
              {'// LO QUE LLEVAMOS HECHO'}
            </p>
            <h2
              className="mt-3 max-w-3xl font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
              style={{ fontSize: 'var(--text-4xl)' }}
            >
              Seis años cosiendo. Las cifras hablan.
            </h2>
          </ScrollReveal>
          <ul className="mt-16 grid grid-cols-2 gap-12 md:grid-cols-4">
            <li>
              <p
                className="font-display leading-none text-[var(--color-blood-400)]"
                style={{ fontSize: 'var(--text-5xl)' }}
              >
                <AnimatedCounter value={2412} />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                Prendas cosidas
              </p>
            </li>
            <li>
              <p
                className="font-display leading-none text-[var(--color-canvas-0)]"
                style={{ fontSize: 'var(--text-5xl)' }}
              >
                <AnimatedCounter value={147} />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                Gimnasios y equipos
              </p>
            </li>
            <li>
              <p
                className="font-display leading-none text-[var(--color-canvas-0)]"
                style={{ fontSize: 'var(--text-5xl)' }}
              >
                <AnimatedCounter value={11} />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                Países servidos
              </p>
            </li>
            <li>
              <p
                className="font-display leading-none text-[var(--color-canvas-0)]"
                style={{ fontSize: 'var(--text-5xl)' }}
              >
                <AnimatedCounter value={6} />
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                Años en el taller
              </p>
            </li>
          </ul>
        </Container>
      </section>

      {/* SEPARADOR · path drawing */}
      <div className="border-b border-[var(--color-border)] py-12">
        <Container size="max">
          <ScrollPathDraw className="h-16" />
        </Container>
      </div>

      {/* PRODUCTO DESTACADO */}
      {heroProduct ? (
        <section className="relative border-b border-[var(--color-border)] py-24">
          <Container size="max">
            <ScrollReveal className="mb-12">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
                {'// PIEZA DESTACADA'}
              </p>
              <h2
                className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
                style={{ fontSize: 'var(--text-4xl)' }}
              >
                El que arranca todo.
              </h2>
            </ScrollReveal>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Link
                href={`/producto/${heroProduct.slug}`}
                className="relative block"
              >
                {heroProduct.images[0]?.url ? (
                  <Product3DPreview
                    imageUrl={heroProduct.images[0].url}
                    alt={heroProduct.images[0].alt ?? heroProduct.name}
                    embroidery="TONY"
                    flag="🇪🇸"
                  />
                ) : null}
              </Link>
              <div className="flex flex-col gap-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  Personalizable · Hecho a mano
                </p>
                <h3
                  className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
                  style={{ fontSize: 'var(--text-5xl)' }}
                >
                  {heroProduct.name}
                </h3>
                {heroProduct.shortDescription ? (
                  <p className="max-w-lg text-lg leading-relaxed text-[var(--color-fg)]">
                    {heroProduct.shortDescription}
                  </p>
                ) : null}
                <p className="font-mono text-3xl tabular-nums text-[var(--color-canvas-0)]">
                  {formatPriceEUR(heroProduct.basePriceCents)}
                </p>
                <div>
                  <Link
                    href={`/producto/${heroProduct.slug}`}
                    className="inline-flex h-12 items-center bg-[var(--color-blood-400)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]"
                  >
                    Personalizar →
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* MATERIALES */}
      <section className="border-b border-[var(--color-border)] py-24">
        <Container size="max">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
              {'// MATERIA PRIMA'}
            </p>
            <h2
              className="mt-3 max-w-3xl font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
              style={{ fontSize: 'var(--text-4xl)' }}
            >
              No te vendemos un logo.
              <br />
              Te vendemos el tejido.
            </h2>
          </ScrollReveal>
          <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-border)] md:grid-cols-2">
            {MATERIALS.map((m) => (
              <li
                key={m.code}
                className="flex flex-col gap-3 bg-[var(--color-bg-elevated)] p-8 md:p-10"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
                  {m.code}
                </p>
                <h3 className="font-display text-2xl uppercase leading-tight text-[var(--color-canvas-0)]">
                  {m.name}
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                  {m.spec}
                </p>
                <p className="mt-2 text-[var(--color-fg)] leading-relaxed">{m.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* PROCESO */}
      <section className="border-b border-[var(--color-border)] py-24">
        <Container size="max">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
              {'// CÓMO TRABAJAMOS'}
            </p>
            <h2
              className="mt-3 max-w-3xl font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
              style={{ fontSize: 'var(--text-4xl)' }}
            >
              Del brief al ring,
              <br />
              en cuatro pasos.
            </h2>
          </ScrollReveal>
          <ol className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s) => (
              <li key={s.n} className="relative flex flex-col gap-4">
                <p
                  className="font-display leading-none text-[var(--color-blood-400)]"
                  style={{ fontSize: 'var(--text-5xl)' }}
                >
                  {s.n}
                </p>
                <h3 className="font-display text-2xl uppercase leading-tight text-[var(--color-canvas-0)]">
                  {s.title}
                </h3>
                <p className="text-[var(--color-fg-muted)] leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* LO QUE INCLUIMOS */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-24">
        <Container size="max">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
              {'// LO QUE VIENE INCLUIDO'}
            </p>
            <h2
              className="mt-3 max-w-3xl font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
              style={{ fontSize: 'var(--text-4xl)' }}
            >
              No te cobramos por
              <br />
              lo que es lógico.
            </h2>
          </ScrollReveal>
          <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-border)] md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Bordado del nombre',
                body: 'Hasta 12 caracteres frontal y trasero. En cualquier color del catálogo.',
              },
              {
                title: 'Bandera o emblema',
                body: '50+ banderas y plantillas listas. Si la tuya no está, la dibujamos.',
              },
              {
                title: 'Envío 24–48 h',
                body: 'Península gratis a partir de 80 €. Baleares, Canarias y mundo: bajo consulta.',
              },
              {
                title: 'Caja de presentación',
                body: 'Cartón negro mate, cinta de algodón. Pensada para regalo o entrega de equipo.',
              },
              {
                title: 'Ajuste de medidas',
                body: 'Talla a medida sin coste para pedidos de equipo (5 unidades o más).',
              },
              {
                title: 'Garantía de costura',
                body: 'Si una costura cede en los primeros 12 meses de uso normal, te lo arreglamos o reponemos.',
              },
            ].map((item, i) => (
              <li
                key={i}
                className="flex gap-5 bg-[var(--color-bg)] p-8 md:p-10"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 flex-none items-center justify-center border border-[var(--color-blood-400)] font-mono text-sm text-[var(--color-blood-400)]"
                >
                  ✓
                </span>
                <div>
                  <h3 className="font-display text-xl uppercase leading-tight text-[var(--color-canvas-0)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* SCROLL FILL TEXT */}
      <section className="relative border-b border-[var(--color-border)] py-[40vh]">
        <Container size="lg">
          <p className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// LO QUE TE PONES'}
          </p>
          <ScrollFillText
            phrase="Cada costura aguanta lo que tú aguantas. Cada ronda, una más. Esto no es ropa: es lo que te pones para *trabajar*."
          />
        </Container>
      </section>

      {/* SLOGAN REVEAL */}
      <section className="py-32">
        <Container size="max">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
              {'// CAPÍTULO 02 — IDENTIDAD'}
            </p>
          </ScrollReveal>
          <div className="mt-8">
            <ScrollReveal y={60}>
              <p
                className="font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
                style={{ fontSize: 'var(--text-6xl)' }}
              >
                De donde
                <br />
                venimos
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="my-6 h-px w-full origin-left bg-[var(--color-blood-400)]" />
            </ScrollReveal>
            <ScrollReveal y={60} delay={0.3}>
              <p
                className="font-display uppercase leading-[0.85] tracking-[-0.02em] text-[var(--color-canvas-0)]"
                style={{ fontSize: 'var(--text-6xl)' }}
              >
                se lucha
                <br />
                cada día.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* FEATURED WORKS */}
      {featured.length > 0 ? (
        <section className="border-t border-[var(--color-border)] py-24">
          <Container size="max">
            <ScrollReveal className="mb-12 flex items-end justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
                  {'// CASOS REALES'}
                </p>
                <h2
                  className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[var(--color-canvas-0)]"
                  style={{ fontSize: 'var(--text-4xl)' }}
                >
                  Últimos trabajos.
                </h2>
              </div>
              <Link
                href="/trabajos"
                className="hidden font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-blood-300)] md:block"
              >
                Ver todos →
              </Link>
            </ScrollReveal>
            <ul className="grid gap-6 md:grid-cols-3">
              {featured.map((w) => (
                <li key={w.id}>
                  <WorkCard work={w} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* TESTIMONIOS */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-24">
        <Container size="lg">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
              {'// EN PALABRAS DE QUIEN NOS LLEVA PUESTO'}
            </p>
          </ScrollReveal>
          <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {TESTIMONIOS.map((t, i) => (
              <li key={i} className="flex flex-col gap-6">
                <p
                  className="font-display uppercase italic leading-tight text-[var(--color-canvas-0)]"
                  style={{ fontSize: 'var(--text-2xl)' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg)]">
                    {t.author}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    {t.role}
                  </p>
                </footer>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* MANIFIESTO ABREVIADO */}
      <section className="border-b border-[var(--color-border)] py-32">
        <Container size="md">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-blood-400)]">
            {'// MANIFIESTO'}
          </p>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-[var(--color-fg)]">
            <p>No vendemos ropa. Vendemos lo que te pones para trabajar.</p>
            <p>
              Cada pantalón lo hacemos porque alguien tiene un combate el sábado. Cada guante
              porque alguien entrena a las seis de la mañana. Cada camiseta porque un gimnasio
              cumple diez años y sus alumnos quieren llevarlo puesto.
            </p>
            <p>De donde venimos se lucha cada día. Nosotros cosemos. Tú haces el resto.</p>
          </div>
          <p className="mt-12 font-display text-4xl uppercase text-[var(--color-blood-400)]">
            Industrial Fighters.
          </p>
          <Link
            href="/sobre-nosotros"
            className="mt-10 inline-flex h-12 items-center border border-[var(--color-canvas-300)] px-8 font-display text-sm uppercase tracking-[0.06em] text-[var(--color-canvas-0)] hover:border-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]"
          >
            Lee el manifiesto completo →
          </Link>
        </Container>
      </section>

      {/* NEWSLETTER / CIERRE */}
      <section className="relative overflow-hidden bg-[var(--color-blood-400)] py-24 text-[var(--color-canvas-0)]">
        <Container size="lg" className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-canvas-0)]/70">
              {'// QUÉDATE CERCA'}
            </p>
            <h2
              className="mt-3 font-display uppercase leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: 'var(--text-3xl)' }}
            >
              Mándanos un WhatsApp.
              <br /> Cosemos lo que pidas.
            </h2>
            <p className="mt-4 text-base text-[var(--color-canvas-0)]/85">
              Cada pedido se cierra por WhatsApp. Sin formularios, sin esperas raras. Tú escribes,
              te contestamos en horas.
            </p>
          </div>
          <a
            href="/carrito"
            className="inline-flex h-14 items-center bg-[var(--color-canvas-950)] px-10 font-display text-base uppercase tracking-[0.06em] text-[var(--color-canvas-0)] transition-colors hover:bg-[var(--color-canvas-800)]"
          >
            Empezar pedido →
          </a>
        </Container>
      </section>
    </>
  );
}
