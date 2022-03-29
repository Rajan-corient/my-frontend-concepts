import { TestBed } from '@angular/core/testing';
import { MasterDataService } from './master-data.service';

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

describe('MasterDataService', () => {
    let service: MasterDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MasterDataService]
        });
        service = TestBed.inject(MasterDataService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('getAssetGroup method should return assetGroups', () => {
        const assetGroup = service.getAssetGroup();
        expect(assetGroup.length).toBe(3);
        expect(assetGroup).toEqual(mockedMasterData.assetGroup);
    });

    it('getTypes method should return types based on contract selection', () => {
        const types = service.getTypes('Contract-1');
        expect(types.length).toBe(1);
        expect(types[0]).toEqual(mockedMasterData.types[0].type);
    });

    it('getCustomer method should return customer based on assetGroup selection', () => {
        const customer = service.getCustomer('AssetGroup-1');
        expect(customer.length).toBe(1);
        expect(customer[0]).toBe('Customer-1');
    });

    it('getVesselLength method should return correct length', () => {
        const vesselLength = service.getVesselLength(mockedMasterData.vessels[0].vessel);
        expect(vesselLength).toBe('100 ft')
    });

    it('getVessels should return vessels', () => {
        const vessels = service.getVessels();
        expect(vessels.length).toBe(2);
        expect(vessels).toEqual(mockedMasterData.vessels);
    });

});