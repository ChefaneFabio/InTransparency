// InTransparency Course Equivalence Algorithm
// Smart matching of courses across universities

class CourseEquivalenceEngine {
  constructor() {
    // Core skill mapping database
    this.skillDatabase = {
      // Machine Learning Family
      'machine_learning': {
        coreSkills: ['supervised_learning', 'unsupervised_learning', 'neural_networks', 'model_evaluation', 'python'],
        relatedSkills: ['statistics', 'linear_algebra', 'optimization', 'data_preprocessing'],
        prerequisites: ['programming', 'mathematics', 'statistics'],
        applications: ['classification', 'regression', 'clustering', 'deep_learning']
      },
      
      // Web Development Family
      'web_development': {
        coreSkills: ['html_css', 'javascript', 'responsive_design', 'api_integration'],
        relatedSkills: ['ui_ux', 'version_control', 'frameworks', 'testing'],
        prerequisites: ['programming_basics', 'computer_science'],
        applications: ['frontend', 'full_stack', 'web_apps', 'user_interfaces']
      },
      
      // Database Systems Family
      'database_systems': {
        coreSkills: ['sql', 'data_modeling', 'normalization', 'query_optimization'],
        relatedSkills: ['system_design', 'performance_tuning', 'backup_recovery', 'security'],
        prerequisites: ['programming', 'data_structures'],
        applications: ['data_management', 'backend_development', 'analytics', 'etl']
      },
      
      // Algorithms Family
      'algorithms': {
        coreSkills: ['algorithm_design', 'complexity_analysis', 'data_structures', 'optimization'],
        relatedSkills: ['mathematics', 'problem_solving', 'graph_theory', 'dynamic_programming'],
        prerequisites: ['programming', 'discrete_mathematics'],
        applications: ['software_optimization', 'competitive_programming', 'system_design']
      }
    }
    
    // University-specific course mappings
    this.universityCourseMappings = {
      'Politecnico Milano': {
        'Intelligenza Artificiale': 'machine_learning',
        'Apprendimento Automatico': 'machine_learning',
        'Sistemi di Basi di Dati': 'database_systems',
        'Algoritmi e Strutture Dati': 'algorithms',
        'Sviluppo Web': 'web_development'
      },
      'Bocconi University': {
        'Statistical Learning': 'machine_learning',
        'Data Mining': 'machine_learning',
        'Database Management': 'database_systems',
        'Web Programming': 'web_development'
      },
      'Università Statale Milano': {
        'Artificial Intelligence': 'machine_learning',
        'Machine Learning': 'machine_learning',
        'Database Systems': 'database_systems',
        'Advanced Algorithms': 'algorithms'
      },
      'Generic': {
        'Machine Learning': 'machine_learning',
        'Artificial Intelligence': 'machine_learning',
        'AI': 'machine_learning',
        'Statistical Learning': 'machine_learning',
        'Data Mining': 'machine_learning',
        'Computational Intelligence': 'machine_learning',
        'Neural Networks': 'machine_learning',
        'Deep Learning': 'machine_learning',
        
        'Web Development': 'web_development',
        'Frontend Development': 'web_development',
        'Client-Side Programming': 'web_development',
        'Internet Programming': 'web_development',
        'Web Programming': 'web_development',
        'HTML/CSS/JavaScript': 'web_development',
        
        'Database Systems': 'database_systems',
        'Database Management': 'database_systems',
        'Data Management': 'database_systems',
        'SQL Programming': 'database_systems',
        'Relational Databases': 'database_systems',
        
        'Algorithms': 'algorithms',
        'Data Structures': 'algorithms',
        'Algorithm Design': 'algorithms',
        'Advanced Algorithms': 'algorithms',
        'Computational Algorithms': 'algorithms'
      }
    }
    
    // Skill similarity matrix (0-1 scale)
    this.skillSimilarity = {
      'machine_learning': {
        'artificial_intelligence': 0.95,
        'data_science': 0.85,
        'statistical_learning': 0.90,
        'deep_learning': 0.80,
        'neural_networks': 0.75
      },
      'web_development': {
        'frontend_development': 0.95,
        'javascript_programming': 0.85,
        'ui_development': 0.80,
        'client_side_programming': 0.90
      },
      'database_systems': {
        'data_management': 0.90,
        'sql_programming': 0.85,
        'data_modeling': 0.80,
        'database_design': 0.95
      }
    }
  }
  
  /**
   * Find equivalent courses across universities
   * @param {string} courseName - Name of the course to find equivalents for
   * @param {string} sourceUniversity - University offering the course
   * @returns {Object} - Equivalent courses with similarity scores
   */
  findCourseEquivalents(courseName, sourceUniversity = 'Generic') {
    // Step 1: Map course to skill family
    const skillFamily = this.mapCourseToSkills(courseName, sourceUniversity)
    
    if (!skillFamily) {
      return {
        error: 'Course not found in database',
        suggestions: this.suggestSimilarCourses(courseName)
      }
    }
    
    // Step 2: Find all courses that map to same or similar skill families
    const equivalents = []
    
    // Check all universities
    for (const [university, courseMappings] of Object.entries(this.universityCourseMappings)) {
      if (university === sourceUniversity) continue // Skip source university
      
      for (const [courseTitle, mappedSkillFamily] of Object.entries(courseMappings)) {
        const similarity = this.calculateSkillSimilarity(skillFamily, mappedSkillFamily)
        
        if (similarity >= 0.7) { // 70% minimum similarity threshold
          equivalents.push({
            courseName: courseTitle,
            university,
            skillFamily: mappedSkillFamily,
            similarity: Math.round(similarity * 100) / 100,
            coreSkills: this.skillDatabase[mappedSkillFamily]?.coreSkills || [],
            sharedSkills: this.getSharedSkills(skillFamily, mappedSkillFamily)
          })
        }
      }
    }
    
    // Sort by similarity (highest first)
    equivalents.sort((a, b) => b.similarity - a.similarity)
    
    return {
      originalCourse: {
        name: courseName,
        university: sourceUniversity,
        skillFamily,
        coreSkills: this.skillDatabase[skillFamily]?.coreSkills || []
      },
      equivalents,
      totalFound: equivalents.length
    }
  }
  
  /**
   * Map a course name to its skill family
   */
  mapCourseToSkills(courseName, university) {
    // First try university-specific mapping
    if (this.universityCourseMappings[university]) {
      const universityMapping = this.universityCourseMappings[university][courseName]
      if (universityMapping) return universityMapping
    }
    
    // Then try generic mapping
    const genericMapping = this.universityCourseMappings['Generic'][courseName]
    if (genericMapping) return genericMapping
    
    // Finally, try fuzzy matching
    return this.fuzzyMatchCourse(courseName)
  }
  
  /**
   * Fuzzy matching for course names
   */
  fuzzyMatchCourse(courseName) {
    const lowerCourseName = courseName.toLowerCase()
    
    // Machine Learning keywords
    const mlKeywords = ['machine', 'learning', 'ml', 'artificial', 'intelligence', 'ai', 'neural', 'deep', 'statistical']
    if (mlKeywords.some(keyword => lowerCourseName.includes(keyword))) {
      return 'machine_learning'
    }
    
    // Web Development keywords
    const webKeywords = ['web', 'html', 'css', 'javascript', 'frontend', 'client']
    if (webKeywords.some(keyword => lowerCourseName.includes(keyword))) {
      return 'web_development'
    }
    
    // Database keywords
    const dbKeywords = ['database', 'db', 'sql', 'data']
    if (dbKeywords.some(keyword => lowerCourseName.includes(keyword))) {
      return 'database_systems'
    }
    
    // Algorithm keywords
    const algoKeywords = ['algorithm', 'algorithms', 'data structure', 'structures']
    if (algoKeywords.some(keyword => lowerCourseName.includes(keyword))) {
      return 'algorithms'
    }
    
    return null
  }
  
  /**
   * Calculate similarity between two skill families
   */
  calculateSkillSimilarity(skillFamily1, skillFamily2) {
    if (skillFamily1 === skillFamily2) return 1.0
    
    // Check predefined similarities
    const similarity1 = this.skillSimilarity[skillFamily1]?.[skillFamily2]
    const similarity2 = this.skillSimilarity[skillFamily2]?.[skillFamily1]
    
    if (similarity1) return similarity1
    if (similarity2) return similarity2
    
    // Calculate based on shared skills
    const skills1 = this.skillDatabase[skillFamily1]
    const skills2 = this.skillDatabase[skillFamily2]
    
    if (!skills1 || !skills2) return 0
    
    const allSkills1 = [...skills1.coreSkills, ...skills1.relatedSkills]
    const allSkills2 = [...skills2.coreSkills, ...skills2.relatedSkills]
    
    const sharedSkills = allSkills1.filter(skill => allSkills2.includes(skill))
    const totalUniqueSkills = new Set([...allSkills1, ...allSkills2]).size
    
    return sharedSkills.length / totalUniqueSkills
  }
  
  /**
   * Get shared skills between two skill families
   */
  getSharedSkills(skillFamily1, skillFamily2) {
    const skills1 = this.skillDatabase[skillFamily1]
    const skills2 = this.skillDatabase[skillFamily2]
    
    if (!skills1 || !skills2) return []
    
    const allSkills1 = [...skills1.coreSkills, ...skills1.relatedSkills]
    const allSkills2 = [...skills2.coreSkills, ...skills2.relatedSkills]
    
    return allSkills1.filter(skill => allSkills2.includes(skill))
  }
  
  /**
   * Suggest similar courses when exact match not found
   */
  suggestSimilarCourses(courseName) {
    const suggestions = []
    const lowerCourseName = courseName.toLowerCase()
    
    // Find courses with similar keywords
    for (const [university, courseMappings] of Object.entries(this.universityCourseMappings)) {
      for (const courseTitle of Object.keys(courseMappings)) {
        const lowerCourseTitle = courseTitle.toLowerCase()
        
        // Simple keyword matching
        const courseWords = lowerCourseName.split(' ')
        const titleWords = lowerCourseTitle.split(' ')
        const sharedWords = courseWords.filter(word => titleWords.some(titleWord => 
          titleWord.includes(word) || word.includes(titleWord)
        ))
        
        if (sharedWords.length > 0) {
          suggestions.push({
            courseName: courseTitle,
            university,
            reason: `Similar keywords: ${sharedWords.join(', ')}`
          })
        }
      }
    }
    
    return suggestions.slice(0, 5) // Return top 5 suggestions
  }
  
  /**
   * Check if a student's course satisfies a job requirement
   */
  checkJobRequirementMatch(studentCourse, jobRequirement, minSimilarity = 0.8) {
    const studentSkillFamily = this.mapCourseToSkills(studentCourse.name, studentCourse.university)
    const jobSkillFamily = this.mapCourseToSkills(jobRequirement.courseName, jobRequirement.university || 'Generic')
    
    if (!studentSkillFamily || !jobSkillFamily) {
      return {
        match: false,
        reason: 'Course not found in skill database'
      }
    }
    
    const similarity = this.calculateSkillSimilarity(studentSkillFamily, jobSkillFamily)
    const gradeMatch = studentCourse.grade >= (jobRequirement.minGrade || 18)
    
    return {
      match: similarity >= minSimilarity && gradeMatch,
      similarity,
      gradeMatch,
      sharedSkills: this.getSharedSkills(studentSkillFamily, jobSkillFamily),
      reason: similarity >= minSimilarity ? 
        (gradeMatch ? 'Full match' : `Grade too low (${studentCourse.grade}/${jobRequirement.minGrade})`) : 
        `Skill similarity too low (${Math.round(similarity * 100)}%)`
    }
  }
  
  /**
   * Get jobs that would be interested in a specific course
   */
  getJobsForCourse(courseName, university = 'Generic') {
    const skillFamily = this.mapCourseToSkills(courseName, university)
    
    if (!skillFamily) return []
    
    // Mock job database - in production, this would query real job postings
    const mockJobs = {
      'machine_learning': [
        {
          title: 'ML Engineer at DeepMind',
          company: 'DeepMind',
          location: 'London',
          match: 0.95,
          additionalRequirements: ['Python Programming', 'Linear Algebra'],
          salaryRange: '€60,000-80,000'
        },
        {
          title: 'Data Scientist at Bending Spoons',
          company: 'Bending Spoons',
          location: 'Milano',
          match: 0.88,
          additionalRequirements: ['Statistics', 'Database Systems'],
          salaryRange: '€45,000-60,000'
        },
        {
          title: 'AI Research Intern at Microsoft',
          company: 'Microsoft',
          location: 'Remote',
          match: 0.82,
          additionalRequirements: ['Research Experience', 'Publications'],
          salaryRange: '€35,000-45,000'
        }
      ],
      'web_development': [
        {
          title: 'Frontend Developer at Satispay',
          company: 'Satispay',
          location: 'Milano',
          match: 0.92,
          additionalRequirements: ['React/Vue', 'Version Control'],
          salaryRange: '€35,000-50,000'
        },
        {
          title: 'Full-Stack Developer at Startup',
          company: 'TechStartup',
          location: 'Torino',
          match: 0.75,
          additionalRequirements: ['Backend Development', 'Database Systems'],
          salaryRange: '€30,000-45,000'
        }
      ],
      'database_systems': [
        {
          title: 'Database Administrator at UniCredit',
          company: 'UniCredit',
          location: 'Milano',
          match: 0.90,
          additionalRequirements: ['SQL Advanced', 'System Administration'],
          salaryRange: '€40,000-55,000'
        }
      ],
      'algorithms': [
        {
          title: 'Software Engineer at Google',
          company: 'Google',
          location: 'Zurich',
          match: 0.85,
          additionalRequirements: ['System Design', 'Problem Solving'],
          salaryRange: '€70,000-90,000'
        }
      ]
    }
    
    return mockJobs[skillFamily] || []
  }
}

module.exports = CourseEquivalenceEngine