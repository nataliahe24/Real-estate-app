import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/templates/category-layout/main-layout.component';
import { PropertiesLayoutComponent } from './components/templates/properties-layout/properties-layout.component';
import { PropertiesComponent } from './pages/properties/properties.component';

const routes: Routes = [

  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: 'properties',
    loadChildren: () => import('./pages/properties/properties.module').then(m => m.PropertiesModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
