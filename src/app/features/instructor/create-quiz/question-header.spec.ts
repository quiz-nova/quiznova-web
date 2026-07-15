import { ComponentFixture, TestBed } from '@angular/core/testing';

import { vi } from 'vitest';

import { Question, QuestionType } from '@shared/models/quiz/question.model';

import { QuestionHeader } from './question-header';

describe('QuestionHeader Component', () => {
  let component: QuestionHeader;
  let fixture: ComponentFixture<QuestionHeader>;

  const mockQuestion: Question = {
    id: 'q-123',
    questionText: 'Test Question',
    marks: 3,
    type: QuestionType.Mcq,
    quizId: '',
    displayOrder: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionHeader);
    component = fixture.componentInstance;
  });

  it('should render the correct question number based on index input', () => {
    fixture.componentRef.setInput('index', 0); // Index 0 -> Q1
    fixture.componentRef.setInput('question', mockQuestion);

    fixture.detectChanges();

    const headerElement = fixture.nativeElement.querySelector('h3');
    expect(headerElement.textContent).toContain('Q1');
  });

  it('should emit deleteQuestion when delete button is clicked', () => {
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.deleteQuestion, 'emit');

    const deleteBtn = fixture.nativeElement.querySelector('app-delete-button');
    deleteBtn.dispatchEvent(new Event('deleteButtonClicked'));

    expect(emitSpy).toHaveBeenCalledWith('q-123');
  });

  it('should mark form invalid if marks exceed maxMarks', () => {
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.componentRef.setInput('maxMarks', 4);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('#marks');

    inputElement.value = '5';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = (component as any).form;
    expect(form.valid).toBe(false);
    expect(form.controls.marks.hasError('max')).toBe(true);

    const errorComponent = fixture.nativeElement.querySelector('app-field-error');
    expect(errorComponent).toBeTruthy();
    expect(errorComponent.textContent).toContain('Marks must be between 1 and 4');
  });
});
