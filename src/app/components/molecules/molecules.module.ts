import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { SharedComponentsModule } from '@app/shared/shared-components.module';
import { DepartmentSelectComponent } from './department-select/department-select.component';
import { CitySelectComponent } from './city-select/city-select.component';
import { LocationListComponent } from './location-list/location-list.component';
import { CategorySelectComponent } from './category-select/category-select.component';

@NgModule({
  declarations: [
    CategoryFormComponent,
    CategoryListComponent,
    PropertyCardComponent,
    SearchFormComponent,
    DepartmentSelectComponent,
    CitySelectComponent,
    LocationListComponent,
    CategorySelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AtomsModule,
    SharedModule,
    SharedComponentsModule
  ],
  exports: [
    CategoryFormComponent,
    CategoryListComponent,
    PropertyCardComponent,
    SearchFormComponent,
    DepartmentSelectComponent,
    CitySelectComponent,
    LocationListComponent,
    CategorySelectComponent
  ],
  providers: [
    NotificationService
  ]
})
export class MoleculesModule { } 