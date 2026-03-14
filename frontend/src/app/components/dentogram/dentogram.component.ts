import { Component, OnInit } from '@angular/core';
import { DentogramService } from '../../services/dentogram.service';
import { ActivatedRoute } from '@angular/router';
import { Dentogram, Tooth } from '../../models/dentogram.model';

@Component({
  selector: 'app-dentogram',
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Odontograma Digital</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-8 gap-2 mb-8">
          <div *ngFor="let tooth of toothNumbers" 
               (click)="selectTooth(tooth)"
               [ngClass]="getToothClass(tooth)"
               class="aspect-square rounded-lg cursor-pointer flex items-center justify-center font-bold text-sm transition">
            {{ tooth }}
          </div>
        </div>

        <div *ngIf="selectedTooth" class="bg-blue-50 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Diente {{ selectedTooth }}</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Estado</label>
              <select 
                [(ngModel)]="teeth[selectedTooth].status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="healthy">Sano</option>
                <option value="caries">Caries</option>
                <option value="restoration">Restauración</option>
                <option value="crown">Corona</option>
                <option value="implant">Implante</option>
                <option value="extraction">Extracción</option>
                <option value="prosthesis">Prótesis</option>
                <option value="endodontics">Endodoncia</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2">Notas</label>
              <input 
                type="text" 
                [(ngModel)]="teeth[selectedTooth].notes"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
          </div>

          <button (click)="saveDentogram()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DentogramComponent implements OnInit {
  patientId: number = 0;
  dentogram: Dentogram | null = null;
  teeth: { [key: string]: Tooth } = {};
  toothNumbers = Array.from({length: 32}, (_, i) => i + 11);
  selectedTooth: number | null = null;

  constructor(
    private dentogramService: DentogramService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = params['patientId'];
      this.loadDentogram();
    });
  }

  loadDentogram(): void {
    this.dentogramService.getDentogram(this.patientId).subscribe({
      next: (data) => {
        this.dentogram = data;
        this.teeth = data.teeth_data;
      }
    });
  }

  selectTooth(tooth: number): void {
    this.selectedTooth = tooth;
  }

  getToothClass(tooth: number): string {
    const status = this.teeth[tooth]?.status;
    const statusClasses: { [key: string]: string } = {
      'healthy': 'bg-green-100 border-2 border-green-500 text-green-800',
      'caries': 'bg-red-100 border-2 border-red-500 text-red-800',
      'restoration': 'bg-yellow-100 border-2 border-yellow-500 text-yellow-800',
      'crown': 'bg-purple-100 border-2 border-purple-500 text-purple-800',
      'implant': 'bg-blue-100 border-2 border-blue-500 text-blue-800',
      'extraction': 'bg-gray-100 border-2 border-gray-500 text-gray-800'
    };
    return (statusClasses[status] || 'bg-gray-200 border-2 border-gray-400') + (this.selectedTooth === tooth ? ' ring-4 ring-offset-2' : '');
  }

  saveDentogram(): void {
    if (this.dentogram) {
      this.dentogram.teeth_data = this.teeth;
      this.dentogramService.updateDentogram(this.patientId, this.dentogram).subscribe({
        next: () => {
          console.log('Dentograma guardado');
        }
      });
    }
  }
}
