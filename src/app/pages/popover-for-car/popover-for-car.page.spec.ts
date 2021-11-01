import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverForCarPage } from './popover-for-car.page';

describe('PopoverForCarPage', () => {
  let component: PopoverForCarPage;
  let fixture: ComponentFixture<PopoverForCarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverForCarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverForCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
