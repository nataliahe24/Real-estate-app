import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './category-layout/main-layout.component';
import { SidebarComponent } from '../organisms/sidebar/sidebar.component';
import { FooterComponent } from '../organisms/footer/footer.component';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { AtomsModule } from '../atoms/atoms.module';
import { PropertiesLayoutComponent } from './properties-layout/properties-layout.component';
import { NavbarComponent } from '../organisms/navbar/navbar.component';
@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent,
    FooterComponent,
    PropertiesLayoutComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedComponentsModule,
    AtomsModule
  ],
  exports: [
    MainLayoutComponent,
    SidebarComponent,
    FooterComponent,
    PropertiesLayoutComponent,
    NavbarComponent
  ],
})
export class TemplatesModule {} 