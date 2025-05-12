import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { AtomsModule } from '../atoms/atoms.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { CategoryFormComponent } from '../molecules/category-form/category-form.component';
import { NotificationComponent } from '../atoms/notification/notification.component';
import { PropertiesGridComponent } from './properties-grid/properties-grid.component';
import { LocationFormModule } from './location-form/location-form.module';


@NgModule({
  declarations: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    PropertiesGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    AtomsModule,
    MoleculesModule,
    LocationFormModule
  ],
  exports: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    CategoryFormComponent,
    PropertiesGridComponent,
    LocationFormModule
  ]
})
export class OrganismsModule {} 