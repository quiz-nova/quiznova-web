import { computed, inject } from '@angular/core';

import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@StoreFeatures/with-request-status.feature';
import { EMPTY, catchError, exhaustMap, forkJoin, switchMap, tap } from 'rxjs';

import { Course } from '@shared/models/course/course.model';
import { Instructor } from '@shared/models/users/instructor.model';
import { Student } from '@shared/models/users/student.model';
import { CoursesService } from '@shared/services/courses.service';
import { EnrollmentService } from '@shared/services/enrollment.service';
import { InstructorService } from '@shared/services/instructor.service';
import { StudentService } from '@shared/services/student.service';

export interface ManageCourseState {
  course: Course | null;
  instructors: Instructor[];
  enrolledStudents: Student[];
  availableStudents: Student[];
  actionError: string | null;
}

const initialState: ManageCourseState = {
  course: null,
  instructors: [],
  enrolledStudents: [],
  availableStudents: [],
  actionError: null,
};

export const ManageCourseStore = signalStore(
  withState<ManageCourseState>(initialState),
  withRequestStatus(),
  withComputed((store) => ({
    instructorOptions: computed(() =>
      store.instructors().map((instructor) => ({
        id: instructor.id,
        name: instructor.name,
      })),
    ),
    availableStudentOptions: computed(() =>
      store.availableStudents().map((student) => ({
        id: student.id,
        name: student.name,
      })),
    ),
  })),
  withMethods((
    store,
    coursesService = inject(CoursesService),
    enrollmentService = inject(EnrollmentService),
    instructorService = inject(InstructorService),
    studentService = inject(StudentService),
  ) => {
    const loadStudentLists = (courseId: string) =>
      forkJoin({
        enrolledStudents: studentService.getAllStudents({
          courseId,
          isEnrolledInCourse: true,
          pageNumber: 1,
          pageSize: 100,
        }),
        availableStudents: studentService.getAllStudents({
          courseId,
          isEnrolledInCourse: false,
          pageNumber: 1,
          pageSize: 100,
        }),
      });

    return {
      loadCourse: rxMethod<string>(
        switchMap((courseId) => {
          patchState(store, {
            course: null,
            instructors: [],
            enrolledStudents: [],
            availableStudents: [],
            actionError: null,
          });
          patchState(store, setPending('loadCourse'));

          return forkJoin({
            course: coursesService.getCourseById(courseId),
            instructors: instructorService.getAllInstructors({ pageNumber: 1, pageSize: 100 }),
            students: loadStudentLists(courseId),
          }).pipe(
            tap(({ course, instructors, students }) => {
              patchState(store, {
                course,
                instructors: instructors.items,
                enrolledStudents: students.enrolledStudents.items,
                availableStudents: students.availableStudents.items,
              });
              patchState(store, setFulfilled('loadCourse'));
            }),
            catchError(() => {
              patchState(store, setError('loadCourse', 'Failed to load course management data.'));
              return EMPTY;
            }),
          );
        }),
      ),

      updateInstructor: rxMethod<{ instructorId: string; onSuccess?: () => void }>(
        exhaustMap(({ instructorId, onSuccess }) => {
          const previousCourse = store.course();
          if (!previousCourse) {
            return EMPTY;
          }

          const instructorName = instructorId
            ? (store.instructors().find((instructor) => instructor.id === instructorId)
              ?.name ?? '')
            : '';

          patchState(store, {
            course: { ...previousCourse, instructorId, instructorName },
            actionError: null,
          }, setPending('updateInstructor'));

          return coursesService.updateCourseInstructor(previousCourse.courseId, { instructorId }).pipe(
            tap((updatedCourse) => {
              patchState(store, { course: updatedCourse }, setFulfilled('updateInstructor'));
              onSuccess?.();
            }),
            catchError(() => {
              patchState(store, {
                course: previousCourse,
                actionError: 'Failed to update instructor.',
              }, setError('updateInstructor', 'Failed to update instructor.'));
              return EMPTY;
            }),
          );
        }),
      ),

      enrollStudent: rxMethod<{ studentId: string; onSuccess?: () => void }>(
        exhaustMap(({ studentId, onSuccess }) => {
          const course = store.course();
          const student = store.availableStudents().find((item) => item.id === studentId);
          if (!course || !student) {
            return EMPTY;
          }

          const previousAvailableStudents = store.availableStudents();
          const previousEnrolledStudents = store.enrolledStudents();

          patchState(store, {
            availableStudents: previousAvailableStudents.filter((item) => item.id !== studentId),
            enrolledStudents: [...previousEnrolledStudents, student],
            course: {
              ...course,
              enrolledStudentsCount: course.enrolledStudentsCount + 1,
            },
            actionError: null,
          }, setPending('enrollStudent'));

          return enrollmentService.enrollStudent(course.courseId, studentId).pipe(
            tap(() => {
              patchState(store, setFulfilled('enrollStudent'));
              onSuccess?.();
            }),
            catchError(() => {
              patchState(store, {
                availableStudents: previousAvailableStudents,
                enrolledStudents: previousEnrolledStudents,
                course,
                actionError: 'Failed to enroll student.',
              }, setError('enrollStudent', 'Failed to enroll student.'));
              return EMPTY;
            }),
          );
        }),
      ),

      removeStudent: rxMethod<{ studentId: string; onSuccess?: () => void }>(
        exhaustMap(({ studentId, onSuccess }) => {
          const course = store.course();
          const student = store.enrolledStudents().find((item) => item.id === studentId);
          if (!course || !student) {
            return EMPTY;
          }

          const previousAvailableStudents = store.availableStudents();
          const previousEnrolledStudents = store.enrolledStudents();

          patchState(store, {
            availableStudents: [...previousAvailableStudents, student],
            enrolledStudents: previousEnrolledStudents.filter((item) => item.id !== studentId),
            course: {
              ...course,
              enrolledStudentsCount: Math.max(0, course.enrolledStudentsCount - 1),
            }
          }, setPending('removeStudent'));

          return enrollmentService.removeStudent(course.courseId, studentId).pipe(
            tap(() => {
              patchState(store, setFulfilled('removeStudent'));
              onSuccess?.();
            }),
            catchError(() => {
              patchState(store, {
                availableStudents: previousAvailableStudents,
                enrolledStudents: previousEnrolledStudents,
                course
              }, setError('removeStudent', 'Failed to remove student.'));
              return EMPTY;
            }),
          );
        }),
      ),
    };
  }),
);
