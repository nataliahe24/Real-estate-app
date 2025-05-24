import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { TextareaComponent } from './textarea/textarea.component';
import { NotificationComponent } from './notification/notification.component';
import { LogoComponent } from './logo/logo.component';
import { PropertyStatusLabelComponent } from './property-status-label/property-status-label.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    NotificationComponent,
    LogoComponent,
    PropertyStatusLabelComponent,
    PasswordInputComponent,
    LogoutButtonComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    NotificationComponent,
    LogoComponent,
    PropertyStatusLabelComponent,
    PasswordInputComponent,
    LogoutButtonComponent
  ]
})
export class AtomsModule { } 