import { recursiveComponentAppDataAccess } from './recursive-component-app-data-access';

describe('recursiveComponentAppDataAccess', () => {
  it('should work', () => {
    expect(recursiveComponentAppDataAccess()).toEqual(
      'recursive-component-app-data-access'
    );
  });
});
