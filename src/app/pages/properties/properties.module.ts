import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AtomsModule } from '../../components/atoms/atoms.module';
import { MoleculesModule } from '../../components/molecules/molecules.module';
import { TemplatesModule } from '../../components/templates/templates.module';
import { PropertiesComponent } from './properties.component';

const routes: Routes = [
  {
    path: '',
    component: PropertiesComponent
  }
];

@NgModule({
  declarations: [
    PropertiesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AtomsModule,
    MoleculesModule,
    TemplatesModule
  ],
  exports: [
    PropertiesComponent
  ]
})
export class PropertiesModule { } 