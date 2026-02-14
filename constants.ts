
import { LucideIcon, BookOpen, Briefcase, GraduationCap, ShieldCheck, Palette, Brain } from 'lucide-react';

export const WHATSAPP_NUMBER = "676042996";
export const CONTACT_EMAIL = "myannluther@gmail.com";
export const ADDRESS = "Douala, carrefour saint nicholas Ndogpassi, Cameroun";
export const APP_TAGLINE = "L'Excellence Numérique 237";

export const NAV_LINKS = [
  { name: 'Accueil', path: '/' },
  { name: 'Étudiants & Répétiteurs', path: '/education' },
  { name: 'PME, Tontine & DAO', path: '/business' },
  { name: 'Studio Numérique', path: '/studio' },
  { name: 'Cerveau Numérique', path: '/brain' },
  { name: 'Admin', path: '/admin' },
];

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  education: GraduationCap,
  business: Briefcase,
  clarity: BookOpen,
  security: ShieldCheck,
  studio: Palette,
  brain: Brain
};
