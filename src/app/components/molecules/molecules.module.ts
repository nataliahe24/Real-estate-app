import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { PropertySearchComponent } from './property-search/property-search.component';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { SharedComponentsModule } from '@app/shared/shared-components.module';


@NgModule({
  declarations: [
    CategoryFormComponent,
    CategoryListComponent,
    PropertyCardComponent,
    PropertySearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AtomsModule,
    SharedModule,
    SharedComponentsModule
  ],
  exports: [
    CategoryFormComponent,
    CategoryListComponent,
    PropertyCardComponent,
    PropertySearchComponent
  ],
  providers: [
    NotificationService
  ]
})
export class MoleculesModule {} 