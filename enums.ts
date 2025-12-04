
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}


interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Проста система керування університетом без зовнішніх залежностей.
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeRecord[] = [];
    private studentCourseMap: Map<number, number[]> = new Map(); 
    private nextStudentId: number = 1;
    private nextCourseId: number = 1;
    
    // Додає студента і повертає запис з виданим id.
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = { ...student, id: this.nextStudentId++ };
        this.students.push(newStudent);
        this.studentCourseMap.set(newStudent.id, []);
        console.log(`Student enrolled: ${newStudent.fullName}`);
        return newStudent;
    }
    
    // Додає курс і повертає запис з виданим id.
    addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = { ...course, id: this.nextCourseId++ };
        this.courses.push(newCourse);
        console.log(`Course added: ${newCourse.name}`);
        return newCourse;
    }
    
    // Реєструє студента на курс з перевіркою факультету та заповненості.
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student) throw new Error("Student not found");
        if (!course) throw new Error("Course not found");
        
        if (student.faculty !== course.faculty) {
            throw new Error("Student cannot register for a course from another faculty");
        }

        const registeredStudents = Array.from(this.studentCourseMap.values())
            .filter(courseIds => courseIds.includes(courseId)).length;
        
        if (registeredStudents >= course.maxStudents) {
            throw new Error("Course is full");
        }

        this.studentCourseMap.get(studentId)?.push(courseId);
        console.log(`Student ${student.fullName} registered for course ${course.name}`);
    }
    
    // Виставляє оцінку, дозволено лише якщо студент зареєстрований на курс.
    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const registeredCourses = this.studentCourseMap.get(studentId);
        if (!registeredCourses || !registeredCourses.includes(courseId)) {
            throw new Error("Student is not registered for this course");
        }

        const course = this.courses.find(c => c.id === courseId);
        if (!course) throw new Error("Course not found");

        const student = this.students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");

    const gradeRecord: GradeRecord = {
        studentId,
        courseId,
        grade,
        date: new Date(),
        semester: course.semester
        };

        this.grades.push(gradeRecord);
        console.log(`Grade set: ${student.fullName} got ${grade} in ${course.name}`);
    }
    
    // Дозволяє зміну статусу, окрім випадків вже відрахованих/випускників.
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");

        if (student.status === StudentStatus.Expelled || student.status === StudentStatus.Graduated) {
            throw new Error("Cannot change status of expelled or graduated student");
        }

        student.status = newStatus;
        console.log(`Student ${student.fullName} status updated to ${newStatus}`);
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }
    
    getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(g => g.studentId === studentId);
    }
    
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) return 0;

        const sum = studentGrades.reduce((acc, g) => acc + g.grade, 0);
        return sum / studentGrades.length;
    }

    getTopStudents(faculty: Faculty): Student[] {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        return facultyStudents.filter(s => this.calculateAverageGrade(s.id) >= Grade.Excellent);
    }
}


const ums = new UniversityManagementSystem();

try {
    const student1 = ums.enrollStudent({
        fullName: "John Doe",
        faculty: Faculty.Computer_Science,
        year: 1,
        status: StudentStatus.Active,
        enrollmentDate: new Date("2025-09-01"),
        groupNumber: "CS-101"
    });

    const student2 = ums.enrollStudent({
        fullName: "Jane Smith",
        faculty: Faculty.Computer_Science,
        year: 1,
        status: StudentStatus.Active,
        enrollmentDate: new Date("2025-09-01"),
        groupNumber: "CS-102"
    });

    const course1 = ums.addCourse({
        name: "Programming 101",
        type: CourseType.Mandatory,
        credits: 5,
        semester: Semester.First,
        faculty: Faculty.Computer_Science,
        maxStudents: 2
    });

    ums.registerForCourse(student1.id, course1.id);
    ums.registerForCourse(student2.id, course1.id);
    
    ums.setGrade(student1.id, course1.id, Grade.Excellent);
    ums.setGrade(student2.id, course1.id, Grade.Good);

    console.log(`Average grade for ${student1.fullName}:`, ums.calculateAverageGrade(student1.id));
    console.log(`Average grade for ${student2.fullName}:`, ums.calculateAverageGrade(student2.id));

    console.log("Top students in Computer Science:", ums.getTopStudents(Faculty.Computer_Science).map(s => s.fullName));
 
    ums.updateStudentStatus(student1.id, StudentStatus.Academic_Leave);
    
    console.log("Students in Computer Science:", ums.getStudentsByFaculty(Faculty.Computer_Science).map(s => s.fullName));

    console.log("Available courses in First semester:", ums.getAvailableCourses(Faculty.Computer_Science, Semester.First).map(c => c.name));

    try {
        ums.registerForCourse(student1.id, ums.addCourse({
            name: "Economics 101",
            type: CourseType.Mandatory,
            credits: 5,
            semester: Semester.First,
            faculty: Faculty.Economics,
            maxStudents: 2
        }).id);
    } catch (err) {
        console.error("Error:", (err as Error).message);
    }

    try {
        ums.setGrade(student1.id, 999, Grade.Good);
    } catch (err) {
        console.error("Error:", (err as Error).message);
    }

} catch (err) {
    console.error("Error:", (err as Error).message);
}
