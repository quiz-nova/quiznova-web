import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LanguageService } from '@Core/services/language.service';
import { Select } from 'primeng/select';

@Component({
  selector: 'qn-language-selector',
  standalone: true,
  imports: [Select, FormsModule],
  template: `
    <p-select
      [(ngModel)]="activeLangCode"
      [options]="languages"
      optionLabel="nativeName"
      optionValue="code"
      aria-label="Select Language"
    >
      <ng-template #selectedItem let-selectedOption>
        <div class="lang-option">
          <i class="fa-solid fa-globe lang-option__icon" aria-hidden="true"></i>
          <span>{{ selectedOption?.nativeName }}</span>
        </div>
      </ng-template>
      <ng-template #item let-option>
        <div class="lang-option">
          <span>{{ option.nativeName }}</span>
          <span class="lang-option__code">{{ option.code.toUpperCase() }}</span>
        </div>
      </ng-template>
    </p-select>
  `,
  styleUrls: ['./language-selector.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelector {
  private readonly languageService = inject(LanguageService);

  protected readonly languages = this.languageService.supportedLanguages;

  protected get activeLangCode(): string {
    return this.languageService.currentLang();
  }

  protected set activeLangCode(langCode: string) {
    if (langCode) {
      this.languageService.setLanguage(langCode);
    }
  }
}
