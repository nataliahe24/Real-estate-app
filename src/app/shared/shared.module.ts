import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtomsModule } from '../components/atoms/atoms.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AtomsModule
  ],
  exports: [
    AtomsModule
  ]
})
export class SharedModule { } 