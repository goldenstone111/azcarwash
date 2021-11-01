import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BundleModelPage } from './bundle-model.page';

describe('BundleModelPage', () => {
  let component: BundleModelPage;
  let fixture: ComponentFixture<BundleModelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BundleModelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BundleModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
