import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './atoms/button/button.component';
import { SearchBarComponent } from './molecules/search-bar/search-bar.component';
import { NavBarComponent } from './organisms/nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    ButtonComponent,
    SearchBarComponent,
    NavBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    SearchBarComponent,
    NavBarComponent,
    RouterModule
  ]
})
export class SharedModule { } 