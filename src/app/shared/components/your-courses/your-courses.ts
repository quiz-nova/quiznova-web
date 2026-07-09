import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ROLE_DEFINITIONS } from '@Core/config/role.config';
import { AuthService } from '@Features/auth/auth.service';

import { UserRole } from '@shared/models/users/user-role.model';
import { CoursesService } from '@shared/services/courses.service';
import { EnrollmentService } from '@shared/services/enrollment.service';

interface SidebarCourse {
  id: string;
  name: string;
}

@Component({
  selector: 'app-your-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar-container">
      <h3 class="sidebar-title">Your Courses</h3>
      @if (loading()) {
        <div class="loading-state">
          <i class="fa-solid fa-spinner fa-spin"></i> Loading courses...
        </div>
      } @else if (courses().length === 0) {
        <div class="empty-state">No courses found.</div>
      } @else {
        <ul class="course-list">
          @for (course of courses(); track course.id) {
            <li class="course-item">
              <a
                class="course-link"
                [routerLink]="[baseRoute(), course.id]"
                routerLinkActive="active"
              >
                <div class="course-avatar">
                  {{ course.name.charAt(0).toUpperCase() }}
                </div>
                <span class="course-name">{{ course.name }}</span>
              </a>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--clr-white);
      padding: 1.5rem 1rem;
      color: var(--clr-blue-900);
    }

    .sidebar-title {
      font-size: var(--fs-500);
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      color: var(--clr-green-600);
      padding-left: 0.5rem;
    }

    .loading-state,
    .empty-state {
      padding: 1.5rem;
      text-align: center;
      color: var(--clr-gray-600);
      font-size: var(--fs-300);
    }

    .course-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .course-list::-webkit-scrollbar {
      width: 6px;
    }

    .course-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .course-list::-webkit-scrollbar-thumb {
      background: var(--clr-gray-200);
      border-radius: var(--radius-sm);
    }

    .course-item {
      width: 100%;
    }

    .course-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius-md);
      color: var(--clr-gray-600);
      text-decoration: none;
      transition: all 0.25s var(--ease-standard);
      border: 1px solid transparent;
    }

    .course-link:hover {
      background: var(--clr-green-50);
      color: var(--clr-green-600);
      transform: translateX(2px);
    }

    .course-link.active {
      background: var(--clr-green-100);
      border-color: var(--clr-green-200);
      color: var(--clr-green-800);
    }

    .course-avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--clr-green-400);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: var(--fs-300);
    }

    .course-name {
      font-size: var(--fs-400);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
})
export class YourCourses implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly coursesService = inject(CoursesService);
  private readonly enrollmentService = inject(EnrollmentService);

  readonly courses = signal<SidebarCourse[]>([]);
  readonly loading = signal<boolean>(true);

  protected readonly baseRoute = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '/';
    return ROLE_DEFINITIONS[user.role].actionRouteLinks?.['Course Chat'] ?? '/';
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.loading.set(false);
      return;
    }

    if (user.role === UserRole.student) {
      this.enrollmentService.getEnrollments(user.id).subscribe({
        next: (enrollments) => {
          this.courses.set(
            enrollments.map((e) => ({
              id: e.courseId,
              name: e.courseName,
            })),
          );
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        },
      });
    } else if (user.role === UserRole.instructor) {
      this.coursesService.getInstructorCourses(user.id).subscribe({
        next: (res) => {
          this.courses.set(
            res.map((c) => ({
              id: c.id,
              name: c.courseName,
            })),
          );
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }
}
