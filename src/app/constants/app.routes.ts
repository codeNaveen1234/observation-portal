export const APP_ROUTES = {
    LISTING: 'listing/:solutionType',
    ENTITY_LIST: 'entityList/:solutionId/:name/:entityType/:entity',
    ENTITY_LIST_NO_TYPE: 'entityList/:solutionId/:name',
    DETAILS: 'details/:observationId/:entityId/:allowMultipleAssessemts',
    DOMAIN: 'domain/:observationId/:entityId/:solutionId',
    QUESTIONNAIRE: 'questionnaire',
    REPORTS: 'reports/:observationId/:entityId/:entityType/:isMultiple/:scores',
    Observation_Led_Imp: 'observation-led-imp',
    OBSERVATION_AS_TASK: "task/:solutionId",
    VERIFYLINK:'view/:type/:id',
    SURVEYREPORTS:'surveyReports/:id'
};