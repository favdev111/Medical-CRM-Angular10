import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appRandomColor]'
})
export class RandomColorDirective implements OnInit {

  private readonly HEX_CODES = ['#00B6BE', '#0478DD', '#7008D2', '#E70059', '#DA1318', '#F87315', '#A9EAE7', '#5FB8FF', '#FD88AF', '#FBC123']

  @Input() reviewUserId: number;

  constructor(private _el: ElementRef) { }

  ngOnInit(): void {
    this._el.nativeElement.style.backgroundColor = this.generateColor();
  }

  private generateColor(): string {
    if (this.reviewUserId) {
      const index = this.getFirstDigit(this.reviewUserId % this.HEX_CODES.length);
      return this.HEX_CODES[index];
    }
    return this.HEX_CODES[0];
  }

  private getFirstDigit(x: number): number {
    while (x > 9) {
      x /= 10;
    }
    return x;
  }

}
