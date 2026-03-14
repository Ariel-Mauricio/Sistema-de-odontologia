import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory-management',
  template: `
    <section class="page-shell inventory-screen">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Inventario</h1>
          <p class="page-subtitle">Control de materiales y suministros dentales.</p>
        </div>
        <button (click)="openForm()" class="primary-btn">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Artículo
        </button>
      </div>

      <!-- Metric cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="kpi-card border-l-4 border-rose-400">
          <div class="flex items-start justify-between">
            <div>
              <p class="kpi-label">Stock Bajo</p>
              <p class="kpi-value mt-1 text-rose-600">{{ lowStockCount }}</p>
              <p class="mt-1 text-xs text-slate-400">artículos por reponer</p>
            </div>
            <div class="kpi-icon bg-rose-50">
              <svg class="h-6 w-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="kpi-card border-l-4 border-indigo-400">
          <div class="flex items-start justify-between">
            <div>
              <p class="kpi-label">Total Artículos</p>
              <p class="kpi-value mt-1">{{ items.length }}</p>
              <p class="mt-1 text-xs text-slate-400">registros en sistema</p>
            </div>
            <div class="kpi-icon bg-indigo-50">
              <svg class="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="kpi-card border-l-4 border-emerald-400">
          <div class="flex items-start justify-between">
            <div>
              <p class="kpi-label">Valor Total</p>
              <p class="kpi-value mt-1 text-emerald-600">{{ getTotalValue() | currency:'USD':'symbol':'1.0-0' }}</p>
              <p class="mt-1 text-xs text-slate-400">en stock actual</p>
            </div>
            <div class="kpi-icon bg-emerald-50">
              <svg class="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter Chips -->
      <div class="flex flex-wrap gap-2">
        <button (click)="activeCategory=''; applyFilter()"
          [ngClass]="activeCategory==='' ? 'filter-chip filter-chip-active' : 'filter-chip'">
          Todos
        </button>
        <button *ngFor="let cat of getCategories()" (click)="activeCategory=cat; applyFilter()"
          [ngClass]="activeCategory===cat ? 'filter-chip filter-chip-active' : 'filter-chip'">
          {{ cat }}
        </button>
      </div>

      <!-- New Item Modal -->
      <div *ngIf="showForm" class="modal-overlay" (click)="closeOnBackdrop($event)">
        <div class="modal-box overflow-y-auto max-h-[92vh]" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Nuevo Artículo</h2>
            <button (click)="closeForm()" class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="field-label">Nombre</label>
                <input type="text" formControlName="name" class="field-input">
              </div>
              <div>
                <label class="field-label">Categoría</label>
                <input type="text" formControlName="category" class="field-input">
              </div>
              <div>
                <label class="field-label">SKU</label>
                <input type="text" formControlName="sku" class="field-input">
              </div>
              <div>
                <label class="field-label">Unidad</label>
                <input type="text" formControlName="unit" class="field-input" placeholder="unidad, caja, ml…">
              </div>
              <div>
                <label class="field-label">Cantidad inicial</label>
                <input type="number" formControlName="quantity" class="field-input">
              </div>
              <div>
                <label class="field-label">Stock mínimo</label>
                <input type="number" formControlName="minimum_stock" class="field-input">
              </div>
              <div>
                <label class="field-label">Costo unitario</label>
                <input type="number" formControlName="unit_cost" step="0.01" class="field-input">
              </div>
              <div>
                <label class="field-label">Descripción</label>
                <input type="text" formControlName="description" class="field-input">
              </div>
            </div>
            <div class="mt-6 flex gap-3">
              <button type="submit" class="primary-btn flex-1">Guardar</button>
              <button type="button" (click)="closeForm()" class="secondary-btn flex-1">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Inventory Item Cards Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        <div *ngFor="let item of filteredItems" class="inv-item group"
          [ngClass]="isLowStock(item) ? 'border-rose-200 bg-rose-50/40' : ''">

          <!-- Category + name -->
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <span class="text-[10px] font-bold uppercase tracking-wide"
                [ngClass]="isLowStock(item) ? 'text-rose-500' : 'text-indigo-500'">
                {{ item.category }}
              </span>
              <p class="mt-0.5 font-semibold text-slate-900 leading-snug">{{ item.name }}</p>
              <p class="text-xs text-slate-400 font-mono">{{ item.sku }}</p>
            </div>
            <span class="status-pill shrink-0"
              [ngClass]="isLowStock(item) ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'">
              {{ isLowStock(item) ? 'Stock Bajo' : 'OK' }}
            </span>
          </div>

          <!-- Stock level bar -->
          <div>
            <div class="mb-1.5 flex justify-between text-xs">
              <span class="text-slate-500">Stock actual / mínimo</span>
              <span class="font-semibold" [ngClass]="isLowStock(item) ? 'text-rose-600' : 'text-slate-700'">
                {{ item.quantity }} / {{ item.minimum_stock }}
              </span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill"
                [ngClass]="isLowStock(item) ? 'bg-rose-400' : 'bg-emerald-400'"
                [style.width]="getStockPercent(item)+'%'">
              </div>
            </div>
          </div>

          <!-- Cost + unit -->
          <div class="flex items-center justify-between border-t border-slate-100 pt-2 text-sm">
            <span class="text-slate-500">Costo unit. · {{ item.unit }}</span>
            <span class="font-semibold text-slate-900">{{ item.unit_cost | currency }}</span>
          </div>

        </div>

        <!-- Empty state -->
        <div *ngIf="filteredItems.length === 0"
          class="col-span-full flex flex-col items-center py-16 text-slate-400">
          <svg class="mb-3 h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <p class="text-sm">No hay artículos en esta categoría</p>
        </div>

      </div>
    </section>
  `,
  styles: []
})
export class InventoryManagementComponent implements OnInit {
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  itemForm!: FormGroup;
  showForm = false;
  lowStockCount = 0;
  activeCategory = '';

  constructor(private inventoryService: InventoryService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadItems();
  }

  initForm(): void {
    this.itemForm = this.formBuilder.group({
      name:          ['', Validators.required],
      category:      ['', Validators.required],
      sku:           ['', Validators.required],
      quantity:      ['', Validators.required],
      minimum_stock: ['', Validators.required],
      unit:          ['', Validators.required],
      unit_cost:     ['', Validators.required],
      description:   ['']
    });
  }

  loadItems(): void {
    this.inventoryService.getAllItems().subscribe({
      next: (res) => {
        this.items = res.data || [];
        this.lowStockCount = this.items.filter(i => this.isLowStock(i)).length;
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    this.filteredItems = this.activeCategory
      ? this.items.filter(i => i.category === this.activeCategory)
      : [...this.items];
  }

  getCategories(): string[] {
    return [...new Set(this.items.map(i => i.category).filter(Boolean))];
  }

  getStockPercent(item: InventoryItem): number {
    if (!item.minimum_stock) return 100;
    return Math.min(100, Math.round((item.quantity / (item.minimum_stock * 2)) * 100));
  }

  isLowStock(item: InventoryItem): boolean {
    return item.quantity <= item.minimum_stock;
  }

  getTotalValue(): number {
    return this.items.reduce((s, i) => s + (i.quantity * i.unit_cost), 0);
  }

  openForm(): void { this.showForm = true; this.itemForm.reset(); }
  closeForm(): void { this.showForm = false; this.itemForm.reset(); }
  closeOnBackdrop(e: MouseEvent): void { this.closeForm(); }

  onSubmit(): void {
    if (this.itemForm.invalid) return;
    this.inventoryService.createItem(this.itemForm.value).subscribe({
      next: () => { this.loadItems(); this.closeForm(); }
    });
  }
}

