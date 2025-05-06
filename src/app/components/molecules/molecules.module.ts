import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../atoms/atoms.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { PropertyCardComponent } from './property-card/property-card.component';

@NgModule({
  declarations: [
    CategoryFormComponent,
    CategoryListComponent,
    PropertyCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AtomsModule
  ],
  exports: [
    CategoryFormComponent,
    CategoryListComponent,
    PropertyCardComponent
  ]
})
export class MoleculesModule {} 