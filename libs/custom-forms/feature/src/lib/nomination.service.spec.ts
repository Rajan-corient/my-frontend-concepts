import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
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

        service.filterTypes('Contract-1');
        service.types$.subscribe((data: string[]) => {
            console.log('Types', data)
            try {
                expect(data.length).resolves.toBe(1)
                expect(data).toEqual(['Marine']);
                expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
                done();
            } catch (error) {
                done(error);
            }
        });    
    });

    // Imcomplete solution
    // it('filterContracts should return contract based on customer selection- Valid Case --Using Done', (done) => {
    //     jest.spyOn(contractService, 'getContracts').mockImplementation((customer:string, startDate:Date, endDate:Date) => {
    //         if (customer === 'Customer-1') {
    //             return ['Contract-1'];
    //         } else if (customer === 'Customer-2') {
    //             return ['Contract-2'];
    //         } else {
    //             return [];
    //         }
    //     });

    //     jest.spyOn(masterDataService, 'getTypes').mockReturnValue([]);

    //     service.filterContracts('Customer-1', new Date(), new Date());
    //     service.contracts$.subscribe((contracts: string[]) => {
    //         console.log('Contracts', contracts)
    //         try {
    //             expect(contracts.length).toBe(1)
    //             expect(contracts).toEqual(['Contract-1']);
    //             expect(contractService.getContracts).toHaveBeenCalledTimes(1);
    //             // done()
    //         } catch (error) {
    //             console.log(error);
    //             // done(error)
    //         }
    //     });  
        
    //     service.types$.subscribe((types: string[]) => {
    //         console.log("Types", types)
    //         try {
    //             expect(types.length).toBe(0);
    //             done();
    //         } catch (error) {
    //             done(error);
    //         }
    //     })
    // });

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

        await expect(firstValueFrom(service.customers$)).resolves.toEqual(['Customer-1']);
        expect (masterDataService.getCustomer).toHaveBeenCalledTimes(1);
        await expect(firstValueFrom(service.contracts$)).resolves.toEqual([]);
        expect(contractService.getContracts).toHaveBeenCalledTimes(1);
        await expect(firstValueFrom(service.types$)).resolves.toEqual([]);
        expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
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

        await expect(firstValueFrom(service.customers$)).resolves.toEqual([]);
        expect (masterDataService.getCustomer).toHaveBeenCalledTimes(1);
        await expect(firstValueFrom(service.contracts$)).resolves.toEqual([]);
        expect(contractService.getContracts).toHaveBeenCalledTimes(1);
        await expect(firstValueFrom(service.types$)).resolves.toEqual([]);
        expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
    });


});