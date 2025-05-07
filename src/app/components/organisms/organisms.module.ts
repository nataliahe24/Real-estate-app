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

@NgModule({
  declarations: [
    CategoryManagerComponent,
    NotificationContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    AtomsModule,
    MoleculesModule
  ],
  exports: [
    CategoryManagerComponent,
    NotificationContainerComponent,
    CategoryFormComponent
  ]
})
export class OrganismsModule {} 