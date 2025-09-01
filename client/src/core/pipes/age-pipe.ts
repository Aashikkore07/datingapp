import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(value: string): number {
    const today = new Date();
    const dob = new Date(value);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = dob.getMonth() - today.getMonth();
    if (monthDiff < 0 || (monthDiff == 0 && dob.getDate() > today.getDate())) age--;
    return age;
  }
}
