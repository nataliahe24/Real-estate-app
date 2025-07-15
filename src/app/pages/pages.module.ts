import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TemplatesModule } from '../components/templates/templates.module';
import { OrganismsModule } from '../components/organisms/organisms.module';
import { MoleculesModule } from '../components/molecules/molecules.module';
import { AtomsModule } from '../components/atoms/atoms.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { CategoriesComponent } from './categories/categories.component';
import { PropertiesComponent } from './properties/properties.component';
import { PublishPropertyComponent } from './publish-property/publish-property.component';
import { UsersComponent } from './users/users.component';
import { LocationsComponent } from './locations/locations.component';
import { LoginAuthComponent } from './login-auth/login-auth.component';
import { WellcomeAdminComponent } from './wellcome-admin/wellcome-admin.component';
import { WellcomeSellerComponent } from './wellcome-seller/wellcome-seller.component';
import { VisitComponent } from './visit/visit.component';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { AdminGuard } from '../core/guards/admin/admin.guard';
import { SellerGuard } from '../core/guards/seller/seller.guard'
import { BuyerVisitListComponent } from './buyer-visit-list/buyer-visit-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PropertiesComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'locations',
        component: LocationsComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'publish',
        component: PublishPropertyComponent,
        canActivate: [AuthGuard, SellerGuard]
      },
      {
        path: 'login',
        component: LoginAuthComponent
      },
      {
        path: 'wellcome-admin',
        component: WellcomeAdminComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'wellcome-seller',
        component: WellcomeSellerComponent,
        canActivate: [AuthGuard, SellerGuard]
      },
      {
        path: 'visit',
        component: VisitComponent,
        canActivate: [AuthGuard, SellerGuard]
      },
      {
        path: 'buyer-visit-list',
        component: BuyerVisitListComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [
    CategoriesComponent,
    PropertiesComponent,
    UsersComponent,
    PublishPropertyComponent,
    LocationsComponent,
    LoginAuthComponent,
    WellcomeAdminComponent,
    WellcomeSellerComponent,
    VisitComponent,
    BuyerVisitListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TemplatesModule,
    OrganismsModule,
    MoleculesModule,
    AtomsModule,
    SharedComponentsModule
  ],
  exports: [
    CategoriesComponent,
    PropertiesComponent,
    UsersComponent,
    PublishPropertyComponent,
    LocationsComponent,
    LoginAuthComponent,
    WellcomeAdminComponent,
    WellcomeSellerComponent,
    VisitComponent,
    BuyerVisitListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { } 