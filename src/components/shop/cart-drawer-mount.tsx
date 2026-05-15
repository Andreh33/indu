import { getContact } from '@/server/queries/settings';
import CartDrawer from './cart-drawer';

export default async function CartDrawerMount() {
  const contact = await getContact();
  return <CartDrawer whatsappNumber={contact.whatsapp} />;
}
