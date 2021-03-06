import { Directive, HostBinding, Input, ElementRef, AfterViewInit, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Directive({
  selector: 'div[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, AfterViewInit {

  @HostBinding('style.background-image') backgroundImage: SafeStyle;
  @HostBinding('style.opacity') opacity: string;
  @HostBinding('class.loader') public get isLoader(): boolean { return this.isLoading; }

  @Input() offset: number;
  @Input() src: string;

  private isLoading = false;
  private options: IntersectionObserverInit = {
    rootMargin: '0px 0px 200px 0px'
  };

  constructor(
    private el: ElementRef,
    private sanitization: DomSanitizer,
    private renderer: Renderer2) {}

  ngOnInit() {
    this.setOffset();
  }

  ngAfterViewInit() {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  private canLazyLoad(): boolean {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({isIntersecting}) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    }, this.options);
    obs.observe(this.el.nativeElement);
  }

  private loadImage(): void {
    const img: HTMLImageElement = this.renderer.createElement('img') as HTMLImageElement;
    img.src = this.src;
    this.isLoading = true;
    img.onload = () => {
      this.opacity = '1';
      this.backgroundImage = this.getSanitizedUrl(this.src);
      this.isLoading = false;
    };
  }

  private setOffset(): void {
    if (typeof this.offset === 'number') {
      this.options.rootMargin = `0px 0px ${this.offset}px 0px`;
    }
  }

  private getSanitizedUrl(url: string): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle(`url(${url})`);
  }
}
