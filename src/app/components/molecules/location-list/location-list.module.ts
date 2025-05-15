import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationListComponent } from './location-list.component';

@NgModule({
  declarations: [
    LocationListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    LocationListComponent
  ]
})
export class LocationListModule { } 