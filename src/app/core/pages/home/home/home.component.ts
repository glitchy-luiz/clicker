import { CommonModule } from '@angular/common';
import { afterNextRender, AfterRenderPhase, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { CriticoComponent } from '../../../components/critico/critico.component';
import { IConquista } from '../../../interfaces/conquista';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss',
  imports: [CommonModule],
  providers: [CriticoComponent]
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
  conquistas: IConquista[] = []
  buffs = {
    qtd: 0,
    ps: 0,
    desc: 0,
    mult: 1,
    bonus: 0
  }
  gastos: number = 0

  constructor(private cdr: ChangeDetectorRef, private critComponent: CriticoComponent) {
    afterNextRender(() => {
      const id = setInterval(() => {
        this.pontos += this.pSegundos + this.buffs.ps;
        this.crit()
        this.cdr.detectChanges()
      }, 1000);

    }, { phase: AfterRenderPhase.Write });
  }

  farmar(){
    this.pontos += this.qtd + this.buffs.qtd
    this.crit()
  }

  maisClick(){
    if(this.pontos < this.v1){
      return
    }
    this.pontos -= this.v1 - Math.floor(this.v1 * this.buffs.desc)
    this.gastos += this.v1 - Math.floor(this.v1 * this.buffs.desc)

    // this.v1 += Math.round(this.v1/2)
    this.v1 += 5
    this.qtd += 1
  }

  clickSegundos(){
    if(this.pontos < this.v2){
      return
    }

    this.pontos -= this.v2 - Math.floor(this.v2 * this.buffs.desc)
    this.gastos += this.v2 - Math.floor(this.v2 * this.buffs.desc)
    this.v2 += Math.round(this.v2/2)
    this.pSegundos += 1
  }

  sorte(){
    if(this.pontos < this.v3){
      return
    }

    this.pontos -= this.v3- Math.floor(this.v3 * this.buffs.desc)
    this.gastos += this.v3 - Math.floor(this.v3 * this.buffs.desc)
    this.v3 = this.v3 *2
    this.luck += 5
  }

  crit(){
    const rng = Math.floor(Math.random() * (100 - 0))
    console.log(rng)
    if (rng < this.luck){
      this.pontos += this.critico
      console.log('Critico!')

      this.showCrit()
    }
  }
  
  floatingNumbers: { id: number; x: number; y: number; valor: number; isCrit: boolean }[] = [];
  private nextId = 0;
  showCrit(){
    const rect = (document.getElementById('pontos') as HTMLElement)?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width/2 + (Math.random()*60 - 30) : window.innerWidth/2;
    const y = rect ? rect.top + (Math.random()*40 - 20) : window.innerHeight/2;
    const isCrit =true
    this.floatingNumbers.push({
      id: this.nextId++,
      x,
      y,
      valor: this.critico,
      isCrit
    });

    // Remove após 2 segundos
    setTimeout(() => {
      this.floatingNumbers = this.floatingNumbers.filter(n => n.id !== this.nextId-1);
    }, 2000);
  }

  maisCrit(){
    if(this.pontos < this.v4){
      return
    }

    this.pontos -= this.v4 - Math.floor(this.v4 * this.buffs.desc)
    this.gastos += this.v4 - Math.floor(this.v4 * this.buffs.desc)
    this.v4 = this.v4 * 3
    this.critico += 25
  }

  reset(){
    this.validaConquista()
    this.qtd = 1
    this.pontos = 0
    this.pSegundos = 0
    this.luck = 0
    this.critico = 50
    this.v1 = 10
    this.v2 = 15
    this.v3 = 50
    this.v4 = 100
    this.gastos = 0

  }

  validaConquista(){
    const c1:IConquista = {
      nome: 'dinheiro',
      desc: '+5 ponto permanente',
      requisito: 'pontue 500'
    }
    const c2:IConquista = {
      nome: 'segundos',
      desc: '+5 ponto/segundo permanente',
      requisito: 'tenha 5 pontos/segundo'
    }
    const c3:IConquista = {
      nome: 'economico',
      desc: '10% desconto permanente',
      requisito: 'pontue 500 gastando menos de 100'
    }

    if (this.pontos > 500){
      if (!this.conquistas.includes(c1)){
        this.conquistas.push(c1)
      }
    }
    if (this.pSegundos >= 5){
      if (!this.conquistas.includes(c2)){
        this.conquistas.push(c2)
      }
    }
    if (this.gastos < 100 && this.pontos >= 500){
      if (!this.conquistas.includes(c3)){
        this.conquistas.push(c3)
      }
    }

    if (this.conquistas.includes(c1)){
      this.buffs.qtd = 5
    }
    if (this.conquistas.includes(c2)){
      this.buffs.ps = 5
    }
    if(this.conquistas.includes(c3)){
      this.buffs.desc = 0.1
    }

    console.log(this.conquistas)
  }
}
