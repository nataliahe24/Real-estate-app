import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { TemplatesModule } from '../../components/templates/templates.module';
import { OrganismsModule } from '../../components/organisms/organisms.module';
import { AtomsModule } from '../../components/atoms/atoms.module';


const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  }
];

@NgModule({
  declarations: [
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    TemplatesModule,
    OrganismsModule,
    AtomsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CategoriesComponent
  ]
})
export class CategoriesModule { } 