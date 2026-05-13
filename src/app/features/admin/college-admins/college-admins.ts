import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { AdminService } from '@shared/services/admin.service';

import { AddAdminModal } from './add-admin-modal';
import { DeleteAdminModal } from './delete-admin-modal';
import { EditAdminModal } from './edit-admin-modal';

@Component({
  selector: 'app-college-admins',
  imports: [
    ProgressSpinner,
    AddAdminModal,
    EditAdminModal,
    DeleteAdminModal,
    FormsModule,
    InputText,
    InputNumber,
    NavigationButtons,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Admins</p>
          <h1>Admin Directory</h1>
          <p class="description">Manage administrative users and access ownership.</p>
        </div>
        <app-add-admin-modal (created)="reloadAdmins()"></app-add-admin-modal>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="admin-search">Search</label>
          <input
            id="admin-search"
            pInputText
            class="focus-green-ring"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearchTermChange($event)"
            placeholder="Search by name or email"
          />
        </div>

        <div class="filter-item">
          <label for="page-size">Page size</label>
          <p-inputnumber
            inputId="page-size"
            [(ngModel)]="pageSize"
            (ngModelChange)="onPageSizeChange($event)"
            [min]="1"
            [max]="100"
            [showButtons]="true"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        @if (adminsResource.isLoading()) {
          <div class="table-overlay-spinner">
            <p-progress-spinner ariaLabel="loading"></p-progress-spinner>
          </div>
        }
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (adminsResource.error()) {
              <tr>
                <td colspan="3">
                  <div class="error">
                    <p>Failed to load admin data.</p>
                  </div>
                </td>
              </tr>
            } @else if (!adminsResource.isLoading() && !(adminsResource.value()?.items?.length ?? 0)) {
              <tr>
                <td colspan="3">
                  <p class="feedback">No admins match your filters.</p>
                </td>
              </tr>
            } @else {
              @for (admin of adminsResource.value()?.items ?? []; track admin.adminId) {
                <tr>
                  <td>{{ admin.name }}</td>
                  <td>{{ admin.email }}</td>
                  <td>
                    <div class="actions">
                      <app-edit-admin-modal
                        [admin]="admin"
                        (updated)="reloadAdmins()"
                      ></app-edit-admin-modal>
                      <app-delete-admin-modal
                        [admin]="admin"
                        (deleted)="reloadAdmins()"
                      ></app-delete-admin-modal>
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <p class="page-info">
          Page {{ adminsResource.value()?.pageNumber ?? 1 }} of
          {{ adminsResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          ariaLabel="Admins pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
          [canGoPrevious]="adminsResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="adminsResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
        />
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeAdmins {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);

  constructor() {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: this.searchTerm() || null,
          page: this.pageNumber(),
          size: this.pageSize(),
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  private readonly debouncedSearchTerm = toSignal(
    toObservable(this.searchTerm).pipe(
      map((value) => value?.trim() || ''),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  protected readonly adminsResource = rxResource({
    params: () => ({
      searchTerm: this.debouncedSearchTerm(),
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    }),
    stream: ({ params }) =>
      this.adminService.getAllAdmins({
        searchTerm: params.searchTerm,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      }),
  });

  protected onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.pageNumber.set(1);
  }

  protected onPageSizeChange(value: number | null | undefined): void {
    if (!value || value <= 0) {
      this.pageSize.set(10);
    }
    this.pageNumber.set(1);
  }

  protected goToPreviousPage(): void {
    if (this.adminsResource.value()?.hasPreviousPage) {
      this.pageNumber.update((value) => Math.max(1, value - 1));
    }
  }

  protected goToNextPage(): void {
    if (this.adminsResource.value()?.hasNextPage) {
      this.pageNumber.update((value) => value + 1);
    }
  }

  protected reloadAdmins(): void {
    this.adminsResource.reload();
  }
}
