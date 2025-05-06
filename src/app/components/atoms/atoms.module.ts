import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { NotificationComponent } from './notification/notification.component';
import { LogoComponent } from './logo/logo.component';
import { CategorySelectComponent } from './category-select/category-select.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    NotificationComponent,
    LogoComponent,
    CategorySelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    NotificationComponent,
    LogoComponent,
    CategorySelectComponent
  ]
})
export class AtomsModule {} 