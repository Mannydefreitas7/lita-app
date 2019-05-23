import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class ListFilterPipe implements PipeTransform {
	transform(value: any[], searchText: string): any[] {
		return value.filter((x:any) => x.fname.trim().toLowerCase().startsWith(searchText.trim().toLowerCase()) || x.lname.trim().toLowerCase().startsWith(searchText.trim().toLowerCase()))
	}
}