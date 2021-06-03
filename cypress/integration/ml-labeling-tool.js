describe('Integration Tests', () => {

    let baseUrl = 'https://dev-connect-mllabelingtool.bentley.com/24b566ed-a308-49b3-8831-8f4f3b0d17a5/82eccd21-bb76-414a-b82a-04913509d5d1';
    let email = 'designinsightuser01@bentleyconnectops.bentley.com';
    let password = 'fuYumfJQ8CNzEemn';

    beforeEach(() => {
        cy.viewport(1508, 1000)
    });

    it('Should authenticate via IMS', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit(baseUrl, {
            onBeforeLoad: (win) => {
                win.sessionStorage.clear()
            }
        });
        cy.visit(baseUrl);
        cy.get('#identifierInput', {timeout: 60000}).should('be.visible');
        cy.get('#identifierInput').type(email);
        cy.get('#sign-in-button').click();
        cy.get('#password', {timeout: 60000}).should('be.visible');
        cy.get('#password').type(password);
        cy.get('#sign-in-button').click();
        cy.get('.nz-widgetPanels-panels > .nz-left > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle', {timeout: 60000}).should('be.visible');
    })

    it('Should adjust the main view ', () => {
        cy.get('.sstc-data-container', {timeout: 60000}).should('be.visible');
        cy.get('tbody tr', {timeout: 60000}).should('be.visible');
        cy.get('.nz-widgetPanels-panels > .nz-left > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle', {timeout: 60000}).should('be.visible');
        cy.get('.components-toolbar-items-container > .components-toolbar-item-container > .components-toolbar-button-item > .components-icon > .icon-fit-to-view').click()
        cy.get('.components-toolbar-items-container > .components-toolbar-item-container > .components-toolbar-button-item > .components-icon > .icon-gyroscope').click()
        cy.get('.uifw-contentlayout-full-size > div > div > .imodeljs-vp > canvas:nth-child(1)').click()
        cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
        cy.get('.nz-widgetPanels-panels > .nz-widgetPanels-panel:nth-child(4) > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
        cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
        cy.get('.nz-widgetPanels-panels > .nz-widgetPanels-panel:nth-child(4) > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
        cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
        cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
        cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
    });

    it('Should adjust the color mode', () => {
        cy.get('.sstc-data-container', {timeout: 30000}).should('be.visible');
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.labelColors')
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.native')
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
    })

    it('Should toggle visibility off', () => {
        cy.get('.mltc-first-row > .mltc-name-th-v2 > .mltc-name-th-v2-visibility > .uicore-buttons-hollow > .core-icons-svgSprite').click()
        for (let i = 1; i < 15; i++) {
            cy.get(`tbody > tr:nth-child(${i}) > .mltc-name-td-v2 > .uicore-buttons-hollow > .core-icons-svgSprite`).click()
        }
    });

    it('Should toggle visibility hidden', () => {
        cy.get('.mltc-first-row > .mltc-name-th-v2 > .mltc-name-th-v2-visibility > .uicore-buttons-hollow > .core-icons-svgSprite').click()
        for (let i = 1; i < 15; i++) {
            cy.get(`tbody > tr:nth-child(${i}) > .mltc-name-td-v2 > .uicore-buttons-hollow > .core-icons-svgSprite`).click()
        }
    });

    it('Should toggle visibility on', () => {
        cy.get('.mltc-first-row > .mltc-name-th-v2 > .mltc-name-th-v2-visibility > .uicore-buttons-hollow > .core-icons-svgSprite').click()
        cy.get('.mltc-first-row > .mltc-name-th-v2 > .mltc-name-th-v2-visibility > .uicore-buttons-hollow > .core-icons-svgSprite').click()
    });

    it('Should toggle radio buttons', () => {
        for (let i = 1; i < 15; i++) {
            cy.get(`tbody > tr:nth-child(${i}) > .mltc-name-td-v2 > .uicore-inputs-radio > .core-radio-checkmark`).click()
            cy.get(`tbody > tr:nth-child(${i}) > .mltc-name-td-v2 > .uicore-inputs-radio > input`).type('on')
        }
    });

    it('Should transfer label categories', () => {
        for (let i = 1; i < 15; i++) {
            cy.get(`tr:nth-child(${i}) > .mltc-name-td-v2 > .mltc-label-container-v2-small > .uicore-buttons-primary > svg > g > path`).click()
        }
        cy.get(`tr:nth-child(1) > .mltc-name-td-v2 > .mltc-label-container-v2-small > .uicore-buttons-primary > svg > g > path`).click()
    });

});


// it('Should authenticate via IMS', () => {
//     // cy.clearLocalStorage()
//     // cy.clearCookies()
//     // indexedDB.deleteDatabase('localforage')
//     cy.visit('https://dev-connect-mllabelingtool.bentley.com/24b566ed-a308-49b3-8831-8f4f3b0d17a5/82eccd21-bb76-414a-b82a-04913509d5d1');
//     cy.get('.ping-container > .ping-body-container > form > .ping-input-container > #identifierInput').click()
//     cy.get('.ping-container > .ping-body-container > form > .ping-input-container > #identifierInput').type('designinsightuser01@bentleyconnectops.bentley.com')
//     cy.get('.ping-container > .ping-body-container > form > #postButton > #sign-in-button').click()
//     cy.visit('https://qa-imsoidc.bentley.com/as/IyTrh/resume/as/authorization.ping')
//     cy.get('.ping-body-container > div > form > .ping-input-container > #password').click()
//     cy.get('.ping-body-container > div > form > .ping-input-container > #password').type('fuYumfJQ8CNzEemn')
//     cy.get('body > .ping-container > .ping-body-container > div > form').click()
//     cy.get('.ping-body-container > div > form > .ping-buttons > #sign-in-button').click()
// })

// it('Should log in', () => {
//     cy.visit('http://localhost:3000/24b566ed-a308-49b3-8831-8f4f3b0d17a5/82eccd21-bb76-414a-b82a-04913509d5d1')
//     cy.wait(12000);
// });

// it('Should interact with the viewer', () => {
//     cy.get('.nz-widgetPanels-panels > .nz-left > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
//     cy.get('.components-toolbar-items-container > .components-toolbar-item-container > .components-toolbar-button-item > .components-icon > .icon-fit-to-view').click()
//     cy.get('.components-toolbar-items-container > .components-toolbar-item-container > .components-toolbar-button-item > .components-icon > .icon-gyroscope').click()
//     cy.get('.uifw-contentlayout-full-size > div > div > .imodeljs-vp > canvas:nth-child(1)').click()
//     cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
//     cy.get('.nz-widgetPanels-panels > .nz-widgetPanels-panel:nth-child(4) > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
//     cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
//     cy.get('.nz-widgetPanels-panels > .nz-widgetPanels-panel:nth-child(4) > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
//     cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
//     cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
//     cy.get('.nz-widgetPanels-panels > .nz-right > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
// });
//
// it('Should the adjust camera angle', () => {
//     cy.get('.components-toolbar-items-container > .components-toolbar-item-container > .components-toolbar-button-item > .components-icon > .icon-fit-to-view').click()
//     cy.get('[data-testid=cube-pointer-button-left]').click();
//     cy.get('[data-testid=cube-pointer-button-up]').click();
//     cy.get('[data-testid=cube-pointer-button-down]').click();
//     cy.get('[data-testid=cube-pointer-button-right]').click();
//     cy.get('[data-testid=cube-pointer-button-right]').click();
// });
//
// it('Should adjust the color mode', () => {
//     cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.labelColors')
//     cy.wait(500);
//     cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
//     cy.wait(500);
//     cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.native')
//     cy.wait(500);
//     cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
//     cy.wait(500);
//     cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.labelColors')
// })
//
// it('Should toggle visibility', () => {
//     cy.get('.mltc-first-row > .mltc-name-th-v2 > .mltc-name-th-v2-visibility > .uicore-buttons-hollow > .core-icons-svgSprite').click()
//     for (let i = 1; i < 15; i++) {
//         cy.get(`tbody > tr:nth-child(${i}) > .mltc-name-td-v2 > .uicore-buttons-hollow > .core-icons-svgSprite`).click()
//     }
// });



