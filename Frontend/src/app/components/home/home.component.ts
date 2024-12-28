import { Component, OnInit } from '@angular/core';
import { EmployeeService } from "../../services/employee.service";
import { Employee } from 'src/models/employee.model';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalEmployees: number = 0;
  departmentCounts: { [key: string]: number } = {};
  recentEmployees: Employee[] = [];
  averageSalary: number = 0;
  joiningTrends: { month: string, count: number }[] = [];
  departmentChartLabels: string[] = [];
  departmentChartData: number[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      // Total Employees
      this.totalEmployees = employees.length;

      // Employees by Department
      this.departmentCounts = employees.reduce((acc, employee) => {
        acc[employee.department] = (acc[employee.department] || 0) + 1;
        return acc;
      }, {});
      this.departmentChartLabels = Object.keys(this.departmentCounts);
      this.departmentChartData = Object.values(this.departmentCounts);

      // Recently Added Employees
      this.recentEmployees = employees.slice(-5);

      // Average Salary
      const totalSalary = employees.reduce((sum, employee) => sum + employee.salary, 0);
      this.averageSalary = employees.length ? totalSalary / employees.length : 0;

      // Joining Trends
      const monthCounts = employees.reduce((acc, employee) => {
        const month = new Date(employee.dateOfJoining).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      this.joiningTrends = Object.entries(monthCounts).map(([month, count]) => ({ month, count: Number(count) }));

      // Render Charts
      this.renderDepartmentChart();
      this.renderJoiningTrendsChart();
    });
  }

  renderDepartmentChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.departmentChartLabels,
        datasets: [{
          data: this.departmentChartData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  renderJoiningTrendsChart(): void {
    const ctx = document.getElementById('joiningTrendsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.joiningTrends.map(item => item.month),
        datasets: [{
          label: 'Employees Joined',
          data: this.joiningTrends.map(item => item.count),
          backgroundColor: '#36A2EB',
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Count'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
}
