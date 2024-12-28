namespace EmployeeManagementSystem.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public string Office { get; set; }
        public decimal Salary { get; set; }

        public string Department { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string Address { get; set; }
        public string ProfilePicUrl { get; set; }
    }
}
