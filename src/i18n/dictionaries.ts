export type Locale = 'es' | 'en' | 'fr';

export const LOCALES: Locale[] = ['es', 'en', 'fr'];
export const DEFAULT_LOCALE: Locale = 'es';

export type Dictionary = {
  nav: {
    shop: string;
    works: string;
    blog: string;
    about: string;
    cart: string;
    wishlist: string;
    skip: string;
  };
  cta: {
    seeShop: string;
    seeWorks: string;
    addCart: string;
    customize: string;
    openWhatsApp: string;
    backHome: string;
    readManifesto: string;
  };
  hero: {
    eyebrow: string;
    subtitle: string;
  };
  footer: {
    shop: string;
    info: string;
    about: string;
    works: string;
    shipping: string;
    legal: string;
    privacy: string;
    cookies: string;
    madeIn: string;
    designed: string;
    soundOn: string;
    soundOff: string;
  };
  common: {
    loading: string;
    empty: string;
    seeAll: string;
    notice: string;
  };
};

export const DICT: Record<Locale, Dictionary> = {
  es: {
    nav: {
      shop: 'Tienda',
      works: 'Trabajos',
      blog: 'Diario',
      about: 'Sobre',
      cart: 'Carrito',
      wishlist: 'Lista',
      skip: 'Saltar al contenido',
    },
    cta: {
      seeShop: 'Ver tienda →',
      seeWorks: 'Ver trabajos',
      addCart: 'Añadir al carrito',
      customize: 'Personalizar →',
      openWhatsApp: 'Abrir conversación en WhatsApp',
      backHome: 'Volver al inicio →',
      readManifesto: 'Lee el manifiesto completo →',
    },
    hero: {
      eyebrow: '// ROUND 1 — IDENTIDAD · EST. 2019',
      subtitle:
        'Equipamiento de combate hecho a mano en España. Personalizado producto a producto.',
    },
    footer: {
      shop: 'Tienda',
      info: 'Información',
      about: 'Sobre nosotros',
      works: 'Trabajos',
      shipping: 'Envíos y devoluciones',
      legal: 'Aviso legal',
      privacy: 'Privacidad',
      cookies: 'Cookies',
      madeIn: '© 2026 INDUSTRIAL FIGHTERS · HECHO EN ESPAÑA',
      designed: 'DISEÑADO Y CONSTRUIDO A MANO',
      soundOn: '◉ sound on',
      soundOff: '○ sound off',
    },
    common: {
      loading: 'Cargando…',
      empty: 'Nada por aquí.',
      seeAll: 'Ver todo →',
      notice: 'AVISO',
    },
  },
  en: {
    nav: {
      shop: 'Shop',
      works: 'Work',
      blog: 'Journal',
      about: 'About',
      cart: 'Cart',
      wishlist: 'Saved',
      skip: 'Skip to content',
    },
    cta: {
      seeShop: 'Visit shop →',
      seeWorks: 'See our work',
      addCart: 'Add to cart',
      customize: 'Customize →',
      openWhatsApp: 'Open chat on WhatsApp',
      backHome: 'Back to home →',
      readManifesto: 'Read the full manifesto →',
    },
    hero: {
      eyebrow: '// ROUND 1 — IDENTITY · EST. 2019',
      subtitle: 'Combat gear handmade in Spain. Personalized product by product.',
    },
    footer: {
      shop: 'Shop',
      info: 'Info',
      about: 'About',
      works: 'Work',
      shipping: 'Shipping & returns',
      legal: 'Legal notice',
      privacy: 'Privacy',
      cookies: 'Cookies',
      madeIn: '© 2026 INDUSTRIAL FIGHTERS · MADE IN SPAIN',
      designed: 'DESIGNED & BUILT BY HAND',
      soundOn: '◉ sound on',
      soundOff: '○ sound off',
    },
    common: {
      loading: 'Loading…',
      empty: 'Nothing here yet.',
      seeAll: 'See all →',
      notice: 'NOTICE',
    },
  },
  fr: {
    nav: {
      shop: 'Boutique',
      works: 'Projets',
      blog: 'Journal',
      about: 'À propos',
      cart: 'Panier',
      wishlist: 'Sauvés',
      skip: 'Passer au contenu',
    },
    cta: {
      seeShop: 'Voir la boutique →',
      seeWorks: 'Voir les projets',
      addCart: 'Ajouter au panier',
      customize: 'Personnaliser →',
      openWhatsApp: 'Ouvrir le chat WhatsApp',
      backHome: 'Retour à l’accueil →',
      readManifesto: 'Lire le manifeste complet →',
    },
    hero: {
      eyebrow: '// ROUND 1 — IDENTITÉ · EST. 2019',
      subtitle:
        'Équipement de combat fait main en Espagne. Personnalisé produit par produit.',
    },
    footer: {
      shop: 'Boutique',
      info: 'Informations',
      about: 'À propos',
      works: 'Projets',
      shipping: 'Livraison & retours',
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
      madeIn: '© 2026 INDUSTRIAL FIGHTERS · FABRIQUÉ EN ESPAGNE',
      designed: 'DESSINÉ ET CONSTRUIT À LA MAIN',
      soundOn: '◉ son activé',
      soundOff: '○ son désactivé',
    },
    common: {
      loading: 'Chargement…',
      empty: 'Rien ici pour l’instant.',
      seeAll: 'Tout voir →',
      notice: 'AVIS',
    },
  },
};

export function getDict(locale: Locale): Dictionary {
  return DICT[locale] ?? DICT[DEFAULT_LOCALE];
}
