import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AtomsModule } from '../../components/atoms/atoms.module';
import { MoleculesModule } from '../../components/molecules/molecules.module';
import { TemplatesModule } from '../../components/templates/templates.module';
import { OrganismsModule } from '../../components/organisms/organisms.module';
import { PublishPropertyComponent } from './publish-property.component';

const routes: Routes = [
  {
    path: '',
    component: PublishPropertyComponent
  }
];

@NgModule({
  declarations: [
    PublishPropertyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AtomsModule,
    TemplatesModule,
    OrganismsModule,
    MoleculesModule,
    ReactiveFormsModule
  ],
  exports: [
    PublishPropertyComponent
  ]
})
export class PublishPropertyModule { } 