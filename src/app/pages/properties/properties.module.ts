import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PropertiesComponent } from './properties.component';

@NgModule({
  declarations: [
    PropertiesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    PropertiesComponent
  ]
})
export class PropertiesModule { } 