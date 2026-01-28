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
  pontos: number = 5000

  pSegundos: number = 0
  luck = 0
  critico: number = 50
  v1: number = 10
  v2: number = 15
  v3: number = 50
  v4: number = 100

  gastos: number = 0
  upgrades: number = 0
  resetPcento: number = 0.01

  conquistas: IConquista[] = []
  conquistasLista: IConquista[] = [
    {
      nome: 'dinheiro',
      desc: '+5 ponto permanente',
      requisito: 'pontue 500',
      condicao: 'pontos > 500',
      bonus: 'qtd += 5',
    },
    {
      nome: 'segundos',
      desc: '+5 ponto/segundo permanente',
      requisito: 'tenha 5 pontos/segundo',
      condicao: 'pSegundos >= 5',
      bonus: 'ps += 5',
    },
    {
      nome: 'economico',
      desc: '10% desconto permanente',
      requisito: 'pontue 500 gastando menos de 100',
      condicao: 'gastos < 100 && this.pontos >= 500',
      bonus: 'desc += 0.1',
    },
    {
      nome: 'dia de compras',
      desc: '10% de chance de ignorar o valor de uma compra',
      requisito: 'compre 30 upgrades',
      condicao: 'upgrades >= 30',
      bonus: 'ignora += 10',
    },
  ];
  buffs = {
    qtd: 0,
    ps: 0,
    desc: 0,
    mult: 1,
    bonus: 0,
    ignora: 0
  };

  floatingNumbers: { id: number; x: number; y: number; valor?: number; tipo: number }[] = [];
  nextId = 0;

  constructor(private cdr: ChangeDetectorRef) {
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

  // funções de upgrades
  maisClick(){
    const res = this.compra(this.v1)
    if(!res){return}
    this.v1 += 5
    this.qtd += 1
  }

  clickSegundos(){
    const res = this.compra(this.v2)
    if(!res){return}
    this.v2 += Math.round(this.v2/2)
    this.pSegundos += 1
  }

  sorte(){
    const res = this.compra(this.v3)
    if(!res){return}
    this.v3 = this.v3 *2
    this.luck += 5
  }

  maisCrit(){
    const res = this.compra(this.v4)
    if(!res){return}
    this.v4 = this.v4 * 3
    this.critico += 25
  }

  //funções de apoio e lógica
  crit(){
    const rng = Math.floor(Math.random() * (100 - 0))
    console.log(rng)
    if (rng < this.luck){
      this.pontos += this.critico
      console.log('Critico!')

      this.showNotification(1, this.critico)
    }
  }

  reset(){
    this.validaConquista()
    this.porcentagemReset()
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
    this.upgrades = 0
  }

  validaConquista(){
    for (let i = 0; i < this.conquistasLista.length; i++){
      this.verificaConquista(this.conquistasLista[i])
    }
  }

  porcentagemReset(){
    this.buffs.ps = Math.floor(this.gastos * this.resetPcento)
  }


  //funções de otimização e refatoramento
  compra(custo: number){
    if(this.pontos < custo){
      return false
    }

    let preco: number = custo - Math.floor(custo * this.buffs.desc)

    const rng = Math.floor(Math.random() * (100 - 0))
    if (rng < this.buffs.ignora){
      this.showNotification(2)
      preco = 0
    }
    this.pontos -= preco
    this.gastos += preco
    this.upgrades += 1
    return true
  }

  showNotification(tipo: number, dado?: number,){
    const rect = (document.getElementById('pontos') as HTMLElement)?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width/2 + (Math.random()*60 - 30) : window.innerWidth/2;
    const y = rect ? rect.top + (Math.random()*40 - 20) : window.innerHeight/2;
    const isCrit =true
    this.floatingNumbers.push({
      id: this.nextId++,
      x,
      y,
      valor: dado,
      tipo
    });

    setTimeout(() => {
      this.floatingNumbers = this.floatingNumbers.filter(n => n.id !== this.nextId-1);
    }, 2000);
  }

  verificaConquista(conq: IConquista){
    if (eval('this.' + conq.condicao)){
      if (!this.conquistas.includes(conq)){
        this.conquistas.push(conq)
        eval('this.buffs.' + conq.bonus)
      }
    }
  }
}
