import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from "../../services/employee.service";
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | undefined;
  successMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getEmployee(id);
    }
  }

  getEmployee(id: string) {
    this.employeeService.getEmployeeById(+id).subscribe(data => {
      this.employee = data;
    });
  }

  editEmployee() {
    if (this.employee) {
      this.router.navigate(['/employee/edit', this.employee.id]);
    }
  }

  deleteEmployee() {
    if (this.employee && window.confirm(`Are you sure to delete "${this.employee.name}"?`)) {
      this.employeeService.deleteEmployee(this.employee.id).subscribe(() => {
        this.successMessage = `${this.employee.name} has been deleted`;
        this.router.navigate(['/employees']).then(() => { window.location.reload(); });
      });
    }
  }

  goBack() {
    this.router.navigate(['/employees']);
  }
}