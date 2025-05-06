import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/templates/main-layout/main-layout.component';
import { PropertiesLayoutComponent } from './components/templates/properties-layout/properties-layout.component';
import { PropertiesComponent } from './pages/properties/properties.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'categories',
        loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'properties',
    component: PropertiesLayoutComponent,
    children: [
      {
        path: '',
        component: PropertiesComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
