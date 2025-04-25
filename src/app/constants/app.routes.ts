export const APP_ROUTES = {
    LISTING: 'listing/:solutionType',
    ENTITY_LIST: 'entityList/:solutionId/:name/:entityType',
    DETAILS: 'details/:name/:observationId/:entityId/:allowMultipleAssessemts',
    DOMAIN: 'domain/:observationId/:entityId/:solutionId',
    QUESTIONNAIRE: 'questionnaire',
    REPORTS: 'reports/:observationId/:entityId/:entityType/:isMultiple/:scores',
};