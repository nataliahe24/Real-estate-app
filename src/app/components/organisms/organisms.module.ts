import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { CategoryManagerComponent } from './category-manager/category-manager.component';

@NgModule({
  declarations: [
    CategoryManagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule
  ],
  exports: [
    CategoryManagerComponent
  ]
})
export class OrganismsModule {} 