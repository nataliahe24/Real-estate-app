import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryFormComponent } from '../molecules/category-form/category-form.component';
import { NotificationComponent } from '../atoms/notification/notification.component';
import { PropertiesGridComponent } from './properties-grid/properties-grid.component';
import { LocationFormComponent } from './location-form/location-form.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { UsersFormModule } from './users-form/users-form.module';

@NgModule({
  declarations: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    PropertiesGridComponent,
    LocationFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    AtomsModule,
    MoleculesModule,
    UsersFormModule
  ],
  exports: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    PropertiesGridComponent,
    LocationFormComponent,
    UsersFormModule
  ]
})
export class OrganismsModule { } 