import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { OrganismsModule } from '../../components/organisms/organisms.module';

@NgModule({
  declarations: [
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    OrganismsModule,
    RouterModule.forChild([
      { path: '', component: CategoriesComponent }
    ])
  ],
  exports: [
    CategoriesComponent
  ]
})
export class CategoriesModule { } 