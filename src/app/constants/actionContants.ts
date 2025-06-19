export const TITLE_MAP: Record<string, string> = {
    observationReports: 'Observation Reports',
    survey: 'Survey',
    observation: 'Observation',
    surveyReports: 'Survey Reports'
  };
  
 export const DESC_KEY_MAP: Record<string, string> = {
    survey: 'SURVEY_DESC',
    surveyReports: 'SURVEY_DESC',
    observation: 'OBSERVATION_LISTING_MESSAGE',
    observationReports: 'OBSERVATION_REPORTS_DESC'
};

export const solutionTypeMap = {
  surveyReports: 'survey',
  observation: 'observation',
  survey: 'survey',
  observationReports:'observation'
};

export const surveyStatusMap = {
  expired:{
    path:'/managed-observation-portal/assets/images/survey-expired.svg',
    text:'SURVEY_EXPIRED_MSG'
  },
  completed:{
    path:'/managed-observation-portal/assets/images/submitted.svg',
    text:'SURVEY_COMPLETED_MSG'
  }
}