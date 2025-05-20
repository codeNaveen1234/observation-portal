import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { ObservationEntityComponent } from './observation-entity/observation-entity.component';
import { ObservationDetailsComponent } from './observation-details/observation-details.component';
import { ObservationDomainComponent } from './observation-domain/observation-domain.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ReportComponent } from './report/report.component';
import { APP_ROUTES } from './constants/app.routes';
import { ObservationLedImpComponent } from './observation-led-imp/observation-led-imp.component';
import { DeeplinkRedirectComponent } from './deeplink-redirect/deeplink-redirect.component';

const routes: Routes = [ 
  { path: APP_ROUTES.LISTING, component: ListingComponent },
  { path: APP_ROUTES.ENTITY_LIST, component: ObservationEntityComponent },
  { path: APP_ROUTES.DETAILS, component: ObservationDetailsComponent },
  { path: APP_ROUTES.DOMAIN, component: ObservationDomainComponent },
  { path: APP_ROUTES.QUESTIONNAIRE, component: QuestionnaireComponent },
  { path: APP_ROUTES.REPORTS, component: ReportComponent },
  { path: APP_ROUTES.Observation_Led_Imp, component: ObservationLedImpComponent },
  { path: APP_ROUTES.VERIFYLINK,component:DeeplinkRedirectComponent},
  { path: '', redirectTo: 'listing/observation', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
