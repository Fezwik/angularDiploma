import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortTitle'
})
export class ShortTitlePipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    return value.length > 85 ? value.substring(0, 85) + '...' : value;
  }

}
