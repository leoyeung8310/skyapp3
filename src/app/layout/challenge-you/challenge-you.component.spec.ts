import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeYouComponent } from './challenge-you.component';

describe('ChallengeYouComponent', () => {
  let component: ChallengeYouComponent;
  let fixture: ComponentFixture<ChallengeYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
