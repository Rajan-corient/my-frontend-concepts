import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { NominationHeaderComponent } from './nomination-header.component';

fdescribe('NominationHeaderComponent', () => {
  let component: NominationHeaderComponent;
  let fixture: ComponentFixture<NominationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominationHeaderComponent,  ],
      imports: [ReactiveFormsModule, InputTextModule, DropdownModule, CalendarModule],
      providers: [DatePipe]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test a form group element count for create mode', () => {
    component.isReadOnly = false;
    fixture.detectChanges();
    const formElement = fixture.debugElement.nativeElement.querySelector('.nomination-header');
    const controlElements = formElement.querySelectorAll("div input, p p-dropdown, p p-calendar");
    expect(controlElements.length).toBe(6)
  });

  it('Test a form group element count view mode', () => {
    component.isReadOnly = true;
    console.log(component.isReadOnly);
    fixture.detectChanges();
    const formElement = fixture.debugElement.nativeElement.querySelector('.nomination-header');
    const controlElements = formElement.querySelectorAll("div label.readonly-label");
    expect(controlElements.length).toBe(7)
  });
});
