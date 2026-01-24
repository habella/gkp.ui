import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardIndex } from './dasboard-index';

describe('DasboardIndex', () => {
  let component: DasboardIndex;
  let fixture: ComponentFixture<DasboardIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasboardIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
