interface Environment {
    production: boolean;
    surveyBaseURL?: string;
    capabilities:'all' | 'project' | 'survey';
}
export const environment:Environment = {
    production: true,
    surveyBaseURL: '',
    capabilities: 'survey',
  }