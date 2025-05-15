import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersFormComponent } from './users-form.component';
import { AtomsModule } from '../../atoms/atoms.module';

@NgModule({
  declarations: [UsersFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AtomsModule
  ],
  exports: [UsersFormComponent]
})
export class UsersFormModule { } 