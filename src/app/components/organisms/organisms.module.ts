import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { AtomsModule } from '../atoms/atoms.module';
import { PropertiesGridComponent } from './properties-grid/properties-grid.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { PropertiesToolbarComponent } from './properties-toolbar/properties-toolbar.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { LoginComponent } from './login/login.component';
import { VisitFormComponent } from './visit-form/visit-form.component';
import { VisitListComponent } from './visit-list/visit-list.component';
@NgModule({
  declarations: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    PropertiesGridComponent,
    LocationFormComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    PropertyFormComponent,
    UsersFormComponent,
    PropertiesToolbarComponent,
    PropertyListComponent,
    LoginComponent,
    VisitFormComponent,
    VisitListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedComponentsModule,
    AtomsModule,
    MoleculesModule
],
  exports: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    PropertiesGridComponent,
    LocationFormComponent,
    UsersFormComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    PropertyFormComponent,
    PropertiesToolbarComponent,
    PropertyListComponent,
    LoginComponent,
    VisitFormComponent,
    VisitListComponent,
  ]
})
export class OrganismsModule { } 