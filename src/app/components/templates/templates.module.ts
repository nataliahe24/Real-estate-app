import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './category-layout/main-layout.component';
import { SharedComponentsModule } from '../../shared/shared-components.module';
import { AtomsModule } from '../atoms/atoms.module';
import { PropertiesLayoutComponent } from './properties-layout/properties-layout.component';
import { SellerUserLayoutComponent } from './seller-user-layout/seller-user-layout.component';
import { OrganismsModule } from '../organisms/organisms.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
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
    MainLayoutComponent,
    PropertiesLayoutComponent,
    SellerUserLayoutComponent
  ]
})
export class TemplatesModule { } 