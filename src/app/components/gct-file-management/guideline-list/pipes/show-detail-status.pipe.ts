import { Pipe, PipeTransform } from '@angular/core';
import { GuidelineVersion } from 'src/app/models/dto/guideline-version';

@Pipe({
  name: 'showStatusDetail'
})
export class ShowStatusDetailPipe implements PipeTransform {
  transform(element: GuidelineVersion, latestVersionId: number): boolean {
    return element.id === latestVersionId && element.reviewUsers !== null;
  }
}