import { Component, HostBinding, Input } from '@angular/core'

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.css'],
})
export class SvgIconComponent {
  @HostBinding('style.-webkit-mask-image')
  public _path!: string

  @Input()
  public set path(filePath: string) {
    this._path = `url("${filePath}")`
  }
}
