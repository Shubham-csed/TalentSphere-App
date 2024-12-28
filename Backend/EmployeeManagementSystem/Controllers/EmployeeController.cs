using Microsoft.AspNetCore.Mvc;
using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees(
            [FromQuery] string? search = null,
            [FromQuery] string? sortField = null,
            [FromQuery] string? sortOrder = null)
        {
            IQueryable<Employee> query = _context.Employees;

            // Search
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(e => e.Name.Contains(search) || e.Position.Contains(search));
            }
            
            // Sort
            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField.ToLower())
                {
                    case "name":
                        query = sortOrder == "desc" ? query.OrderByDescending(e => e.Name) : query.OrderBy(e => e.Name);
                        break;
                    case "salary":
                        query = sortOrder == "desc" ? query.OrderByDescending(e => e.Salary) : query.OrderBy(e => e.Salary);
                        break;
                    case "position":
                        query = sortOrder == "desc" ? query.OrderByDescending(e => e.Position) : query.OrderBy(e => e.Position);
                        break;
                    default:
                        break;
                }
            }

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            if (employee.DateOfJoining == default)
            {
                return BadRequest("Date of Joining is invalid or missing.");
            }

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Employees.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Export Employees to CSV
        [HttpGet("Export/CSV")]
        public IActionResult ExportToCSV()
        {
            var employees = _context.Employees.ToList();
            var csvBuilder = new StringBuilder();

            csvBuilder.AppendLine("Id,Name,Position,Office,Salary,DateOfJoining");

            foreach (var employee in employees)
            {
                csvBuilder.AppendLine($"{employee.Id},{employee.Name},{employee.Position},{employee.Office},{employee.Salary},{employee.DateOfJoining:yyyy-MM-dd}");
            }

            var bytes = Encoding.UTF8.GetBytes(csvBuilder.ToString());
            return File(bytes, "text/csv", "employees.csv");
        }

        // Export Employees to PDF
        [HttpGet("Export/PDF")]
        public IActionResult ExportToPDF()
        {
            var employees = _context.Employees.ToList();
            using (var stream = new MemoryStream())
            {
                var document = new Document(PageSize.A4, 10, 10, 10, 10);
                var writer = PdfWriter.GetInstance(document, stream);
                document.Open();

                // Title
                var titleFont = FontFactory.GetFont("Arial", 16, Font.BOLD);
                var paragraph = new Paragraph("Employee List", titleFont)
                {
                    Alignment = Element.ALIGN_CENTER,
                    SpacingAfter = 20
                };
                document.Add(paragraph);

                // Table
                var table = new PdfPTable(6) { WidthPercentage = 100 };
                table.AddCell("Id");
                table.AddCell("Name");
                table.AddCell("Position");
                table.AddCell("Office");
                table.AddCell("Salary");
                table.AddCell("Date of Joining");

                foreach (var employee in employees)
                {
                    table.AddCell(employee.Id.ToString());
                    table.AddCell(employee.Name);
                    table.AddCell(employee.Position);
                    table.AddCell(employee.Office);
                    table.AddCell(employee.Salary.ToString("C"));
                    table.AddCell(employee.DateOfJoining.ToString("yyyy-MM-dd"));
                }

                document.Add(table);
                document.Close();

                var bytes = stream.ToArray();
                return File(bytes, "application/pdf", "employees.pdf");
            }
        }
    }
}
