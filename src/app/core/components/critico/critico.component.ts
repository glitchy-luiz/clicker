import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-critico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './critico.component.html',
  styleUrl: './critico.component.scss'
})
export class CriticoComponent {

  floatingNumbers: { id: number; x: number; y: number; valor: number; isCrit: boolean }[] = [];
  private nextId = 0;

  showCrit(critico:number, rect: DOMRect){
    console.log('teste')
    const x = rect ? rect.left + rect.width/2 + (Math.random()*60 - 30) : window.innerWidth/2;
    const y = rect ? rect.top + (Math.random()*40 - 20) : window.innerHeight/2;
    const isCrit =true
    this.floatingNumbers.push({
      id: this.nextId++,
      x,
      y,
      valor: critico,
      isCrit
    });

    // Remove após 2 segundos
    setTimeout(() => {
      this.floatingNumbers = this.floatingNumbers.filter(n => n.id !== this.nextId-1);
    }, 2000);
  }
}
