import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationFormComponent } from './location-form.component';
import { MoleculesModule } from '../../molecules/molecules.module';
import { AtomsModule } from '../../atoms/atoms.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    LocationFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MoleculesModule,
    AtomsModule,
    SharedModule
  ],
  exports: [
    LocationFormComponent
  ]
})
export class LocationFormModule { } 