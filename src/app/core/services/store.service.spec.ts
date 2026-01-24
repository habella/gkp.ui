/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { StoreService } from './store.service';

describe('Service: Store', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreService]
    });
  });

  it('should ...', inject([StoreService], (service: StoreService<any>) => {
    expect(service).toBeTruthy();
  }));
});
