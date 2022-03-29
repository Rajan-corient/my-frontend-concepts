import { TestBed } from '@angular/core/testing';
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
                expect(data.length).toBe(1)
                expect(data).toEqual(['Marine']);
                expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
                done();
            } catch (error) {
                done(error);
            }
        });    
    });

    // it('filterContracts should return contract based on contract selection- Valid Case', (done) => {
    //     jest.spyOn(masterDataService, 'getContracts').mockImplementation((contract:string) => {
    //         if (contract === 'Contract-1') {
    //             return ['Marine'];
    //         } else if (contract === 'Contract-2') {
    //             return ['Transport'];
    //         } else {
    //             return [];
    //         }
    //     });

    //     service.filterTypes('Contract-1');
    //     service.types$.subscribe((data: string[]) => {
    //         console.log('Types', data)
    //         try {
    //             expect(data.length).toBe(1)
    //             expect(data).toEqual(['Marine']);
    //             expect(masterDataService.getTypes).toHaveBeenCalledTimes(1);
    //             done();
    //         } catch (error) {
    //             done(error);
    //         }
    //     });    
    // });


});