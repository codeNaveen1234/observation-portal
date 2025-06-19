export const APP_ROUTES = {
    LISTING: 'listing/:solutionType',
    ENTITY_LIST: 'entityList/:solutionId/:name/:entityType/:entity',
    ENTITY_LIST_2: 'entityList/:solutionId/:name',
    DETAILS: 'details/:observationId/:entityId/:allowMultipleAssessemts',
    DOMAIN: 'domain/:observationId/:entityId/:solutionId',
    QUESTIONNAIRE: 'questionnaire',
    REPORTS: 'reports/:observationId/:entityId/:entityType/:isMultiple/:scores',
    Observation_Led_Imp: 'observation-led-imp',
    VERIFYLINK:'view/:type/:id',
    OBSERVATION_AS_TASK: "task/:solutionId",
    DOWNLOADS: "downloads",
    SURVEYREPORTS:'surveyReports/:id',
    SURVEYEXPIRED:'surveyStatus'
};