import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getRevenueStats(period: 'month' | 'year' = 'month'): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue/${period}`);
  }
}
