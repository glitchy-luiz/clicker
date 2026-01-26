import { CommonModule } from '@angular/common';
import { afterNextRender, AfterRenderPhase, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss',
  imports: [CommonModule]
})
export class HomeComponent {
  qtd: number = 1
  pontos: number = 0
  pSegundos: number = 0
  luck = 0
  critico: number = 50
  v1: number = 10
  v2: number = 15
  v3: number = 50
  v4: number = 100

  constructor(private cdr: ChangeDetectorRef) {
    afterNextRender(() => {
      const id = setInterval(() => {
        this.pontos += this.pSegundos;
        this.crit()
        this.cdr.detectChanges()
      }, 1000);

    }, { phase: AfterRenderPhase.Write });
  }

  farmar(){
    this.pontos += this.qtd
    this.crit()
  }

  maisClick(){
    if(this.pontos < this.v1){
      return
    }
    this.pontos -= this.v1
    this.v1 += Math.round(this.v1/2)
    this.qtd += 1
  }

  clickSegundos(){
    if(this.pontos < this.v2){
      return
    }

    this.pontos -= this.v2
    this.v2 += Math.round(this.v2/2) + 5
    this.pSegundos += 1
  }

  sorte(){
    if(this.pontos < this.v3){
      return
    }

    this.pontos -= this.v3
    this.v3 = this.v3 *2
    this.luck += 5
  }

  crit(){
    const rng = Math.floor(Math.random() * (100 - 0))
    console.log(rng)
    if (rng <= this.luck){
      this.pontos += this.critico
      console.log('Critico!')
    }
  }

  maisCrit(){
    if(this.pontos < this.v4){
      return
    }

    this.pontos -= this.v4
    this.v4 = this.v4 * 3
    this.critico += 20
  }
}
