interface Environment {
    production: boolean;
    surveyBaseURL?: string;
    capabilities:'all' | 'project' | 'survey';
    isAuthBypassed: boolean;
}
export const environment:Environment = {
    production: true,
    surveyBaseURL: '',
    capabilities: 'survey',
    isAuthBypassed: true
  }