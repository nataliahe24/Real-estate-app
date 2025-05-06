import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { PropertySearchComponent } from './property-search/property-search.component';

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
    AtomsModule
  ],
  exports: [
    CategoryFormComponent,
    CategoryListComponent,
    PropertyCardComponent,
    PropertySearchComponent
  ]
})
export class MoleculesModule {} 