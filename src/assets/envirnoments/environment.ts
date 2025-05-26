interface Environment {
    production: boolean;
    surveyBaseURL?: string;
    capabilities:'all' | 'project' | 'survey';
    isAuthBypassed: boolean;
    showHeader:boolean;
}
export const environment:Environment = {
    production: true,
    surveyBaseURL: '',
    capabilities: 'survey',
    isAuthBypassed: true,
    showHeader:false,
  }