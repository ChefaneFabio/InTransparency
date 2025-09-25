const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

// Get user's academic profile with all related data
router.get('/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const db = req.app.get('db');

    // Fetch all academic data in parallel
    const [courses, experiences, achievements, activities] = await Promise.all([
      db('courses').where({ user_id: userId }).orderBy('year', 'desc').orderBy('semester', 'desc'),
      db('academic_experiences').where({ user_id: userId }).orderBy('start_date', 'desc'),
      db('achievements').where({ user_id: userId }).orderBy('date_received', 'desc'),
      db('extracurricular_activities').where({ user_id: userId }).orderBy('start_date', 'desc')
    ]);

    // Calculate GPA from courses
    const completedCourses = courses.filter(c => c.is_completed && c.grade);
    let gpa = 0;
    let totalCredits = 0;

    if (completedCourses.length > 0) {
      const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
      };

      completedCourses.forEach(course => {
        const points = gradePoints[course.grade];
        if (points !== undefined) {
          gpa += points * parseFloat(course.credits);
          totalCredits += parseFloat(course.credits);
        }
      });

      if (totalCredits > 0) {
        gpa = (gpa / totalCredits).toFixed(2);
      }
    }

    res.json({
      courses,
      experiences,
      achievements,
      activities,
      summary: {
        totalCourses: courses.length,
        completedCourses: completedCourses.length,
        gpa: parseFloat(gpa),
        totalCredits: totalCredits,
        totalExperiences: experiences.length,
        totalAchievements: achievements.length,
        totalActivities: activities.length
      }
    });
  } catch (error) {
    console.error('Error fetching academic profile:', error);
    res.status(500).json({ error: 'Failed to fetch academic profile' });
  }
});

// CRUD for courses
router.post('/courses', authenticateToken, async (req, res) => {
  try {
    const course = {
      id: uuidv4(),
      user_id: req.user.id,
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };

    const db = req.app.get('db');
    await db('courses').insert(course);

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.put('/courses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.get('db');

    // Check ownership
    const course = await db('courses').where({ id }).first();
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await db('courses')
      .where({ id })
      .update({ ...req.body, updated_at: new Date() })
      .returning('*');

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

router.delete('/courses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.get('db');

    // Check ownership
    const course = await db('courses').where({ id }).first();
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db('courses').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// CRUD for academic experiences
router.post('/experiences', authenticateToken, async (req, res) => {
  try {
    const experience = {
      id: uuidv4(),
      user_id: req.user.id,
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };

    const db = req.app.get('db');
    await db('academic_experiences').insert(experience);

    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/experiences/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.get('db');

    // Check ownership
    const experience = await db('academic_experiences').where({ id }).first();
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await db('academic_experiences')
      .where({ id })
      .update({ ...req.body, updated_at: new Date() })
      .returning('*');

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experiences/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.get('db');

    // Check ownership
    const experience = await db('academic_experiences').where({ id }).first();
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db('academic_experiences').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// CRUD for achievements
router.post('/achievements', authenticateToken, async (req, res) => {
  try {
    const achievement = {
      id: uuidv4(),
      user_id: req.user.id,
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };

    const db = req.app.get('db');
    await db('achievements').insert(achievement);

    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

router.put('/achievements/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.get('db');

    // Check ownership
    const achievement = await db('achievements').where({ id }).first();
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    if (achievement.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await db('achievements')
      .where({ id })
      .update({ ...req.body, updated_at: new Date() })
      .returning('*');

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/achievements/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.get('db');

    // Check ownership
    const achievement = await db('achievements').where({ id }).first();
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    if (achievement.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db('achievements').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

// Generate CV data
router.post('/cv/generate', authenticateToken, async (req, res) => {
  try {
    const { templateId, format = 'json' } = req.body;
    const userId = req.user.id;
    const db = req.app.get('db');

    // Fetch user profile
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch template if specified
    let template = null;
    if (templateId) {
      template = await db('cv_templates').where({ id: templateId, user_id: userId }).first();
    }

    // Fetch all academic data
    const [courses, experiences, achievements, activities, projects] = await Promise.all([
      db('courses')
        .where({ user_id: userId, is_completed: true })
        .orderBy('year', 'desc')
        .orderBy('semester', 'desc'),
      db('academic_experiences')
        .where({ user_id: userId })
        .orderBy('start_date', 'desc'),
      db('achievements')
        .where({ user_id: userId })
        .orderBy('date_received', 'desc'),
      db('extracurricular_activities')
        .where({ user_id: userId })
        .orderBy('start_date', 'desc'),
      db('projects')
        .where({ user_id: userId })
        .orderBy('innovation_score', 'desc')
        .limit(template?.max_projects || 5)
    ]);

    // Calculate GPA
    let gpa = 0;
    let totalCredits = 0;
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };

    courses.forEach(course => {
      const points = gradePoints[course.grade];
      if (points !== undefined) {
        gpa += points * parseFloat(course.credits);
        totalCredits += parseFloat(course.credits);
      }
    });

    if (totalCredits > 0) {
      gpa = (gpa / totalCredits).toFixed(2);
    }

    // Build CV data structure
    const cvData = {
      personal: {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        linkedin: user.linkedin_url || '',
        github: user.github_url || '',
        portfolio: user.portfolio_url || ''
      },
      education: {
        university: user.university || '',
        degree: user.major || '',
        graduationYear: user.graduation_year || '',
        gpa: parseFloat(gpa),
        totalCredits: totalCredits,
        relevantCourses: courses.slice(0, 8).map(c => ({
          code: c.course_code,
          name: c.course_name,
          grade: c.grade
        }))
      },
      experience: experiences.map(exp => ({
        type: exp.type,
        title: exp.title,
        organization: exp.organization,
        location: exp.location,
        startDate: exp.start_date,
        endDate: exp.end_date,
        description: exp.description,
        achievements: exp.achievements || []
      })),
      projects: projects.map(proj => ({
        title: proj.title,
        description: proj.description,
        technologies: proj.technologies || [],
        innovationScore: proj.innovation_score,
        githubUrl: proj.repository_url,
        liveUrl: proj.live_url
      })),
      skills: user.skills || [],
      achievements: achievements.map(ach => ({
        type: ach.type,
        title: ach.title,
        issuer: ach.issuer,
        date: ach.date_received,
        description: ach.description
      })),
      activities: activities.map(act => ({
        name: act.activity_name,
        role: act.role,
        organization: act.organization,
        startDate: act.start_date,
        endDate: act.end_date,
        description: act.description
      }))
    };

    // Save generated CV
    const generatedCv = {
      id: uuidv4(),
      user_id: userId,
      template_id: templateId || null,
      filename: `cv_${user.first_name}_${user.last_name}_${Date.now()}.${format}`,
      format: format,
      version: '1.0',
      content: JSON.stringify(cvData),
      generation_method: 'auto',
      created_at: new Date(),
      updated_at: new Date()
    };

    await db('generated_cvs').insert(generatedCv);

    // Update template usage
    if (templateId) {
      await db('cv_templates')
        .where({ id: templateId })
        .update({
          last_generated: new Date(),
          generation_count: db.raw('generation_count + 1')
        });
    }

    res.json({
      id: generatedCv.id,
      data: cvData,
      format: format,
      message: 'CV generated successfully'
    });
  } catch (error) {
    console.error('Error generating CV:', error);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
});

// Get generated CVs
router.get('/cv/history', authenticateToken, async (req, res) => {
  try {
    const db = req.app.get('db');
    const cvs = await db('generated_cvs')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(20);

    res.json(cvs.map(cv => ({
      id: cv.id,
      filename: cv.filename,
      format: cv.format,
      createdAt: cv.created_at,
      downloadCount: cv.download_count,
      atsScore: cv.ats_score
    })));
  } catch (error) {
    console.error('Error fetching CV history:', error);
    res.status(500).json({ error: 'Failed to fetch CV history' });
  }
});

module.exports = router;