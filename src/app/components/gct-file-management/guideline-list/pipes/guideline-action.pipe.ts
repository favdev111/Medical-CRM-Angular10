import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'actionStatus',
})
export class GuidelineActionStatus implements PipeTransform {
  transform(status: string, statusList: string[]): boolean {
    return statusList.includes(status);
  }
}



