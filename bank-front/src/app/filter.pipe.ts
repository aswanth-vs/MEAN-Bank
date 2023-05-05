import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(transactions: any[], search: string, propertyName: string): any[] {
    const result: any = [];
    if (!transactions || search == '' || propertyName == '') {
      return transactions;
    }
    transactions.forEach((item: any) => {
      if (
        item[propertyName]
          .trim()
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      ) {
        result.push(item);
      }
    });
    return result;
  }
}
