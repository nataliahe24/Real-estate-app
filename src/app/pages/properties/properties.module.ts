import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AtomsModule } from '../../components/atoms/atoms.module';
import { MoleculesModule } from '../../components/molecules/molecules.module';

import { PropertiesComponent } from './properties.component';

@NgModule({
  declarations: [
    PropertiesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AtomsModule,
    MoleculesModule
  ],
  exports: [
    PropertiesComponent
  ]
})
export class PropertiesModule { 
  // Remove this invalid code
} 