import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from '../organisms/sidebar/sidebar.component';
import { FooterComponent } from '../organisms/footer/footer.component';
import { SharedComponentsModule } from '../../shared/shared-components.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedComponentsModule
  ],
  exports: [
    MainLayoutComponent,
    SidebarComponent,
    FooterComponent
  ],
})
export class TemplatesModule {} 