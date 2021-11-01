import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyCarsPage } from './my-cars.page';

describe('MyCarsPage', () => {
  let component: MyCarsPage;
  let fixture: ComponentFixture<MyCarsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCarsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyCarsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
