import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText'
})
export class ShortTextPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    return value.length > 200 ? value.substring(0, 200) + '...' : value;
  }

}
