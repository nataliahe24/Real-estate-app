import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { NotificationService } from '@app/core/services/notifications/notification.service';
import { SharedComponentsModule } from '@app/shared/shared-components.module';
import { DepartmentSelectComponent } from './department-select/department-select.component';
import { CitySelectComponent } from './city-select/city-select.component';
import { LocationListComponent } from './location-list/location-list.component';
import { CategorySelectComponent } from './category-select/category-select.component';
import { LocationSelectComponent } from './location-select/location-select.component';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';
import { PropertySelectComponent } from './property-select/property-select.component';
import { VisitModalComponent } from './visit-modal/visit-modal.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    CategoryFormComponent,
    PropertyCardComponent,
    SearchFormComponent,
    DepartmentSelectComponent,
    CitySelectComponent,
    LocationListComponent,
    CategorySelectComponent,
    LocationSelectComponent,
    FiltersModalComponent,
    PropertySelectComponent,
    VisitModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AtomsModule,
    SharedComponentsModule,
    MatDialogModule
    
    
  ],
  exports: [
    CategoryFormComponent,
    PropertyCardComponent,
    SearchFormComponent,
    DepartmentSelectComponent,
    CitySelectComponent,
    LocationListComponent,
    CategorySelectComponent,
    LocationSelectComponent,
    FiltersModalComponent,
    PropertySelectComponent,
    VisitModalComponent
  ],
  providers: [
    NotificationService
  ]
})
export class MoleculesModule { } 