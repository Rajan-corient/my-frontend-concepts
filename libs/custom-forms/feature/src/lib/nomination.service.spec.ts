import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, skip } from 'rxjs';
import { ContractService } from './contract.service';
import { MasterDataService } from './master-data.service';
import { NominationService } from './nomination.service';

export const mockedMasterData = {
    assetGroup: ['AssetGroup-1', 'AssetGroup-2', 'AssetGroup-3'],
    customer: [
      { customer: 'Customer-1', assetGroup: 'assetGroup-1' },
      { customer: 'Customer-2', assetGroup: 'assetGroup-2' },
      { customer: 'Customer-3', assetGroup: 'assetGroup-3' },
    ],
    types: [
      { type: 'Marine', contract: 'Contract-1' },
      { type: 'Transport', contract: 'Contract-2' },
    ],
    vessels: [
      { vessel: 'Vessel-1', length: '100 ft' },
      { vessel: 'Vessel-2', length: '200 ft' },
    ],
};

describe('NominationService', () => {
    let service: NominationService;
    let masterDataService: MasterDataService;
    let contractService: ContractService;

    beforeEach(() => {

        const masterDataServiceMock = {
            getAssetGroup: jest.fn(),
            getTypes: jest.fn(),
            getCustomer: jest.fn(),
            getVesselLength: jest.fn(),
            getVessels: jest.fn()
        };

        const contractServiceMock = {
            getContracts: jest.fn()
        };


        TestBed.configureTestingModule({
            providers: [
                {
                    provide: MasterDataService,
                    useValue: masterDataServiceMock
                },
                {
                    provide: ContractService,
                    useValue: contractServiceMock
                }
            ]
        });

        service = TestBed.inject(NominationService);
        masterDataService = TestBed.inject(MasterDataService);
        contractService = TestBed.inject(ContractService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('assetGroup$ getter should return assetGroups', (done) => {
        jest.spyOn(masterDataService, 'getAssetGroup').mockReturnValue(mockedMasterData.assetGroup);
        service.assetGroup$.subscribe((data: string[]) => {
            console.log('AssetGroups', data)
            try {
                expect(data.length).toBe(3)
                expect(data).toEqual(mockedMasterData.assetGroup);
                expect(masterDataService.getAssetGroup).toHaveBeenCalledTimes(1);
                done();
            } catch (error) {
                done(error);
            }
        });    
    });

    it('vessels$ getter should return vessels', (done) => {
        jest.spyOn(masterDataService, 'getVessels').mockReturnValue(mockedMasterData.vessels);
        service.vessels$.subscribe((data: string[]) => {
            console.log('Vessels', data)
            try {
                expect(data.length).toBe(2)
                expect(data).toEqual(['Vessel-1', 'Vessel-2']);
                expect(masterDataService.getVessels).toHaveBeenCalledTimes(1);
                done();
            } catch (error) {
                done(error);
            }
        });    
    });

    it('getVesselLength method should return length based on vessel selection', () => {
        jest.spyOn(masterDataService, 'getVesselLength').mockImplementation((vessel: string) => {
            if (vessel === 'Vessel-1') {
                return '100 ft'
            } else if (vessel === 'Vessel-2'){
                return '200 ft'
            } else {
                return ''
            }
        })

        const length1 = service.getVesselLength('Vessel-1');
        expect(length1).toBe('100 ft');
        const length2 = service.getVesselLength('Vessel-5');
        expect(length2).toBe('');
        expect(masterDataService.getVesselLength).toHaveBeenCalledTimes(2);
    });

    it('filterTypes should return types based on contract selection', (done) => {
        jest.spyOn(masterDataService, 'getTypes').mockImplementation((contract:string) => {
            if (contract === 'Contract-1') {
                return ['Marine'];
            } else if (contract === 'Contract-2') {
                return ['Transport'];
            } else {
                return [];
            }
        });

        // service.filterTypes('Contract-1');

        // Here skip(1) will skip the initial value from behaviour subject
        // hence we it will skip the first observable call and will subscribe in the
        // next call when we will call filterTypes method manually
        service.types$.pipe(skip(1)).subscribe((data: string[]) => {
            console.log('Types', data)
            try {
                expect(data.length).toBe(1)
                expect(data).toEqual(['Marine']);
                expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
                done();
            } catch (error) {
                done(error);
            }
        });

        // calling filterTypes here to make it's subscription call uniform with subject and behaviour subject
        service.filterTypes('Contract-1');
    });

    it('filterContracts should return contract based on customer selection- Valid Case --Using Done', (done) => {
        jest.spyOn(contractService, 'getContracts').mockImplementation((customer:string, startDate:Date, endDate:Date) => {
            if (customer === 'Customer-1') {
                return ['Contract-1'];
            } else if (customer === 'Customer-2') {
                return ['Contract-2'];
            } else {
                return [];
            }
        });

        jest.spyOn(masterDataService, 'getTypes').mockReturnValue([]);

        service.contracts$.pipe(skip(1)).subscribe((contracts: string[]) => {
            console.log('Contracts', contracts)
            try {
                expect(contracts.length).toBe(1)
                expect(contracts).toEqual(['Contract-1']);
                expect(contractService.getContracts).toHaveBeenCalledTimes(1);
            } catch (error) {
                done(error);
            }

        });  
        
        //This will be called later therefore we can done here
        service.types$.pipe(skip(1)).subscribe((types: string[]) => {
            console.log("Types", types)
            try {
                expect(types.length).toBe(0);
                expect.assertions(4)
                done();
            } catch (error) {
                done(error);
            }
        })
        service.filterContracts('Customer-1', new Date(), new Date());
    });

     it('filterContracts based on customer selection- Valid Case --Using Promise', async () => {
        jest.spyOn(contractService, 'getContracts').mockImplementation((customer:string, startDate:Date, endDate:Date) => {
            if (customer === 'Customer-1') {
                return ['Contract-1'];
            } else if (customer === 'Customer-2') {
                return ['Contract-2'];
            } else {
                return [];
            }
        });

        jest.spyOn(masterDataService, 'getTypes').mockReturnValue([]);

        service.filterContracts('Customer-1', new Date(), new Date());

        await expect(firstValueFrom(service.contracts$)).resolves.toEqual(['Contract-1']);
        expect(contractService.getContracts).toHaveBeenCalledTimes(1);
        await expect(firstValueFrom(service.types$)).resolves.toEqual([]);
        expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
    });

    it('filterContracts based on customer selection- InValid Case --Using Promise', async () => {
        jest.spyOn(contractService, 'getContracts').mockImplementation((customer:string, startDate:Date, endDate:Date) => {
            if (customer === 'Customer-1') {
                return ['Contract-1'];
            } else if (customer === 'Customer-2') {
                return ['Contract-2'];
            } else {
                return [];
            }
        });

        jest.spyOn(masterDataService, 'getTypes').mockReturnValue([]);

        service.filterContracts('Customer-5', new Date(), new Date());

        await expect(firstValueFrom(service.contracts$)).resolves.toEqual([]);
        expect(contractService.getContracts).toHaveBeenCalledTimes(1);
        await expect(firstValueFrom(service.types$)).resolves.toEqual([]);
        expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
    });

    it('filterCustomers based on assetGroup selection- Valid Case --Using Done', (done) => {
        jest.spyOn(masterDataService, 'getCustomer').mockImplementation((assetGroup:string) => {
            if (assetGroup === 'AssetGroup-1') {
                return ['Customer-1'];
            } else if (assetGroup === 'AssetGroup-2') {
                return ['Customer-2'];
            } else if (assetGroup === 'AssetGroup-3') {
                return ['Customer-3'];
            } else {
                return [];
            }
        });

        jest.spyOn(contractService, 'getContracts').mockReturnValue([])
        jest.spyOn(masterDataService, 'getTypes').mockReturnValue([]);

        service.filterCustomers('AssetGroup-1');

        // We can add pipe(skip(1)) to bypass intial value of behavior subject.
        service.customers$.subscribe((customers: string[]) => {
          console.log("Customers", customers);
          try {
            expect(customers.length).toBe(1);
            expect(customers).toEqual(['Customer-1']);
          } catch (error) {
            done(error);   
          }
        });

        service.contracts$.subscribe((contracts: string[]) => {
            console.log('contracts', contracts);
            try {
                expect(contracts.length).toBe(0);
                expect(contracts).toEqual([]);
            } catch (error) {
                done(error);
            }
        })

        // this will be our last subscription so we can add done() here
        service.types$.subscribe((types: string[]) => {
            console.log('types', types);
            try {
                expect(types.length).toBe(0);
                expect(types).toEqual([]);

                // this makes the end of test.
                // As we verify 6 assertions are run
                // We know types$ will emit data in last
                // and we can call done here only
                expect.assertions(6);
                done();
            } catch (error) {
               done(error); 
            }
        })

    });

    it('filterCustomers based on assetGroup selection- Valid Case --Using Promise', async () => {
        
        jest.spyOn(masterDataService, 'getCustomer').mockImplementation((assetGroup:string) => {
            if (assetGroup === 'AssetGroup-1') {
                return ['Customer-1'];
            } else if (assetGroup === 'AssetGroup-2') {
                return ['Customer-2'];
            } else if (assetGroup === 'AssetGroup-3') {
                return ['Customer-3'];
            } else {
                return [];
            }
        });

        jest.spyOn(contractService, 'getContracts').mockReturnValue([])
        jest.spyOn(masterDataService, 'getTypes').mockReturnValue([]);

        service.filterCustomers('AssetGroup-1');

        const customers = await firstValueFrom(service.customers$);
        expect(customers).toEqual(['Customer-1'])
        expect (masterDataService.getCustomer).toHaveBeenCalledTimes(1); 

        const contracts = await firstValueFrom(service.contracts$);
        expect(contracts).toEqual([]);
        expect (contractService.getContracts).toHaveBeenCalledTimes(1);

        const types = await firstValueFrom(service.types$);
        expect(types).toEqual([]);
        expect (masterDataService.getTypes).toHaveBeenCalledTimes(1);

    });


    it('filterCustomers based on assetGroup selection- InValid Case --Using Promise', async () => {
        jest.spyOn(masterDataService, 'getCustomer').mockImplementation((assetGroup:string) => {
            if (assetGroup === 'AssetGroup-1') {
                return ['Customer-1'];
            } else if (assetGroup === 'AssetGroup-2') {
                return ['Customer-2'];
            } else if (assetGroup === 'AssetGroup-3') {
                return ['Customer-3'];
            } else {
                return [];
            }
        });

        jest.spyOn(contractService, 'getContracts').mockReturnValue([])
        jest.spyOn(masterDataService, 'getTypes').mockReturnValue([]);

        service.filterCustomers('AssetGroup-50');

        const customers = await firstValueFrom(service.customers$);
        expect(customers).toEqual([])
        expect (masterDataService.getCustomer).toHaveBeenCalledTimes(1); 

        const contracts = await firstValueFrom(service.contracts$);
        expect(contracts).toEqual([]);
        expect (contractService.getContracts).toHaveBeenCalledTimes(1);

        const types = await firstValueFrom(service.types$);
        expect(types).toEqual([]);
        expect (masterDataService.getTypes).toHaveBeenCalledTimes(1);
    });


});