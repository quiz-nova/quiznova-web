import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { NavigationButtons } from '@shared/components/navigation-buttons/navigation-buttons';
import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { User } from '@shared/models/users/user.model';
import { AdminService } from '@shared/services/admin.service';

import { AddAdminModal } from './add-admin-modal';
import { DeleteAdminModal } from './delete-admin-modal';
import { EditAdminModal } from './edit-admin-modal';

@Component({
  selector: 'app-college-admins',
  imports: [
    TableModule,
    SkeletonModule,
    AddAdminModal,
    EditAdminModal,
    DeleteAdminModal,
    FormsModule,
    InputText,
    InputNumber,
    NavigationButtons,
    RoleDashboardHeader,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          title="Admin Directory"
          description="Manage administrative users and access ownership."
        />
        <app-add-admin-modal (created)="reloadAdmins()"></app-add-admin-modal>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="admin-search">Search</label>
          <input
            class="focus-green-ring"
            id="admin-search"
            [(ngModel)]="searchTerm"
            (ngModelChange)="pageNumber.set(1)"
            pInputText
            placeholder="Search by name or email"
          />
        </div>

        <div class="filter-item">
          <label for="page-size">Page size</label>
          <p-inputnumber
            [(ngModel)]="pageSize"
            [min]="1"
            [max]="100"
            [showButtons]="true"
            (ngModelChange)="onPageSizeChange($event)"
            inputId="page-size"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        <p-table [value]="tableData()" [tableStyle]="{ 'min-width': '50rem' }">
          <ng-template #header>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th style="width: 8rem">Actions</th>
            </tr>
          </ng-template>
          <ng-template #body let-admin>
            <tr>
              @if (adminsResource.isLoading()) {
                <td><p-skeleton width="60%" height="1.5rem" /></td>
                <td><p-skeleton width="80%" height="1.5rem" /></td>
                <td><p-skeleton width="4rem" height="1.5rem" /></td>
              } @else {
                <td>{{ admin.personalInformation.name }}</td>
                <td>{{ admin.personalInformation.email }}</td>
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
              }
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="3">
                @if (adminsResource.error()) {
                  <div class="error">
                    <p>Failed to load admin data.</p>
                  </div>
                } @else {
                  <p class="feedback">No admins match your filters.</p>
                }
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <div class="pagination-row">
        <p class="page-info">
          Page {{ adminsResource.value()?.pageNumber ?? 1 }} of
          {{ adminsResource.value()?.totalPages ?? 1 }}
        </p>
        <app-navigation-buttons
          [canGoPrevious]="adminsResource.value()?.hasPreviousPage ?? false"
          [canGoNext]="adminsResource.value()?.hasNextPage ?? false"
          (previousButtonClicked)="goToPreviousPage()"
          (nextButtonClicked)="goToNextPage()"
          ariaLabel="Admins pagination"
          previousLabel="Previous page"
          nextLabel="Next page"
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
  protected readonly tableData = computed<User[]>(() => {
    if (this.adminsResource.isLoading()) {
      return Array.from<unknown, User>({ length: this.pageSize() }, (_, i) => ({
        id: `skeleton-${i}`,
      } as unknown as User));
    }
    if (this.adminsResource.error()) {
      return [];
    }
    return this.adminsResource.value()?.items ?? [];
  });

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
