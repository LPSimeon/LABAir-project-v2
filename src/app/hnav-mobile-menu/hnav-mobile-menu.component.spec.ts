import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HnavMobileMenuComponent } from './hnav-mobile-menu.component';

describe('HnavMobileMenuComponent', () => {
  let component: HnavMobileMenuComponent;
  let fixture: ComponentFixture<HnavMobileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HnavMobileMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HnavMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
