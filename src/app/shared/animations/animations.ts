import { trigger, transition, animate, style, state } from '@angular/animations';

export const detailExpand = trigger('detailExpand', [
  state('collapsed, void', style({ height: '0px', minHeight: '0' })),
  state('expanded', style({height: '*'})),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const detailExpandArrow = trigger('detailExpandArrow', [
  state('collapsed', style({ transform: 'rotate(0deg)' })),
  state('expanded', style({ transform: 'rotate(90deg)' })),
  transition('* <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);
