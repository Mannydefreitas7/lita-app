import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'pubfilter'
})
export class PubFilterPipe implements PipeTransform {
	transform(value: any[], searchText: string): any[] {
		return value.filter((x:any) =>
			x.name.trim().toLowerCase().startsWith(searchText.trim().toLowerCase()) ||
			x.contextTitle.trim().toLowerCase().startsWith(searchText.trim().toLowerCase())
		)
	}
}