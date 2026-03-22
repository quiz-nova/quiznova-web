import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Logo } from '../../shared/logo/logo';

export interface ProductLinks {
  id: number;
  label: string;
  name: string;
}

export interface CompanyLinks {
  id: number;
  label: string;
  name: string;
}

export const productLinks: ProductLinks[] = [
  { id: 1, label: 'Features', name: '#features' },
  { id: 2, label: 'Pricing', name: '#pricing' },
  { id: 3, label: 'Login', name: '#' },
];

export const companyLinks: CompanyLinks[] = [
  { id: 1, label: 'About', name: '#' },
  { id: 2, label: 'Contact', name: '#contact' },
  { id: 3, label: 'Careers', name: '#' },
];

@Component({
  selector: 'app-contact',
  imports: [Logo],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  productLinks = signal<ProductLinks[]>(productLinks);
  companyLinks = signal<CompanyLinks[]>(companyLinks);

  readonly sortedProductLinks = computed(() =>
    [...this.productLinks()].sort((a, b) => a.id - b.id),
  );

  readonly sortedCompanyLinks = computed(() =>
    [...this.companyLinks()].sort((a, b) => a.id - b.id),
  );
}
