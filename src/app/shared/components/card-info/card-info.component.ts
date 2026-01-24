import { Component, input, OnInit, output } from '@angular/core'
import { AngularSvgIconModule } from 'angular-svg-icon'

@Component({
  selector: 'app-card-info',
  standalone: true,
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  imports: [AngularSvgIconModule],
})
export class CardInfoComponent implements OnInit {
  icon = input.required<string>()
  message = input.required<string>()
  type = input.required<string>()
  onAdd = output()

  add() {
    this.onAdd.emit()
  }
  constructor() {}

  ngOnInit() {}
}
