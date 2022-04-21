import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiContainerComponent } from './di-container.component';

describe('DiContainerComponent', () => {
  let component: DiContainerComponent;
  let fixture: ComponentFixture<DiContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
