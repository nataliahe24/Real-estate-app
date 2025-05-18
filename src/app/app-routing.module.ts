import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/templates/category-layout/main-layout.component';
import { PropertiesLayoutComponent } from './components/templates/properties-layout/properties-layout.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { PublishPropertyComponent } from './pages/publish-property/publish-property.component';

const routes: Routes = [

  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)
  },
  {
    path: 'properties',
    loadChildren: () => import('./pages/properties/properties.module').then(m => m.PropertiesModule)
  },
  {
    path: 'locations',
    loadChildren: () => import('./pages/locations/locations.module').then(m => m.LocationsModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'publish',
    loadChildren: () => import('./pages/publish-property/publish-property.module').then(m => m.PublishPropertyModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
