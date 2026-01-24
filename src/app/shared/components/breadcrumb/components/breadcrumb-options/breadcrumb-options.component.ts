import { Component, Signal, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-breadcrumb-options',
  imports: [],
  templateUrl: './breadcrumb-options.component.html',
  host: {
    class: 'breadcrumb-options w-full h-full flex items-center justify-center',
  },
})
export class BreadcrumbOptionsComponent {
  template: Signal<TemplateRef<any>> = viewChild.required('render');
}
