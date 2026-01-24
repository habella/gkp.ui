import { NgTemplateOutlet } from '@angular/common'
import { Component, contentChild, input, OnInit } from '@angular/core'
import { BreadcrumbOptionsComponent } from './components/breadcrumb-options/breadcrumb-options.component'

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: '',
  imports: [NgTemplateOutlet],
})
export class BreadcrumbComponent implements OnInit {
  title = input.required<string>()
  subtitle = input<string>('')
  type = input<'md' | 'lg'>('lg')
  showBackButton = input<boolean>(false)
  options = contentChild(BreadcrumbOptionsComponent)

  constructor() {}

  ngOnInit() {}

  goToBack = () => {
    window.history.back()
  }
}
