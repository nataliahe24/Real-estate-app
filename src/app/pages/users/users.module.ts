import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { MoleculesModule } from '@app/components/molecules/molecules.module';
import { TemplatesModule } from '@app/components/templates/templates.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrganismsModule } from '@app/components/organisms/organisms.module';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    TemplatesModule,
    MoleculesModule,
    OrganismsModule
  ]
})
export class UsersModule { }
