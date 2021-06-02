import { NgModule } from '@angular/core';
import { NbAccordionModule, NbActionsModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbDialogService, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbPopoverModule, NbSelectModule, NbSidebarModule, NbSpinnerModule, NbStepperModule, NbTabsetModule, NbTimepickerModule, NbToastrModule, NbTooltipModule, NbTreeGridModule, NbWindowModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { UpdateUserProfileComponent } from './update-user-profile/update-user-profile.component';
import { LoginComponent } from '../login/login.component';
import { GestionRondesComponent } from './gestion-rondes/gestion-rondes.component';
import { AgGridModule } from 'ag-grid-angular';
import { DndModule } from 'ngx-drag-drop';
import { 
	IgxGridModule,
	IgxDragDropModule,
	IgxButtonModule
 } from "igniteui-angular";
 import * as $ from "jquery";
import { BrowserModule, HammerModule } from '@angular/platform-browser';

import { AgmCoreModule } from '@agm/core';
import { BtnCellRenderer } from './gestion-rondes/BtnCellRenderer';
import { AddInfoToCheckPointsComponent } from './add-info-to-check-points/add-info-to-check-points.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ShowRoadMapRenderer } from './gestion-rondes/ShowRoadMapRenderer';
import { AffectationrondeComponent } from './affectationronde/affectationronde.component';
import { UseravatarRenderer } from './affectationronde/useravatarRenderer';
import { ListrondesComponent } from './listrondes/listrondes.component';
import { AffectationRenderer } from './listrondes/AffectationRenderer';
import { AvancementRenderer } from './listrondes/AvancementRenderer';
import { AdvancementRoadMapComponent } from './advancement-road-map/advancement-road-map.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import {AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MessagingService } from '../service/firebaseService/MessagingService';
import { EventAssignmentComponent } from './event-assignment/event-assignment.component';
import { ListevenementComponent } from './listevenement/listevenement.component';
import { AffectationEventComponent } from './affectation-event/affectation-event.component';
import { AffectationRendererEvent } from './listevenement/AffectationRendererEvent';
import { UseravatarRendererEvent } from './affectation-event/UseravatarRendererEvent';
import { EventinperiodeComponent } from './eventinperiode/eventinperiode.component';
import { MatCardModule } from '@angular/material/card';
import { AgentsdisponiblesComponent } from './agentsdisponibles/agentsdisponibles.component';
import { CurrentAgentLocationsComponent } from './current-agent-locations/current-agent-locations.component';
import { StatistiquesDiagComponent } from './statistiques-diag/statistiques-diag.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgentSchedulerComponent } from './agent-scheduler/agent-scheduler.component';
import { ScheduleModule, DayService, WeekService, WorkWeekService, MonthService, AgendaService,MonthAgendaService, RecurrenceEditorModule, ResizeService, DragAndDropService, TimelineViewsService, TimelineMonthService } from '@syncfusion/ej2-angular-schedule';
import {TreeViewModule} from '@syncfusion/ej2-angular-navigations'
import { DropDownButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';


import { DropDownListAllModule, MultiSelectAllModule,DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';

import { MaskedTextBoxModule, UploaderAllModule } from '@syncfusion/ej2-angular-inputs';

import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';

import { ButtonAllModule, CheckBoxAllModule, SwitchAllModule } from '@syncfusion/ej2-angular-buttons';

import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule,DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';

import { NumericTextBoxAllModule, TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';

import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { PagerModule } from '@syncfusion/ej2-angular-grids';
import { AgentAgendaService } from '../service/firebaseService/AgentAgendaService';
@NgModule({
  imports: [
    PagesRoutingModule,ThemeModule,NbMenuModule,DashboardModule,ECommerceModule,MiscellaneousModule,Ng2SmartTableModule,
    NbButtonModule,NbIconModule,NbInputModule,NbPopoverModule,NbCardModule,NbDialogModule.forChild(),NbWindowModule.forChild(),
    NbCheckboxModule,NbTabsetModule,NbSelectModule,NbTooltipModule,NbStepperModule,FormsModule,ReactiveFormsModule,
    MatSliderModule,MatFormFieldModule,MatInputModule,MatNativeDateModule,MatDatepickerModule,MatSlideToggleModule,MatSelectModule,MatIconModule,
    MatButtonModule,CommonModule,AgGridModule.withComponents([GestionRondesComponent, BtnCellRenderer,UseravatarRenderer,ListrondesComponent]),
    IgxDragDropModule,IgxGridModule,IgxButtonModule,HammerModule,NbSidebarModule.forRoot(),NbMenuModule.forRoot(),NbLayoutModule,
    NbActionsModule,NbAccordionModule,NgxDropzoneModule,  NbTreeGridModule,AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,NbToastrModule.forRoot(),AngularFireMessagingModule,NbDatepickerModule.forRoot(),NbTimepickerModule,NbTimepickerModule.forRoot(),
    MatCardModule,NbSpinnerModule,HighchartsChartModule,ScheduleModule,RecurrenceEditorModule,
    TreeViewModule,ScheduleAllModule, RecurrenceEditorAllModule,   NumericTextBoxAllModule, TextBoxAllModule, DatePickerAllModule, 
    TimePickerAllModule, DateTimePickerAllModule, CheckBoxAllModule,   ToolbarAllModule, DropDownListAllModule,
    ContextMenuAllModule, MaskedTextBoxModule, UploaderAllModule, MultiSelectAllModule,  ButtonAllModule, 
    DropDownButtonAllModule, SwitchAllModule,PagerModule,DropDownTreeModule ,DateTimePickerModule,
  ],
  declarations: [
    PagesComponent,ListUsersComponent,AddUserComponent,UpdateUserProfileComponent,
    GestionRondesComponent,
    BtnCellRenderer,ShowRoadMapRenderer,AffectationRenderer,AvancementRenderer,
    AffectationRenderer,AffectationRendererEvent,UseravatarRendererEvent,
    AddInfoToCheckPointsComponent,AffectationrondeComponent, ListrondesComponent, AdvancementRoadMapComponent,
    EventAssignmentComponent, ListevenementComponent, AffectationEventComponent, EventinperiodeComponent, AgentsdisponiblesComponent, CurrentAgentLocationsComponent, StatistiquesDiagComponent, AgentSchedulerComponent,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }, DatePipe,NbDialogService,MessagingService,AgentAgendaService,
  AsyncPipe,MonthAgendaService,DayService, WeekService, WorkWeekService, MonthService, AgendaService,
  ResizeService,DragAndDropService,TimelineViewsService,TimelineMonthService],
})
export class PagesModule {}
