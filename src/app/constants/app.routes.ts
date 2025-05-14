export const APP_ROUTES = {
    LISTING: 'listing/:solutionType',
    ENTITY_LIST: 'entityList/:solutionId/:name/:entityType/:entity',
    DETAILS: 'details/:name/:observationId/:entityId/:allowMultipleAssessemts',
    DOMAIN: 'domain/:observationId/:entityId/:solutionId',
    QUESTIONNAIRE: 'questionnaire',
    REPORTS: 'reports/:observationId/:entityId/:entityType/:isMultiple/:scores',
    Observation_Led_Imp: 'observation-led-imp'
};