import { NgTemplateOutlet } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThreeMenuItem } from './index.ds';

@Component({
  selector: 'three-menu',
  standalone: true,
  templateUrl: './three-menu.component.html',
  styleUrls: ['./three-menu.component.css'],
  imports: [NgTemplateOutlet, AngularSvgIconModule],
})
export class ThreeMenuComponent implements OnInit {
  icon = input<string>();
  items = input.required<ThreeMenuItem[]>();

  onLeafClick = output<ThreeMenuItem>();

  constructor() {}

  ngOnInit() {}

  toggle(item: ThreeMenuItem) {
    item.expanded = !item.expanded;
  }
}
