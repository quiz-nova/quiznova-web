export interface HeaderLink {
  id: number;
  label: string; // Name Will Apper To The User
  name: string; // Name We Will Use In Html attripute
}
export const headerLinks: HeaderLink[] = [
  { id: 1, label: 'Features', name: 'features' },
  { id: 2, label: 'Pricing', name: 'pricing' },
  { id: 3, label: 'About', name: 'about' },
  { id: 4, label: 'Contact', name: 'contact' },
];
