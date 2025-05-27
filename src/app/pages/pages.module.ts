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
        component: CategoriesComponent
      },
      {
        path: 'locations',
        component: LocationsComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'publish',
        component: PublishPropertyComponent
      },
      {
        path: 'login',
        component: LoginAuthComponent
      },
      {
        path: 'wellcome-admin',
        component: WellcomeAdminComponent
      },
      {
        path: 'wellcome-seller',
        component: WellcomeSellerComponent
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
    WellcomeSellerComponent
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
    WellcomeSellerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { } 