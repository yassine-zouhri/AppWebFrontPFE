import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { LoginComponent } from '../login/login.component';
import { GestionRondesComponent } from './gestion-rondes/gestion-rondes.component';
import { AffectationrondeComponent } from './affectationronde/affectationronde.component';
import { ListrondesComponent } from './listrondes/listrondes.component';
import { EventAssignmentComponent } from './event-assignment/event-assignment.component';
import { ListevenementComponent } from './listevenement/listevenement.component';
import { AgentsdisponiblesComponent } from './agentsdisponibles/agentsdisponibles.component';
import { StatistiquesDiagComponent } from './statistiques-diag/statistiques-diag.component';
import { AgentSchedulerComponent } from './agent-scheduler/agent-scheduler.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'listUser',
      component: ListUsersComponent
    },
    {
      path: 'gestionronde',
      component: GestionRondesComponent
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path : 'affectation',
      component:AffectationrondeComponent
    },
    {
      path : 'listRonde',
      component : ListrondesComponent
    },
    {
      path : 'agentsdisponibles',
      component : AgentsdisponiblesComponent
    },
    {
      path : 'listeEvenement',
      component : ListevenementComponent
    },
    {
      path : 'gestionevents',
      component : EventAssignmentComponent
    },
    {
      path : 'statistique',
      component : StatistiquesDiagComponent
    },
    {
      path : 'agentScheduler',
      component : AgentSchedulerComponent
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: '/pages/listUser',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
