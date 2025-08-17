class Course {
  constructor({
    id = null,
    userId,
    courseCode,
    courseName,
    semester,
    year,
    grade,
    credits,
    instructor,
    description = null,
    category = 'other',
    isCompleted = false,
    projects = [],
    skills = [],
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id
    this.userId = userId
    this.courseCode = courseCode
    this.courseName = courseName
    this.semester = semester
    this.year = year
    this.grade = grade
    this.credits = credits
    this.instructor = instructor
    this.description = description
    this.category = category
    this.isCompleted = isCompleted
    this.projects = projects
    this.skills = skills
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  // Validate course data
  validate() {
    const errors = []

    if (!this.userId) {
      errors.push('User ID is required')
    }

    if (!this.courseCode || this.courseCode.trim().length < 2) {
      errors.push('Course code is required')
    }

    if (!this.courseName || this.courseName.trim().length < 3) {
      errors.push('Course name must be at least 3 characters')
    }

    if (!this.semester || !['Fall', 'Spring', 'Summer', 'Winter'].includes(this.semester)) {
      errors.push('Valid semester is required')
    }

    if (!this.year || this.year < 2000 || this.year > new Date().getFullYear() + 5) {
      errors.push('Valid year is required')
    }

    if (this.grade && !/^[A-F][+-]?$|^[0-9]+(\.[0-9]+)?$/.test(this.grade)) {
      errors.push('Grade must be A-F (with optional +/-) or numeric')
    }

    if (!this.credits || this.credits < 0 || this.credits > 12) {
      errors.push('Credits must be between 0 and 12')
    }

    return errors
  }

  // Calculate GPA contribution
  getGpaPoints() {
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    }

    if (gradePoints[this.grade] !== undefined) {
      return gradePoints[this.grade] * this.credits
    }

    // If numeric grade
    if (!isNaN(this.grade)) {
      const numericGrade = parseFloat(this.grade)
      if (numericGrade >= 0 && numericGrade <= 4) {
        return numericGrade * this.credits
      }
      if (numericGrade >= 0 && numericGrade <= 100) {
        // Convert percentage to 4.0 scale
        return (numericGrade / 100 * 4) * this.credits
      }
    }

    return 0
  }
}

module.exports = Course