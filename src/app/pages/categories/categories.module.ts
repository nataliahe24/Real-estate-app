import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { OrganismsModule } from '../../components/organisms/organisms.module';
import { AtomsModule } from '../../components/atoms/atoms.module';
import { NotificationContainerComponent } from '../../components/organisms/notification-container/notification-container.component';

@NgModule({
  declarations: [
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    OrganismsModule,
    AtomsModule,
    RouterModule.forChild([
      { path: '', component: CategoriesComponent }
    ])
  ],
  exports: [
    CategoriesComponent
  ]
})
export class CategoriesModule { } 