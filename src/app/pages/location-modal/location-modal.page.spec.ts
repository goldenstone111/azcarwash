import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationModalPage } from './location-modal.page';

describe('LocationModalPage', () => {
  let component: LocationModalPage;
  let fixture: ComponentFixture<LocationModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
