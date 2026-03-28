import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Logo } from '../../shared/components/logo/logo';

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
  template: `
    <footer id="contact" class="footer">
      <div class="footer__top">
        <div class="footer__brand">
          <app-logo />
          <p>The modern multi-tenant quiz platform built for educational institutions.</p>
        </div>

        <div class="footer__columns">
          <div class="footer__column">
            <h4>Product</h4>
            @for (link of productLinks(); track link.id) {
              <a [attr.href]="link.name">{{ link.label }}</a>
            }
          </div>

          <div class="footer__column">
            <h4>Company</h4>
            @for (link of companyLinks(); track link.id) {
              <a [attr.href]="link.name">{{ link.label }}</a>
            }
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© 2026 QuizNova. All rights reserved.</p>
      </div>
    </footer>
  `,
  styleUrls: ['../shared/landing-shared.css'],
  styles: `
    .footer {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 2rem;
      overflow-x: clip;
      background-color: var(--clr-blue-900);
      color: var(--clr-white);
    }

    .footer__bottom {
      margin: 1rem;
      text-align: center;
    }

    .footer__top {
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 2rem;
      padding: 2rem;

      @media (width < 575px) {
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      &::after {
        position: absolute;
        top: 100%;
        left: 50%;
        width: 100vw;
        height: 1px;
        background-color: var(--clr-white);
        transform: translateX(-50%);
        content: '';
      }
    }

    .footer__brand {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media (width < 575px) {
        align-items: center;
        justify-content: center;
      }

      p {
        color: var(--clr-gray-600);
      }
    }

    .footer__columns {
      display: flex;
      justify-content: space-around;
      flex: 1;
      gap: 2rem;

      @media (width < 575px) {
        width: 100%;
      }

      a {
        color: var(--clr-gray-600);
      }
    }

    .footer__column {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  productLinks = signal<ProductLinks[]>(productLinks);
  companyLinks = signal<CompanyLinks[]>(companyLinks);
}
