import { trigger, transition, animate, style, state } from '@angular/animations';

export const animateDrawerButton = trigger('openClose', [
  state('open', style({ right: '200px' })),
  state('close', style({ right: '0' })),
  transition('open => closed', [animate('200ms ease-out')]),
  transition('closed => open', [animate('200ms ease-out')])
]);

export const detailExpand = trigger('detailExpand', [
  state('collapsed', style({height: '0px', minHeight: '0'})),
  state('expanded', style({height: '*'})),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const detailExpandArrow = trigger('detailExpandArrow', [
  state('collapsed', style({transform: 'rotate(0deg)'})),
  state('expanded', style({transform: 'rotate(90deg)'})),
  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);
