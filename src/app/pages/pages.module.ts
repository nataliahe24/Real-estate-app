import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TemplatesModule } from '../components/templates/templates.module';
import { OrganismsModule } from '../components/organisms/organisms.module';


import { MoleculesModule } from '../components/molecules/molecules.module';
import { CategoriesComponent } from './categories/categories.component';
import { PropertiesComponent } from './properties/properties.component';

@NgModule({
  declarations: [
    CategoriesComponent,
    PropertiesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TemplatesModule,
    OrganismsModule,
    MoleculesModule
  ],
  exports: [
    CategoriesComponent,
    PropertiesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { } 