import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { AtomsModule } from '../atoms/atoms.module';
import { PropertiesLayoutComponent } from './properties-layout/properties-layout.component';
import { SellerUserLayoutComponent } from './seller-user-layout/seller-user-layout.component';
import { OrganismsModule } from '../organisms/organisms.module';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    PropertiesLayoutComponent,
    SellerUserLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedComponentsModule,
    AtomsModule,
    OrganismsModule
  ],
  exports: [
    AdminLayoutComponent,
    PropertiesLayoutComponent,
    SellerUserLayoutComponent
  ]
})
export class TemplatesModule { } 