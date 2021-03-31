import { Pipe, PipeTransform } from '@angular/core';
import { reviewStatusLookup } from 'src/app/models/enums/review-status';

@Pipe({
  name: 'reviewStatus'
})
export class ReviewStatusPipe implements PipeTransform {
  transform(status: string): string {
    return reviewStatusLookup(status);
  }
}