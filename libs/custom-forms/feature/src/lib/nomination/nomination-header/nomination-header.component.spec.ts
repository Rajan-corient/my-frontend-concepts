import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';

import { NominationHeaderComponent } from './nomination-header.component';
import { NominationService } from '../../nomination.service';
import { mockedMasterData } from '../../master-data.service.spec';
import { asyncScheduler, BehaviorSubject, defer, firstValueFrom, Observable, of, skip, take } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestScheduler } from 'rxjs/testing';

class NominationServiceMock {

  private customerSubject  = new BehaviorSubject<string[]>([]);
  customers$ = this.customerSubject.asObservable();

  private contractSubject= new BehaviorSubject<string[]> ([]);
  contracts$ = this.contractSubject.asObservable();

  private typeSubject  = new BehaviorSubject<string[]>([]);
  types$ = this.typeSubject.asObservable();

  assetGroup$: Observable<string[]> = of(mockedMasterData.assetGroup);

  vessels$: Observable<string[]> = of(['vessel-1', 'vessel-2']);
  
  filterCustomers = jest.fn().mockImplementation((assetGroup: string) => {
    switch (assetGroup) {
      case 'AssetGroup-1':
        this.customerSubject.next(['Customer-1']);
        break;

      case 'AssetGroup-2':
        this.customerSubject.next(['Customer-2']);
        break;

      case 'AssetGroup-3':
        this.customerSubject.next(['Customer-3']);
        break;  

      default:
        this.customerSubject.next([]);
        break;
    }
  });

  filterContracts = jest.fn().mockImplementation((customer:string, startDate:Date, endDate:Date) => {
    switch (customer) {
      case 'Customer-1':
        this.contractSubject.next(['Contract-1']);
        break;

      case 'Customer-2':
        this.contractSubject.next(['Contract-2']);
        break;

      default:
        this.customerSubject.next([]);
        break;
    }
  });


  filterTypes = jest.fn().mockImplementation((contract: string) => {
    switch (contract) {
      case 'Contract-1':
        this.typeSubject.next(['Marine']);
        break;

      case 'Contract-2':
        this.typeSubject.next(['Transport']);
        break;

      default:
        this.typeSubject.next([]);
        break;
    }
  });

  getVesselLength = jest.fn().mockImplementation((vessel:string): string => {
    if (vessel === 'vessel-1') {
      return '100 ft';
    } else if(vessel === 'vessel-2') {
      return '200 ft';
    } else {
      return '';
    }
  });

}

describe('NominationHeaderComponent', () => {
  let component: NominationHeaderComponent;
  let fixture: ComponentFixture<NominationHeaderComponent>;
  let nominationService: NominationService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        NominationHeaderComponent  
      ],
      imports: [
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        CalendarModule,
        PanelModule,
        ButtonModule
      ],
      providers: [
        DatePipe,
        {
          provide: NominationService,
          useClass: NominationServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominationHeaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
    nominationService = TestBed.inject(NominationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createForm method should create formGroup and set default control values to null', () => {
    const formGroupValue = {
      assetGroup: null,
      customer: null,
      startDate: null,
      endDate: null,
      contract: null,
      type: null,
      vessel: null,
    }
    //component.createForm();
    // createForm method gets triggered automatically as we are
    // calling detectChanges in beforeEach block
    const formGroup = component.formGroup;
    expect(formGroup).toBeDefined();
    expect(formGroup.value).toEqual(formGroupValue);
  });

  it('should count formGroup controls', () => {
    console.log(component.formGroup.value);
    const group = component.formGroup;
    const controlCount = Object.keys(group.controls).length;
    expect(controlCount).toBe(7);
  });

  it('when setting the value of the assetgroup via setValue and it should update customer options and reset the customer value to null', (done) => {

    // setting assetGroup value using setValue method
    component.formGroup.controls?.['assetGroup'].setValue('AssetGroup-1');
    fixture.detectChanges();
    
    expect(component.formGroup?.['controls']?.['assetGroup'].value).toBe('AssetGroup-1');

    expect(nominationService.filterCustomers).toHaveBeenCalledTimes(1);

    // checking the value of customer controls
    expect(component.formGroup?.['controls']?.['customer'].value).toBe(null);

    // checking the options for customer controls
    nominationService.customers$.subscribe((customers:string[]) => {
      try {
        expect(customers.length).toBe(1);
        expect(customers).toEqual(['Customer-1']);
        done();
      } catch (error) {
        done(error);
      }
    })
  });

  it('when setting the value of the customer, startDate, EndDate via setValue it should update contract options and reset the contract value to null', (done) => {

    component.formGroup.controls?.['assetGroup'].setValue('AssetGroup-1');
    component.formGroup.controls?.['customer'].setValue('Customer-1');
    component.formGroup.controls?.['startDate'].setValue(new Date());
    component.formGroup.controls?.['endDate'].setValue(new Date());
    fixture.detectChanges();
 
    // ensures that filterCustomers and filterContracts mock method is been called
    expect(nominationService.filterCustomers).toBeCalled();
    expect(nominationService.filterContracts).toBeCalled();

    // checking the value of contract controls
    expect(component.formGroup?.['controls']?.['contract'].value).toBe(null);

    // Checking the options for contract controls
    nominationService.contracts$.subscribe((contracts:string[])=>{
      try {
        expect(contracts.length).toBe(1);
        expect(contracts).toEqual(['Contract-1']);
        done();
      } catch (error) {
        done(error);
      }
    });
  });


  it('when setting the value of the customer only (startDate and EndDate are not there)  via setValue it should not update    contract options but reset the contract value to null', () => {

      component.formGroup.controls?.['customer'].setValue('Customer-1');
      fixture.detectChanges();

      // checking the value of contract control
      expect(component.formGroup?.['controls']?.['contract'].value).toBe(null);

      // Checking filter contracts have been called or not
      expect(nominationService.filterContracts).not.toHaveBeenCalled();
    })

  it('we selected AssetGroup-1 and then we selected Customer-1, but now we want to select AssetGroup-2, as Customer depends on AssetGroup, so it should reset the customer value and update its options too based on AssetGroup-2 --using take()',
  (done) => {

    component.formGroup.controls?.['assetGroup'].setValue('AssetGroup-1');
    fixture.detectChanges();

    // using take(1) operator to take only first observable value and then complete the observable
    nominationService.customers$.pipe(take(1)).
    subscribe((customers:string[])=>{
      try {
        expect(customers.length).toBe(1);
        expect(customers).toEqual(['Customer-1'])
      } catch (error) {
        done(error);
      }
    })

    component.formGroup.controls?.['customer'].setValue('Customer-1');
    fixture.detectChanges();

    expect(component.formGroup?.['controls']?.['customer'].value).toBe('Customer-1');

    // Now we are changing the assetGroup
    component.formGroup.controls?.['assetGroup'].setValue('AssetGroup-2');
    fixture.detectChanges();

    expect(nominationService.filterCustomers).toHaveBeenCalledTimes(2);

    // It should reset customer value
    expect(component.formGroup?.['controls']?.['customer'].value).toBe(null);

    nominationService.customers$.pipe()
    .subscribe((customers:string[])=>{
      try {
        expect(customers.length).toBe(1);
        expect(customers).toEqual(['Customer-2'])
        done();
      } catch (error) {
        done(error);
      }
    })
  })

  it('we selected AssetGroup-1 and then we selected Customer-1, but now we want to select AssetGroup-2, as Customer depends on AssetGroup, so it should reset the customer value and update its options too based on AssetGroup-2 --using counter',
  (done) => {

    let counter = 0;
    
    // using skip(1) to bypass the initial value of behaviour subject
    nominationService.customers$.pipe(skip(1)).subscribe((customers:string[])=>{
      counter += 1;
      try {
        console.log(counter, customers)
        expect(customers.length).toBe(1);
        // using counter to avoid Done being called twice in our assertion
        if (counter == 1) {
          expect(customers).toEqual(['Customer-1']);
        } else {
          expect(customers).toEqual(['Customer-2']);
          done();
        }
      } catch (error) {
        done(error);
      }
    })

    component.formGroup.controls?.['assetGroup'].setValue('AssetGroup-1');
    fixture.detectChanges();

    component.formGroup.controls?.['customer'].setValue('Customer-1');
    fixture.detectChanges();
    expect(component.formGroup?.['controls']?.['customer'].value).toBe('Customer-1');

    expect(nominationService.filterCustomers).toHaveBeenCalledTimes(1);

    // Now we are changing the assetGroup
    component.formGroup.controls?.['assetGroup'].setValue('AssetGroup-2');
    fixture.detectChanges();

    // filterCustomers mrthod will be called twice as we are changing assetGroup value twice
    expect(nominationService.filterCustomers).toHaveBeenCalledTimes(2);

    // It should reset customer value
    expect(component.formGroup?.['controls']?.['customer'].value).toBe(null);
  })

  // it('testing html control element count for create mode', () => {
  //   component.isReadOnly = false;
  //   fixture.detectChanges();
  //   const formElement = fixture.debugElement.nativeElement.querySelector('.layout');
  //   const controlElements = formElement.querySelectorAll("div input, p p-dropdown, p p-calendar");
  //   expect(controlElements.length).toBe(6)
  // });

  // it('tsting html control element count view mode', () => {
  //   component.isReadOnly = true;
  //   console.log(component.isReadOnly);
  //   fixture.detectChanges();
  //   const formElement = fixture.debugElement.nativeElement.querySelector('.read-only-layout');
  //   const controlElements = formElement.querySelectorAll("div label.readonly-label");
  //   expect(controlElements.length).toBe(7)
  // });



});
