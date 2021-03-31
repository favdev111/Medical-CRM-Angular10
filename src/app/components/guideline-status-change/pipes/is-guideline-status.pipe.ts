import { Pipe, PipeTransform } from '@angular/core';
import { GuidelineStatus } from 'src/app/models/enums/guideline-status';

@Pipe({
  name: 'isGuidelineStatus'
})
export class IsGuidelineStatusPipe implements PipeTransform {
  transform(currentStatus: GuidelineStatus, statusToCheck: string): boolean {
    if (currentStatus) {
      return currentStatus.toString() === statusToCheck;
    }
    return false;
  }
}