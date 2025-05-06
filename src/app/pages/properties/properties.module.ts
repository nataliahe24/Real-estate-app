import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AtomsModule } from '../../components/atoms/atoms.module';

import { PropertiesComponent } from './properties.component';

@NgModule({
  declarations: [
    PropertiesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AtomsModule
  ],
  exports: [
    PropertiesComponent
  ]
})
export class PropertiesModule { 
  // Remove this invalid code
} 