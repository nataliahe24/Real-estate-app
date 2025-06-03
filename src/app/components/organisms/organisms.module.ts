import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { AtomsModule } from '../atoms/atoms.module';
import { LocationFormComponent } from './location-form/location-form.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { LoginComponent } from './login/login.component';
import { VisitFormComponent } from './visit-form/visit-form.component';
import { VisitListComponent } from './visit-list/visit-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchFormComponent } from '../organisms/search-form/search-form.component';
import { BuyerVisitsListComponent } from './buyer-visits-list/buyer-visits-list.component';
@NgModule({
  declarations: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    LocationFormComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    PropertyFormComponent,
    UsersFormComponent,
    PropertyListComponent,
    LoginComponent,
    VisitFormComponent,
    VisitListComponent,
    SearchFormComponent,
    BuyerVisitsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule,
    AtomsModule,
    MoleculesModule,
    MatDialogModule
  ],
  exports: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    LocationFormComponent,
    UsersFormComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    PropertyFormComponent,
    PropertyListComponent,
    LoginComponent,
    VisitFormComponent,
    VisitListComponent,
    SearchFormComponent,
    BuyerVisitsListComponent
  ]
})
export class OrganismsModule { } 