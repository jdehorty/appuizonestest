export const getProjectId = (): string => {
    const base: any = Cypress.config('baseUrl');
    return base.split('/')[3];
};


