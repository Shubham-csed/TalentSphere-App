import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = { id: 0, name: '', position: '', office: '', salary: 0, department: '', contactNumber: '', email: '', dateOfJoining: '', address: '', profilePicUrl: '' };
  isEdit: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeService.getEmployeeById(+id).subscribe(data => {
        this.employee = {
          ...data,
          dateOfJoining: this.formatDate(data.dateOfJoining) // Format the date for the input field
        };
      });
    } else {
      this.isEdit = false;
      this.employee = { id: 0, name: '', position: '', office: '', salary: 0, department: '', contactNumber: '', email: '', dateOfJoining: '', address: '', profilePicUrl: '' };
    }
  }

  /**
   * Formats a date string to 'YYYY-MM-DD' for the HTML input.
   */
  private formatDate(date: string): string {
    if (!date) return '';
    const jsDate = new Date(date); // Convert to a JavaScript Date object
    const year = jsDate.getFullYear();
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits
    const day = jsDate.getDate().toString().padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`;
  }

  /**
   * Saves the employee (either creates or updates based on `isEdit`).
   */
  saveEmployee() {
    if (!this.employee.dateOfJoining) {
      return alert("Date of Joining is required.");
    }

    const formattedEmployee = {
      ...this.employee,
      dateOfJoining: new Date(this.employee.dateOfJoining).toISOString(), // Convert back to ISO string
    };

    if (this.isEdit) {
      this.employeeService.updateEmployee(formattedEmployee).subscribe(
        () => {
          alert('Employee updated successfully');
          this.cancel();
        },
        (error) => {
          console.error('Error updating employee:', error);
        }
      );
    } else {
      this.employeeService.createEmployee(formattedEmployee).subscribe(
        () => {
          alert('Employee added successfully');
          this.cancel();
        },
        (error) => {
          console.error('Error creating employee:', error);
        }
      );
    }
  }

  /**
   * Navigates back to the employee list.
   */
  cancel() {
    this.router.navigate(['/employees']);
  }
}
