import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OngoingPage } from './ongoing.page';

describe('OngoingPage', () => {
  let component: OngoingPage;
  let fixture: ComponentFixture<OngoingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
