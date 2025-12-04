
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

type TimeSlot =
  | "8:30-10:00"
  | "10:15-11:45"
  | "12:15-13:45"
  | "14:00-15:30"
  | "15:45-17:15";

type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
  id: number;
  name: string;
  department: string;
};

type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

type Course = {
  id: number;
  name: string;
  type: CourseType;
};

type Lesson = {
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

type ScheduledLesson = Lesson & { id: number };


type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson;
};


const professors: Professor[] = [
  { id: 1, name: "Dr. Ivanov", department: "Computer Science" },
  { id: 2, name: "Dr. Petrenko", department: "Mathematics" },
];

const classrooms: Classroom[] = [
  { number: "A101", capacity: 80, hasProjector: true },
  { number: "B201", capacity: 40, hasProjector: false },
  { number: "C301", capacity: 30, hasProjector: true },
];

const courses: Course[] = [
  { id: 1, name: "Algorithms", type: "Lecture" },
  { id: 2, name: "Discrete Math", type: "Lecture" },
  { id: 3, name: "Programming Lab", type: "Lab" },
  { id: 4, name: "Software Engineering", type: "Seminar" },
];

let schedule: ScheduledLesson[] = [
  {
    id: 1,
    courseId: 1,
    professorId: 1,
    classroomNumber: "A101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
  },
  {
    id: 2,
    courseId: 3,
    professorId: 1,
    classroomNumber: "C301",
    dayOfWeek: "Wednesday",
    timeSlot: "10:15-11:45",
  },
];

let nextLessonId = schedule.reduce((max, s) => Math.max(max, s.id), 0) + 1;

function addProfessor(professor: Professor): void {
  const exists = professors.some((p) => p.id === professor.id);
  if (exists) throw new Error(`Professor with id=${professor.id} already exists.`);
  professors.push(professor);
}

function validateLesson(lesson: Lesson): ScheduleConflict | null {
  const profExists = professors.some((p) => p.id === lesson.professorId);
  const classExists = classrooms.some((c) => c.number === lesson.classroomNumber);
  const courseExists = courses.some((c) => c.id === lesson.courseId);
  if (!profExists || !classExists || !courseExists) throw new Error("Invalid data.");

  const professorConflict = schedule.find(
    (s) =>
      s.professorId === lesson.professorId &&
      s.dayOfWeek === lesson.dayOfWeek &&
      s.timeSlot === lesson.timeSlot
  );
  if (professorConflict)
    return { type: "ProfessorConflict", lessonDetails: professorConflict };

  const classroomConflict = schedule.find(
    (s) =>
      s.classroomNumber === lesson.classroomNumber &&
      s.dayOfWeek === lesson.dayOfWeek &&
      s.timeSlot === lesson.timeSlot
  );
  if (classroomConflict)
    return { type: "ClassroomConflict", lessonDetails: classroomConflict };

  return null;
}

function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict) return false;
  const scheduled: ScheduledLesson = { ...lesson, id: nextLessonId++ };
  schedule.push(scheduled);
  return true;
}

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  const occupied = schedule
    .filter((s) => s.dayOfWeek === dayOfWeek && s.timeSlot === timeSlot)
    .map((s) => s.classroomNumber);
  return classrooms.map((c) => c.number).filter((num) => !occupied.includes(num));
}

function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule
    .filter((s) => s.professorId === professorId)
    .map(({ id, ...lesson }) => lesson);
}

function getClassroomUtilization(classroomNumber: string): number {
  const totalSlots = 5 * 5; 
  const used = schedule.filter((s) => s.classroomNumber === classroomNumber).length;
  return Math.round((used / totalSlots) * 100 * 100) / 100;
}

function getMostPopularCourseType(): CourseType {
  const counts: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };
  for (const s of schedule) {
    const course = courses.find((c) => c.id === s.courseId);
    if (course) counts[course.type]++;
  }
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as CourseType);
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const idx = schedule.findIndex((s) => s.id === lessonId);
  if (idx === -1) return false;
  const conflict = schedule.find(
    (s) =>
      s.id !== lessonId &&
      s.classroomNumber === newClassroomNumber &&
      s.dayOfWeek === schedule[idx].dayOfWeek &&
      s.timeSlot === schedule[idx].timeSlot
  );
  if (conflict) return false;
  schedule[idx].classroomNumber = newClassroomNumber;
  return true;
}

function cancelLesson(lessonId: number): void {
  schedule = schedule.filter((s) => s.id !== lessonId);
}


try {
  addProfessor({ id: 3, name: "Dr. Shevchenko", department: "Physics" });
} catch {}

const newLesson1: Lesson = {
  courseId: 2,
  professorId: 2,
  classroomNumber: "B201",
  dayOfWeek: "Tuesday",
  timeSlot: "10:15-11:45",
};
console.log("addLesson newLesson1:", addLesson(newLesson1));

const newLessonConflict: Lesson = {
  courseId: 4,
  professorId: 2,
  classroomNumber: "C301",
  dayOfWeek: "Tuesday",
  timeSlot: "10:15-11:45",
};
console.log("addLesson conflict:", addLesson(newLessonConflict));

console.log("Free rooms:", findAvailableClassrooms("10:15-11:45", "Tuesday"));
console.log("Professor 1 schedule:", getProfessorSchedule(1));
console.log("A101 usage:", getClassroomUtilization("A101"), "%");
console.log("Most popular type:", getMostPopularCourseType());
console.log("Reassign classroom:", reassignClassroom(1, "B201"));
cancelLesson(2);
console.log("Final schedule:", schedule);

