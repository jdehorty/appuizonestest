import './commands';
import './customTypes';

beforeEach(() => {
  Cypress.on('window:before:load', win => {
    // TODO: Workaround for tests timing out on Electron:
    // https://github.com/cypress-io/cypress/issues/2118#issuecomment-580095512
    const original = win.EventTarget.prototype.addEventListener;
    win.EventTarget.prototype.addEventListener = function () {
      if (arguments && arguments[0] === 'beforeunload') {
        return;
      }
      return original.apply(this, arguments);
    };

    Object.defineProperty(win, 'onbeforeunload', {
      get: () => {},
      set: () => {},
    });

    if (Cypress.env('bentleyEnv') !== 'production') {
      win.fetch = undefined;
    }

    win.microsoftTeams = {};

    win.microsoftTeams.initialize = () => {
      console.log('Mock MS Teams initialize');
    };

    const context = {
      entityId: '1',
      groupId: 'eb057efb-8d9d-4b2d-b1b2-8f9a8c51defd',
      locale: 'en-us',
    };

    win.microsoftTeams.getContext = callback => {
      callback(context);
    };

    win.microsoftTeams.settings = {
      settings: {},
      onSaveHandler: () => {
        console.log('onSaveHandler(): undefined');
      },
      registerOnSaveHandler: fn => {
        win.microsoftTeams.settings.onSaveHandler = fn;
      },
      setValidityState: cy.spy().as('setValidityState'),
      getSettings: callback => {
        callback({
          websiteUrl: 'https://www.bentley.com',
          contentUrl: 'https://projectwiseteamshost.com',
        });
      },
      setSettings: (settings, callback) => {
        win.microsoftTeams.settings = settings;
        callback(settings);
      },
    };

    win.microsoftTeams.registerOnThemeChangeHandler = cb => cb('default');
    win.microsoftTeams.authentication = {
      authenticate: async () => Promise.resolve(),
    };
  });
});
