describe('Should Log In', () => {
    it('Should log in', () => {
        cy.viewport(1508, 813)
        cy.visit('http://localhost:3000/24b566ed-a308-49b3-8831-8f4f3b0d17a5/82eccd21-bb76-414a-b82a-04913509d5d1')
        cy.wait(9000);  // wait for redirect finish
        // cy.visit('https://qa-imsoidc.bentley.com/connect/authorize?client_id=ml-labeling-spa-client&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin-oidc&response_type=code&scope=openid%20profile%20organization%20email%20context-registry-service%3Aread-only%20general-purpose-imodeljs-backend%20imodelhub%20imodeljs-router%20product-settings-service%20urlps-third-party%20ml-labeling-tool-api&state=54b2f2f7d41c4953b406fc648974eeb8&code_challenge=jYX36aPhDyg7V_cwe6vslkF4axOzpiqyMDEU4s7euGU&code_challenge_method=S256&response_mode=query');
        cy.get('.ping-container').click();
        cy.get('.ping-input-container').click();
        cy.get('#identifierInput').click();
        cy.get('#identifierInput').type('justin.dehorty@bentley.com');
        cy.get('#sign-in-button').click();
        // cy.wait(9000);  // wait for redirect finish
    })

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
        cy.get('.core-cube-css3d > .cube-front > .nav-cube-face > .cube-center > .face-cell:nth-child(3)').click()
        cy.wait(500);
        cy.get('.core-cube-css3d > .cube-right > .nav-cube-face > .cube-center > .face-cell:nth-child(3)').click()
        cy.wait(500);
        cy.get('.core-cube-css3d > .cube-right > .nav-cube-face > .face-row:nth-child(3) > .cube-center').click()
        cy.wait(500);
        cy.get('.core-cube-css3d > .cube-right > .nav-cube-face > .face-row:nth-child(1) > .cube-center').click()
        cy.wait(500);
        cy.get('.core-cube-css3d > .cube-right > .nav-cube-face > .cube-center > .face-cell:nth-child(1)').click()
        cy.wait(500);
    });

    it('Should adjust the color mode', () => {
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.labelColors')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.nativeColors')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.predictionColors')
        cy.wait(500);
        cy.get('tr > td > div > label > .sstc-color-mode-select').select('MachineLearning:colorMode.labelColors')
    })

})


