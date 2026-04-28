import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProgressSpinner } from 'primeng/progressspinner';

import { AdminService } from '@shared/services/admin.service';

import { AddAdminModal } from './add-admin-modal';
import { DeleteAdminModal } from './delete-admin-modal';
import { EditAdminModal } from './edit-admin-modal';

@Component({
  selector: 'app-college-admins',
  imports: [ProgressSpinner, AddAdminModal, EditAdminModal, DeleteAdminModal],
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

      @if (adminsResource.isLoading()) {
        <div class="spinner">
          <p-progress-spinner ariaLabel="loading"/>
        </div>
      } @else if (adminsResource.error()) {
        <div class="error">
          <p>Failed to load admin data.</p>
        </div>
      } @else {
        <div class="table-shell">
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
              @for (admin of adminsResource.value() ?? []; track admin.adminId) {
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
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: `
    .page {
      display: grid;
      gap: 1.5rem;
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
    }

    .eyebrow {
      margin: 0 0 0.25rem;
      color: var(--clr-green-500);
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.75rem);
    }

    .description {
      margin: 0.75rem 0 0;
      color: var(--clr-gray-600);
    }

    .table-shell {
      overflow: auto;
      border: 1px solid var(--clr-gray-200);
      border-radius: var(--radius-md);
      background-color: var(--clr-white);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--clr-gray-200);
    }

    th {
      color: var(--clr-gray-600);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    tbody tr:last-child td {
      border-bottom: 0;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeAdmins {
  private readonly adminService = inject(AdminService);

  protected readonly adminsResource = rxResource({
    stream: () => this.adminService.getAllAdmins(),
  });

  protected reloadAdmins(): void {
    this.adminsResource.reload();
  }
}
