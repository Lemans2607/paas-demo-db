import { LucideIcon, BookOpen, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';

export const WHATSAPP_NUMBER = "676042996";
export const MOMO_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/f/f2/MTN_Logo.svg"; // Placeholder
export const ORANGE_MONEY_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg"; // Placeholder

export const NAV_LINKS = [
  { name: 'Accueil', path: '/' },
  { name: 'Étudiants & Répétiteurs', path: '/education' },
  { name: 'PME & Business', path: '/business' },
  { name: 'Espace Admin', path: '/admin' },
];

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  education: GraduationCap,
  business: Briefcase,
  clarity: BookOpen,
  security: ShieldCheck
};
