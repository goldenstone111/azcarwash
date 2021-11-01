import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddREviewPage } from './add-review.page';

describe('AddREviewPage', () => {
  let component: AddREviewPage;
  let fixture: ComponentFixture<AddREviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddREviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddREviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
