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
import { TableModule, TablePageEvent } from 'primeng/table';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import { RoleDashboardHeader } from '@shared/components/role-dashboard-header/role-dashboard-header';
import { Student } from '@shared/models/users/student.model';
import { StudentService } from '@shared/services/student.service';

import { AddStudentModal } from './add-student-modal';
import { DeleteStudentModal } from './delete-student-modal';
import { EditStudentModal } from './edit-student-modal';

@Component({
  selector: 'app-college-students',
  imports: [
    TableModule,
    SkeletonModule,
    AddStudentModal,
    EditStudentModal,
    DeleteStudentModal,
    FormsModule,
    InputText,
    InputNumber,
    RoleDashboardHeader,
  ],
  template: `
    <section class="page">
      <header class="page-header">
        <app-role-dashboard-header
          title="Student Roster"
          description="A simple roster view of enrollment load."
        />
        <app-add-student-modal (created)="reloadStudents()"></app-add-student-modal>
      </header>

      <div class="filters-grid">
        <div class="filter-item">
          <label for="student-search">Search</label>
          <input
            class="focus-green-ring"
            id="student-search"
            [(ngModel)]="searchTerm"
            (ngModelChange)="pageNumber.set(1)"
            pInputText
            placeholder="Search by name or email"
          />
        </div>

        <div class="filter-item">
          <label for="enrolled-count">Enrolled courses</label>
          <p-inputnumber
            [(ngModel)]="enrolledCoursesCount"
            [min]="0"
            [showButtons]="true"
            (ngModelChange)="pageNumber.set(1)"
            inputId="enrolled-count"
            placeholder="Any"
          ></p-inputnumber>
        </div>
      </div>

      <div class="table-shell">
        <p-table
          [value]="tableData()"
          [tableStyle]="{ 'min-width': '50rem' }"
          [paginator]="true"
          [rows]="pageSize()"
          [totalRecords]="studentsResource.value()?.totalCount ?? 0"
          [lazy]="true"
          [first]="(pageNumber() - 1) * pageSize()"
          [showFirstLastIcon]="false"
          [rowsPerPageOptions]="[10, 20, 50]"
          (onPage)="onPageChange($event)"
        >
          <ng-template #header>
            <tr>
              <th>Name</th>
              <th>Enrolled Courses</th>
              <th style="width: 8rem">Actions</th>
            </tr>
          </ng-template>
          <ng-template #body let-student>
            <tr>
              @if (studentsResource.isLoading()) {
                <td><p-skeleton width="60%" height="1.5rem" /></td>
                <td><p-skeleton width="40%" height="1.5rem" /></td>
                <td><p-skeleton width="4rem" height="1.5rem" /></td>
              } @else {
                <td>{{ student.personalInformation.name }}</td>
                <td>{{ student.enrolledCoursesCount }}</td>
                <td>
                  <div class="actions">
                    <app-edit-student-modal
                      [student]="student"
                      (updated)="reloadStudents()"
                    ></app-edit-student-modal>
                    <app-delete-student-modal
                      [student]="student"
                      (deleted)="reloadStudents()"
                    ></app-delete-student-modal>
                  </div>
                </td>
              }
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td colspan="3">
                @if (studentsResource.error()) {
                  <div class="error">
                    <p>Failed to load student data.</p>
                  </div>
                } @else {
                  <p class="feedback">No students match your filters.</p>
                }
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </section>
  `,
  styleUrl: '../shared/college-tables-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollegeStudents {
  private readonly studentService = inject(StudentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly searchTerm = signal(this.route.snapshot.queryParams['search'] || '');
  protected readonly pageNumber = signal(Number(this.route.snapshot.queryParams['page']) || 1);
  protected readonly pageSize = signal(Number(this.route.snapshot.queryParams['size']) || 10);
  protected readonly tableData = computed<Student[]>(() => {
    if (this.studentsResource.isLoading()) {
      return Array.from<unknown, Student>(
        { length: this.pageSize() },
        (_, i) =>
          ({
            id: `skeleton-${i}`,
          }) as unknown as Student,
      );
    }
    if (this.studentsResource.error()) {
      return [];
    }
    return this.studentsResource.value()?.items ?? [];
  });
  protected readonly enrolledCoursesCount = signal<number | null>(
    this.route.snapshot.queryParams['enrolled']
      ? Number(this.route.snapshot.queryParams['enrolled'])
      : null,
  );

  constructor() {
    effect(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: this.searchTerm() || null,
          page: this.pageNumber(),
          size: this.pageSize(),
          enrolled: this.enrolledCoursesCount(),
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

  protected readonly studentsResource = rxResource({
    params: () => ({
      searchTerm: this.debouncedSearchTerm(),
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
      enrolledCoursesCount: this.enrolledCoursesCount(),
    }),
    stream: ({ params }) =>
      this.studentService.getAllStudents({
        searchTerm: params.searchTerm,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        enrolledCoursesCount: params.enrolledCoursesCount ?? undefined,
      }),
  });

  protected onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.pageNumber.set(1);
  }

  protected onEnrolledCoursesCountChange(value: number | null | undefined): void {
    this.enrolledCoursesCount.set(value ?? null);
    this.pageNumber.set(1);
  }

  protected onPageChange(event: TablePageEvent): void {
    this.pageNumber.set(event.first / event.rows + 1);
    this.pageSize.set(event.rows);
  }

  protected reloadStudents(): void {
    this.studentsResource.reload();
  }
}
