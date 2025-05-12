import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LocationsComponent } from './locations.component';
import { TemplatesModule } from '../../components/templates/templates.module';
import { MoleculesModule } from '../../components/molecules/molecules.module';
import { AtomsModule } from '../../components/atoms/atoms.module';
import { OrganismsModule } from '../../components/organisms/organisms.module';
import { SharedModule } from '../../shared/shared.module';
import { LocationFormModule } from '@app/components/organisms/location-form/location-form.module';

const routes: Routes = [
  {
    path: '',
    component: LocationsComponent
  }
];

@NgModule({
  declarations: [
    LocationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TemplatesModule,
    MoleculesModule,
    AtomsModule,
    OrganismsModule,
    SharedModule,
    LocationFormModule
  ]
})
export class LocationsModule { } 