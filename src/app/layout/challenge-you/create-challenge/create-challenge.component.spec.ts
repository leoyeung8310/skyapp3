import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChallengeComponent } from './create-challenge.component';

describe('CreateChallengeComponent', () => {
  let component: CreateChallengeComponent;
  let fixture: ComponentFixture<CreateChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
