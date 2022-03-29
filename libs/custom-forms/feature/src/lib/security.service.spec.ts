import { TestBed } from '@angular/core/testing';
import { SecurityService } from './security.service';


describe('MasterDataService', () => {
    let service: SecurityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SecurityService]
        });
        service = TestBed.inject(SecurityService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('securityContext getter should return currentSecurityContext', () => {
        expect(service.securityContext).toEqual({role: 'admin'});
    });

    it('securityContextChanges$ getter should return updated currentSecurityContext', (done) => {
        service.securityContextChanges$.subscribe((data: { role: 'admin' | 'user' }) => {
            expect(data).toEqual({role: 'admin'});
        })
        done();
    });

    it('setSecurityContext should set securityContext', (done) => {
        service.setSecurityContext({role: 'user'});
        service.securityContext$.subscribe((data: { role: 'admin' | 'user' }) => {
            console.log('SecurityContext', data)
            try {
                expect(data).toEqual({role: 'user'});
                done();
            } catch (error) {
                done(error);
            }
        });    
    });

});