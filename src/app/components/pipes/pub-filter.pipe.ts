import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'pubfilter'
})
export class PubFilterPipe implements PipeTransform {
	transform(value: any[], pubText: string): any[] {
		return value.filter((x:any) =>
			x.name.toLowerCase().trim().startsWith(pubText.toLowerCase().trim()) ||
			x.contextTitle.toLowerCase().trim().startsWith(pubText.toLowerCase().trim()) ||
			x.pubId.toLowerCase().trim().startsWith(pubText.toLowerCase().trim()) ||
			x.id.toString().toLowerCase().trim().startsWith(pubText.toLowerCase().trim())
		)
	}
}