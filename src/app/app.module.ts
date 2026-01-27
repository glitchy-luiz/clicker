import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './core/pages/home/home/home.component';
import { CriticoComponent } from './core/components/critico/critico.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeComponent,
    CriticoComponent
  ]
})
export class AppModule { }
