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
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.componentRef.setInput('maxMarks', 10);
    fixture.componentRef.setInput('index', 0);
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

    const deleteSpy = vi.fn();
    component.deleteQuestion.subscribe(deleteSpy);

    const deleteBtn =
      fixture.nativeElement.querySelector('p-button[icon="pi pi-trash"] button') ??
      fixture.nativeElement.querySelector('p-button[icon="pi pi-trash"]');
    deleteBtn.click();

    expect(deleteSpy).toHaveBeenCalledWith('q-123');
  });
});
