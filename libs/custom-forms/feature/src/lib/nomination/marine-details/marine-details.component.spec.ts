import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { of } from 'rxjs';
import { NominationService } from '../../nomination.service';

import { MarineDetailsComponent } from './marine-details.component';

const nominationServiceMock = {

  vessels$: of(['vessel-1', 'vessel-2']),

  getVesselLength: jest.fn().mockImplementation((vessel:string): string => {
    if (vessel === 'vessel-1') {
      return '100 ft';
    } else if(vessel === 'vessel-2') {
      return '200 ft';
    } else {
      return '';
    }
  })
}  

describe('MarineDetailsComponent', () => {
  let component: MarineDetailsComponent;
  let fixture: ComponentFixture<MarineDetailsComponent>;
  let debugElement: DebugElement;
  let nominationService: NominationService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        MarineDetailsComponent
      ],
      providers: [
        {
          provide: NominationService,
          useValue: nominationServiceMock
        },
        ReactiveFormsModule,
        DropdownModule,
        PanelModule,
        InputTextModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineDetailsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nominationService = TestBed.inject(NominationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createForm method should create the formGroup and set default control values to null', () => {
    const formGroupValue = {
      vessel: null,
      length: null
    }

    expect(component.formGroup).toBeUndefined();

    component.createForm();

    const formGroup = component.formGroup;
    expect(formGroup).toBeDefined();
    expect(formGroup.value).toEqual(formGroupValue);
  });

  // it('should show vesseloptions using waitForAsync', waitForAsync(() => {
  //   // whenStable() is a promise that resolves when all pending async tasks 
  //   // are done and microtask and callback queue are empty
  //   fixture.whenStable().then(()=>{
  //     fixture.detectChanges();
  //     // we could also use the directive() method to get the element
  //     // const vesselEle:Dropdown = debugElement.query(By.directive(Dropdown)).componentInstance;
  //     const vesselElement: Dropdown = debugElement.query(By.css('p-dropdown')).componentInstance;
  //     expect(vesselElement.options.length).toBe(2);
  //   })
  // }));

  // it('Should show Vesseloptions using fakeAsync',fakeAsync(()=>{
  //   flush();
  //   //OR
  //   // tick();
  //   fixture.detectChanges();
  //   const vesselElement:Dropdown = debugElement.query(By.css('p-dropdown')).componentInstance;
  //   expect(vesselElement.options.length).toBe(2);    
  // }));

  it('updateVesselLength method should get length from service and set the formControl length value', () => {
    component.createForm();
    const formGroup = component.formGroup;
    expect(formGroup.controls['length']).toBeDefined();

    // checking before running updateVesselLength method
    expect(formGroup.controls['length']?.value).toBe(null);

    component.updateVesselLength('vessel-1');

    // checking after running updateVesselLength method
    expect(formGroup.controls['length']?.value).toBe('100 ft');
    expect(nominationService.getVesselLength).toHaveBeenCalledTimes(1);

  });

});
