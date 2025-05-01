// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<{message: string, type: 'success' | 'error'} | null>(null);
  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ message, type: 'success' });
  }

  showError(message: string): void {
    this.toastSubject.next({ message, type: 'error' });
  }

  clear(): void {
    this.toastSubject.next(null);
  }
}