import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'minuteSeconds'
}) 
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    if(minutes === 0) {
      return (value - minutes * 60) +'mins'
    } else if ((value - minutes * 60) != 0) {
      return minutes + 'hr ' + (value - minutes * 60) +'mins';
    } else {
      return minutes + 'hr';
    }
  }

}
