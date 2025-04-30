import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedComponentsModule } from './shared/shared-components.module';
import { OrganismsModule } from './components/organisms/organisms.module';

// Importamos el AppRoutingModule al final para asegurarnos de que todos los módulos
// necesarios para las rutas ya están cargados
import { AppRoutingModule } from './app-routing.module';

// Comentamos la importación de TemplatesModule para evitar el error
// import { TemplatesModule } from './components/templates/templates.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    CoreModule,
    SharedComponentsModule,
    OrganismsModule,
    // Comentamos la importación de TemplatesModule en los imports
    // TemplatesModule,
    // Dejamos AppRoutingModule al final
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
