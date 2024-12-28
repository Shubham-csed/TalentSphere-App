import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from "../../services/employee.service";
import { Employee } from 'src/models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  successMessage: string | null = null;
  searchTerm: string = '';
  sortField: string = '';
  sortOrder: string = '';
  filterField: string = '';
  filterValue: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getEmployees(this.searchTerm).subscribe(data => {
      this.employees = data;
    });
  }

  applyFiltersAndSort() {
    this.employeeService.getEmployees(this.searchTerm, this.sortField, this.sortOrder, this.filterField, this.filterValue)
      .subscribe(data => {
        this.employees = data;
      });
  }

  onSearchChange(searchValue: string): void {
    this.searchTerm = searchValue;
    this.getEmployees();
  }

  viewDetails(id: number) {
    this.router.navigate(['/employee', id]);
  }

  editEmployee(id: number) {
    this.router.navigate(['/employee/edit', id]);
  }

  deleteEmployee(id: number) {
    const employee = this.employees.find(emp => emp.id === id);
    if (employee && window.confirm(`Are you sure to delete "${employee.name}"?`)) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.successMessage = `${employee.name} has been deleted`;
        this.getEmployees();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      });
    }
  }

  addEmployee() {
    this.router.navigate(['/employee/new']);
  }

  /**
   * Exports the employee list as a CSV file.
   */
  exportToCSV() {
    this.employeeService.exportToCSV().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'employees.csv';
      link.click();
    });
  }

  /**
   * Exports the employee list as a PDF file.
   */
  exportToPDF() {
    this.employeeService.exportToPDF().subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'employees.pdf';
      link.click();
    });
  }

  /**
   * Prints the employee list.
   */
  printEmployeeList() {
    window.print();
  }
}
