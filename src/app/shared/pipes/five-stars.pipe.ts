import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fiveStars'
})
export class FiveStarsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let str = '';
    for (let i = 0; i < 5; i++){
      if (i < value) {
        str += '<i class="fa fa-star fa-lg"></i>';
      }else {
        str += '<i class="fa fa-star-o fa-lg"></i>';
      }

    }
    // half start
    //'<i class="fa fa-star-half-empty fa-lg"></i>'
    return str;
  }

}
