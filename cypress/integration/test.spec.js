describe('Integration Tests', () => {

    beforeEach(() => {
        cy.viewport(1508, 813)
    });

    it('Should authenticate', () => {
        cy.visit('https://qa-imsoidc.bentley.com/connect/authorize?client_id=ml-labeling-spa-client&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin-oidc&response_type=code&scope=openid%20profile%20organization%20email%20context-registry-service%3Aread-only%20general-purpose-imodeljs-backend%20imodelhub%20imodeljs-router%20product-settings-service%20urlps-third-party%20ml-labeling-tool-api&state=54b2f2f7d41c4953b406fc648974eeb8&code_challenge=jYX36aPhDyg7V_cwe6vslkF4axOzpiqyMDEU4s7euGU&code_challenge_method=S256&response_mode=query');
        cy.get('.ping-container').click();
        cy.get('.ping-input-container').click();
        cy.get('#identifierInput').click();
        cy.get('#identifierInput').type('justin.dehorty@bentley.com');
        cy.get('#sign-in-button').click();
        // cy.wait(10000);
    })

    it('Should log in', () => {
        cy.visit('http://localhost:3000/24b566ed-a308-49b3-8831-8f4f3b0d17a5/82eccd21-bb76-414a-b82a-04913509d5d1')
        cy.wait(12000);
    });

    it('Should interact with the viewer', () => {
        cy.get('.nz-widgetPanels-panels > .nz-left > .nz-grip-container > .nz-widgetPanels-grip > .nz-handle').click()
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

    it('Should the adjust camera angle', () => {
        cy.get('.components-toolbar-items-container > .components-toolbar-item-container > .components-toolbar-button-item > .components-icon > .icon-fit-to-view').click()
        cy.get('[data-testid=cube-pointer-button-left]').click();
        cy.get('[data-testid=cube-pointer-button-up]').click();
        cy.get('[data-testid=cube-pointer-button-down]').click();
        cy.get('[data-testid=cube-pointer-button-right]').click();
        cy.get('[data-testid=cube-pointer-button-right]').click();
    });

    it('Should adjust the color mode', () => {
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.labelColors')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.native')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.labelColors')
    })

    it('Should toggle visibility', () => {
        cy.get('.mltc-first-row > .mltc-name-th-v2 > .mltc-name-th-v2-visibility > .uicore-buttons-hollow > .core-icons-svgSprite').click()
        for (let i = 1; i < 15; i++) {
            cy.get(`tbody > tr:nth-child(${i}) > .mltc-name-td-v2 > .uicore-buttons-hollow > .core-icons-svgSprite`).click()
        }
    });

})


