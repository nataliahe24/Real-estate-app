import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    NotificationComponent
  ]
})
export class AtomsModule {} 