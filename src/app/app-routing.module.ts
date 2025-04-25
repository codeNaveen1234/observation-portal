import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { ObservationEntityComponent } from './observation-entity/observation-entity.component';
import { ObservationDetailsComponent } from './observation-details/observation-details.component';
import { ObservationDomainComponent } from './observation-domain/observation-domain.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [ 
  {
    path:'listing/:solutionType',
    component:ListingComponent
  },
  { 
    path: 'entityList/:id/:name/:entityType',
    component:ObservationEntityComponent
  },
  {
    path: 'details/:name/:observationId/:entityId/:allowMultipleAssessemts',
    component:ObservationDetailsComponent,
  },
  {
    path: 'domain/:observationId/:entityId/:id',
    component:ObservationDomainComponent
  },
  {
    path:"questionnaire",
    component:QuestionnaireComponent
  },
  {
    path: 'reports/:observationId/:entityId/:entityType/:isMultiple/:scores',
    component:ReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
