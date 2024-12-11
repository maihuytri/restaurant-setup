import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

public class EmployeeService {

    private EntityManager entityManager;

    public EmployeeService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<Object[]> getEmployeeNamesAndSalariesByDepartment(String department) {
        String sql = "SELECT name, salary FROM employees WHERE department = :department";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("department", department);
        return query.getResultList();
    }

    public List<Employee> getEmployeesByDepartment(String department) {
        TypedQuery<Employee> query = entityManager.createNamedQuery("Employee.findByDepartment", Employee.class);
        query.setParameter("department", department);
        return query.getResultList();
    }

    // Dynamic Query cannot get the year from the field that stored Date
    public List<Employee> getEmployeesByHireYearJPQL(int year) {
        String jpql = "SELECT e FROM Employee e WHERE e.hireYear = :year";
        TypedQuery<Employee> query = entityManager.createQuery(jpql, Employee.class);
        query.setParameter("year", year);
        return query.getResultList();
    }

    public List<Employee> getEmployeesByHireYear(int year) {
        String sql = "SELECT * FROM employees WHERE YEAR(hire_date) = :year"; // MySQL-specific function
        Query query = entityManager.createNativeQuery(sql, Employee.class);
        query.setParameter("year", year);
        return query.getResultList();
    }

    @Entity
    @NamedQueries({
            @NamedQuery(name = "Employee.findByDepartment", query = "SELECT e FROM Employee e WHERE e.department = :department")
    })
    public class Employee {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String name;
        private String department;
        private Double salary;

        // Getters and Setters
    }
}
