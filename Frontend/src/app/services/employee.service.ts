import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7000/api/Employee'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  getEmployees(
    search?: string,
    sortField?: string,
    sortOrder?: string,
    filterField?: string,
    filterValue?: string
  ): Observable<Employee[]> {
    let params: any = {};

    if (search) {
      params.search = search;
    }
    if (sortField) {
      params.sortField = sortField;
    }
    if (sortOrder) {
      params.sortOrder = sortOrder;
    }
    if (filterField) {
      params.filterField = filterField;
    }
    if (filterValue) {
      params.filterValue = filterValue;
    }

    return this.http.get<Employee[]>(this.apiUrl, { params });
  }


  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}`, employee);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportToCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Export/CSV`, { responseType: 'blob' });
  }

  exportToPDF(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Export/PDF`, { responseType: 'blob' });
  }
}