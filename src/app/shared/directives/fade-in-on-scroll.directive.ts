import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

@Directive({
  selector: '[appFadeInOnScroll], .fade-in',
  standalone: true,
})
export class FadeInOnScrollDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef).nativeElement;
  private observer!: IntersectionObserver;

  threshold = input<number>(0.2);

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.classList.add('appear');
          this.observer.unobserve(this.el);
        }
      },
      { threshold: this.threshold() },
    );

    this.observer.observe(this.el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
