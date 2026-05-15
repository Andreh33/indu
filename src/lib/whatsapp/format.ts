import type { CartItem } from '@/types/cart';

const ICONS: Record<string, string> = {
  'muay-thai': '🥊',
  mma: '🥋',
  boxeo: '🥊',
  camisetas: '👕',
  bucales: '🦷',
};

export function buildWhatsAppMessage(items: CartItem[]): string {
  const date = new Date().toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines: string[] = [];
  lines.push('¡Hola! Quiero hacer este pedido en Industrial Fighters:');
  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`PEDIDO · ${date}`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');

  for (const item of items) {
    const icon = ICONS[item.category] ?? '·';
    lines.push(`${icon} ${item.productName.toUpperCase()}`);
    if (item.variants.size) lines.push(`   Talla: ${item.variants.size}`);
    if (item.variants.color) lines.push(`   Color: ${item.variants.color}`);
    if (item.variants.beltColor) lines.push(`   Cinturón: ${item.variants.beltColor}`);
    if (item.variants.weight) lines.push(`   Peso: ${item.variants.weight}`);
    if (item.variants.fit) lines.push(`   Fit: ${item.variants.fit}`);
    if (item.variants.closure) lines.push(`   Cierre: ${item.variants.closure}`);
    if (item.variants.hand) lines.push(`   Mano: ${item.variants.hand}`);
    if (item.customization.frontText) lines.push(`   Frontal: "${item.customization.frontText}"`);
    if (item.customization.backText) lines.push(`   Trasero: "${item.customization.backText}"`);
    if (item.customization.flag) lines.push(`   Bandera: ${item.customization.flag}`);
    if (item.customization.font) lines.push(`   Fuente: ${item.customization.font}`);
    if (item.customization.embroideryNotes)
      lines.push(`   Bordado: ${item.customization.embroideryNotes}`);
    if (item.customization.customImageUrl)
      lines.push(`   Imagen custom: ${item.customization.customImageUrl}`);
    lines.push(`   Cantidad: ${item.quantity}`);
    const subtotal = (item.basePriceCents * item.quantity) / 100;
    lines.push(`   Precio: ${subtotal.toFixed(0)} €`);
    lines.push('');
  }

  const subtotal = items.reduce((acc, i) => acc + i.basePriceCents * i.quantity, 0) / 100;
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`SUBTOTAL: ${subtotal.toFixed(0)} €`);
  lines.push('ENVÍO: a confirmar');
  lines.push(`TOTAL ESTIMADO: ${subtotal.toFixed(0)} €`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push('Para terminar el pedido necesito que me confirmes:');
  lines.push('- Disponibilidad y plazos');
  lines.push('- Coste de envío a mi código postal');
  lines.push('- Forma de pago');
  lines.push('');
  lines.push('¡Gracias!');

  return lines.join('\n');
}

export function buildWhatsAppUrl(items: CartItem[], whatsappNumber: string): string {
  const text = encodeURIComponent(buildWhatsAppMessage(items));
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}
