import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../components/atoms/atoms.module';

@NgModule({
  declarations: [
    // Quitamos las declaraciones de componentes que ya están en AtomsModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AtomsModule // Importamos AtomsModule para usar sus componentes
  ],
  exports: [
    // Exportamos AtomsModule para que sus componentes estén disponibles
    AtomsModule,
    // Y también exportamos los módulos de formularios
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedComponentsModule {} 