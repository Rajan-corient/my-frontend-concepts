import { TestBed } from '@angular/core/testing';
import { ContractService } from './contract.service';

describe('MasterDataService', () => {
    let service: ContractService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ContractService]
        });
        service = TestBed.inject(ContractService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('getContracts method should return contract when passed valid input', () => {
        const contract1 = service.getContracts('Customer-1', new Date(), new Date());
        expect(contract1.length).toBe(1);
        expect(contract1[0]).toBe('Contract-1');

        const contract2 = service.getContracts('Customer-2', new Date(), new Date());
        expect(contract2.length).toBe(1);
        expect(contract2[0]).toBe('Contract-2');
    });

    it('getContracts method should not return contract when passed invalid input', () => {
        const contracts = service.getContracts('Customer-5', new Date(), new Date());
        expect(contracts.length).toBe(0);
        expect(contracts).toEqual([])
    });

});