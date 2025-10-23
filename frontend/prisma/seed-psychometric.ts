/**
 * Seed Psychometric Question Banks
 *
 * This script seeds the database with scientifically validated psychometric questions
 * for Big Five personality assessment, DISC behavioral assessment, and soft skills competencies.
 *
 * Based on:
 * - International Personality Item Pool (IPIP) for Big Five
 * - DISC Classic 2.0 for behavioral assessment
 * - Competency frameworks from I-O psychology research
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// =========================================
// BIG FIVE PERSONALITY QUESTIONS (50 items)
// =========================================

const bigFiveQuestions = [
  // OPENNESS TO EXPERIENCE (10 questions)
  {
    questionText: "I have a rich vocabulary.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "intellect",
    isReverseCoded: false,
    orderIndex: 1
  },
  {
    questionText: "I have a vivid imagination.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "imagination",
    isReverseCoded: false,
    orderIndex: 2
  },
  {
    questionText: "I enjoy hearing new ideas.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "ideas",
    isReverseCoded: false,
    orderIndex: 3
  },
  {
    questionText: "I enjoy the beauty of nature and art.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "aesthetics",
    isReverseCoded: false,
    orderIndex: 4
  },
  {
    questionText: "I believe in the importance of art.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "aesthetics",
    isReverseCoded: false,
    orderIndex: 5
  },
  {
    questionText: "I avoid philosophical discussions.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "ideas",
    isReverseCoded: true,
    orderIndex: 6
  },
  {
    questionText: "I do not like poetry.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "aesthetics",
    isReverseCoded: true,
    orderIndex: 7
  },
  {
    questionText: "I tend to vote for conservative political candidates.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "values",
    isReverseCoded: true,
    orderIndex: 8
  },
  {
    questionText: "I carry the conversation to a higher level.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "intellect",
    isReverseCoded: false,
    orderIndex: 9
  },
  {
    questionText: "I enjoy wild flights of fantasy.",
    questionType: "BIG_FIVE",
    dimension: "openness",
    facet: "imagination",
    isReverseCoded: false,
    orderIndex: 10
  },

  // CONSCIENTIOUSNESS (10 questions)
  {
    questionText: "I am always prepared.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "order",
    isReverseCoded: false,
    orderIndex: 11
  },
  {
    questionText: "I pay attention to details.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "achievement",
    isReverseCoded: false,
    orderIndex: 12
  },
  {
    questionText: "I get chores done right away.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "self_discipline",
    isReverseCoded: false,
    orderIndex: 13
  },
  {
    questionText: "I carry out my plans.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "achievement",
    isReverseCoded: false,
    orderIndex: 14
  },
  {
    questionText: "I make plans and stick to them.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "self_discipline",
    isReverseCoded: false,
    orderIndex: 15
  },
  {
    questionText: "I leave my belongings around.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "order",
    isReverseCoded: true,
    orderIndex: 16
  },
  {
    questionText: "I make a mess of things.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "order",
    isReverseCoded: true,
    orderIndex: 17
  },
  {
    questionText: "I often forget to put things back in their proper place.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "order",
    isReverseCoded: true,
    orderIndex: 18
  },
  {
    questionText: "I shirk my duties.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "dutifulness",
    isReverseCoded: true,
    orderIndex: 19
  },
  {
    questionText: "I waste my time.",
    questionType: "BIG_FIVE",
    dimension: "conscientiousness",
    facet: "self_discipline",
    isReverseCoded: true,
    orderIndex: 20
  },

  // EXTRAVERSION (10 questions)
  {
    questionText: "I am the life of the party.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "gregariousness",
    isReverseCoded: false,
    orderIndex: 21
  },
  {
    questionText: "I feel comfortable around people.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "warmth",
    isReverseCoded: false,
    orderIndex: 22
  },
  {
    questionText: "I start conversations.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "assertiveness",
    isReverseCoded: false,
    orderIndex: 23
  },
  {
    questionText: "I talk to a lot of different people at parties.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "gregariousness",
    isReverseCoded: false,
    orderIndex: 24
  },
  {
    questionText: "I don't mind being the center of attention.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "excitement_seeking",
    isReverseCoded: false,
    orderIndex: 25
  },
  {
    questionText: "I don't talk a lot.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "assertiveness",
    isReverseCoded: true,
    orderIndex: 26
  },
  {
    questionText: "I keep in the background.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "assertiveness",
    isReverseCoded: true,
    orderIndex: 27
  },
  {
    questionText: "I have little to say.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "assertiveness",
    isReverseCoded: true,
    orderIndex: 28
  },
  {
    questionText: "I don't like to draw attention to myself.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "excitement_seeking",
    isReverseCoded: true,
    orderIndex: 29
  },
  {
    questionText: "I am quiet around strangers.",
    questionType: "BIG_FIVE",
    dimension: "extraversion",
    facet: "warmth",
    isReverseCoded: true,
    orderIndex: 30
  },

  // AGREEABLENESS (10 questions)
  {
    questionText: "I am interested in people.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "altruism",
    isReverseCoded: false,
    orderIndex: 31
  },
  {
    questionText: "I sympathize with others' feelings.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "tender_mindedness",
    isReverseCoded: false,
    orderIndex: 32
  },
  {
    questionText: "I have a soft heart.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "tender_mindedness",
    isReverseCoded: false,
    orderIndex: 33
  },
  {
    questionText: "I take time out for others.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "altruism",
    isReverseCoded: false,
    orderIndex: 34
  },
  {
    questionText: "I feel others' emotions.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "tender_mindedness",
    isReverseCoded: false,
    orderIndex: 35
  },
  {
    questionText: "I am not really interested in others.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "altruism",
    isReverseCoded: true,
    orderIndex: 36
  },
  {
    questionText: "I insult people.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "compliance",
    isReverseCoded: true,
    orderIndex: 37
  },
  {
    questionText: "I am not interested in other people's problems.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "altruism",
    isReverseCoded: true,
    orderIndex: 38
  },
  {
    questionText: "I feel little concern for others.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "tender_mindedness",
    isReverseCoded: true,
    orderIndex: 39
  },
  {
    questionText: "I make people feel at ease.",
    questionType: "BIG_FIVE",
    dimension: "agreeableness",
    facet: "trust",
    isReverseCoded: false,
    orderIndex: 40
  },

  // NEUROTICISM (10 questions)
  {
    questionText: "I get stressed out easily.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "anxiety",
    isReverseCoded: false,
    orderIndex: 41
  },
  {
    questionText: "I worry about things.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "anxiety",
    isReverseCoded: false,
    orderIndex: 42
  },
  {
    questionText: "I am easily disturbed.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "vulnerability",
    isReverseCoded: false,
    orderIndex: 43
  },
  {
    questionText: "I get upset easily.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "angry_hostility",
    isReverseCoded: false,
    orderIndex: 44
  },
  {
    questionText: "I change my mood a lot.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "depression",
    isReverseCoded: false,
    orderIndex: 45
  },
  {
    questionText: "I am relaxed most of the time.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "anxiety",
    isReverseCoded: true,
    orderIndex: 46
  },
  {
    questionText: "I seldom feel blue.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "depression",
    isReverseCoded: true,
    orderIndex: 47
  },
  {
    questionText: "I am not easily bothered by things.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "vulnerability",
    isReverseCoded: true,
    orderIndex: 48
  },
  {
    questionText: "I remain calm under pressure.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "self_consciousness",
    isReverseCoded: true,
    orderIndex: 49
  },
  {
    questionText: "I rarely get irritated.",
    questionType: "BIG_FIVE",
    dimension: "neuroticism",
    facet: "angry_hostility",
    isReverseCoded: true,
    orderIndex: 50
  },
]

// =========================================
// DISC BEHAVIORAL QUESTIONS (24 items)
// =========================================

const discQuestions = [
  // DOMINANCE (6 questions)
  {
    questionText: "I enjoy competitive situations and winning.",
    questionType: "DISC",
    dimension: "dominance",
    isReverseCoded: false,
    orderIndex: 101
  },
  {
    questionText: "I am quick to take action and make decisions.",
    questionType: "DISC",
    dimension: "dominance",
    isReverseCoded: false,
    orderIndex: 102
  },
  {
    questionText: "I enjoy taking charge of situations.",
    questionType: "DISC",
    dimension: "dominance",
    isReverseCoded: false,
    orderIndex: 103
  },
  {
    questionText: "I am comfortable challenging others when I disagree.",
    questionType: "DISC",
    dimension: "dominance",
    isReverseCoded: false,
    orderIndex: 104
  },
  {
    questionText: "I prefer getting results quickly over building consensus.",
    questionType: "DISC",
    dimension: "dominance",
    isReverseCoded: false,
    orderIndex: 105
  },
  {
    questionText: "I am direct and to-the-point in my communication.",
    questionType: "DISC",
    dimension: "dominance",
    isReverseCoded: false,
    orderIndex: 106
  },

  // INFLUENCE (6 questions)
  {
    questionText: "I enjoy being around people and socializing.",
    questionType: "DISC",
    dimension: "influence",
    isReverseCoded: false,
    orderIndex: 107
  },
  {
    questionText: "I am enthusiastic and optimistic about new opportunities.",
    questionType: "DISC",
    dimension: "influence",
    isReverseCoded: false,
    orderIndex: 108
  },
  {
    questionText: "I can easily persuade others to see my point of view.",
    questionType: "DISC",
    dimension: "influence",
    isReverseCoded: false,
    orderIndex: 109
  },
  {
    questionText: "I prefer working with people over working alone.",
    questionType: "DISC",
    dimension: "influence",
    isReverseCoded: false,
    orderIndex: 110
  },
  {
    questionText: "I am comfortable being the center of attention.",
    questionType: "DISC",
    dimension: "influence",
    isReverseCoded: false,
    orderIndex: 111
  },
  {
    questionText: "I build relationships easily with new people.",
    questionType: "DISC",
    dimension: "influence",
    isReverseCoded: false,
    orderIndex: 112
  },

  // STEADINESS (6 questions)
  {
    questionText: "I prefer a stable, predictable work environment.",
    questionType: "DISC",
    dimension: "steadiness",
    isReverseCoded: false,
    orderIndex: 113
  },
  {
    questionText: "I am patient and willing to work at a steady pace.",
    questionType: "DISC",
    dimension: "steadiness",
    isReverseCoded: false,
    orderIndex: 114
  },
  {
    questionText: "I am good at listening to others and providing support.",
    questionType: "DISC",
    dimension: "steadiness",
    isReverseCoded: false,
    orderIndex: 115
  },
  {
    questionText: "I dislike sudden changes and prefer advance notice.",
    questionType: "DISC",
    dimension: "steadiness",
    isReverseCoded: false,
    orderIndex: 116
  },
  {
    questionText: "I value team harmony and avoid conflict.",
    questionType: "DISC",
    dimension: "steadiness",
    isReverseCoded: false,
    orderIndex: 117
  },
  {
    questionText: "I am loyal and dependable in my commitments.",
    questionType: "DISC",
    dimension: "steadiness",
    isReverseCoded: false,
    orderIndex: 118
  },

  // COMPLIANCE (6 questions)
  {
    questionText: "I pay attention to details and strive for accuracy.",
    questionType: "DISC",
    dimension: "compliance",
    isReverseCoded: false,
    orderIndex: 119
  },
  {
    questionText: "I prefer following established procedures and standards.",
    questionType: "DISC",
    dimension: "compliance",
    isReverseCoded: false,
    orderIndex: 120
  },
  {
    questionText: "I analyze situations thoroughly before making decisions.",
    questionType: "DISC",
    dimension: "compliance",
    isReverseCoded: false,
    orderIndex: 121
  },
  {
    questionText: "I am cautious and prefer to avoid risks.",
    questionType: "DISC",
    dimension: "compliance",
    isReverseCoded: false,
    orderIndex: 122
  },
  {
    questionText: "I value quality and correctness in my work.",
    questionType: "DISC",
    dimension: "compliance",
    isReverseCoded: false,
    orderIndex: 123
  },
  {
    questionText: "I prefer working independently on complex tasks.",
    questionType: "DISC",
    dimension: "compliance",
    isReverseCoded: false,
    orderIndex: 124
  },
]

// =========================================
// COMPETENCY ASSESSMENT QUESTIONS (40 items)
// =========================================

const competencyQuestions = [
  // COMMUNICATION (5 questions)
  {
    questionText: "I can clearly articulate my ideas to others, both verbally and in writing.",
    questionType: "COMPETENCY",
    dimension: "communication",
    isReverseCoded: false,
    orderIndex: 201
  },
  {
    questionText: "I actively listen to understand others' perspectives before responding.",
    questionType: "COMPETENCY",
    dimension: "communication",
    isReverseCoded: false,
    orderIndex: 202
  },
  {
    questionText: "I adapt my communication style to suit different audiences.",
    questionType: "COMPETENCY",
    dimension: "communication",
    isReverseCoded: false,
    orderIndex: 203
  },
  {
    questionText: "I am comfortable presenting ideas to groups of people.",
    questionType: "COMPETENCY",
    dimension: "communication",
    isReverseCoded: false,
    orderIndex: 204
  },
  {
    questionText: "I provide constructive feedback in a respectful manner.",
    questionType: "COMPETENCY",
    dimension: "communication",
    isReverseCoded: false,
    orderIndex: 205
  },

  // TEAMWORK (5 questions)
  {
    questionText: "I work well with others toward common goals.",
    questionType: "COMPETENCY",
    dimension: "teamwork",
    isReverseCoded: false,
    orderIndex: 206
  },
  {
    questionText: "I contribute my fair share to team projects.",
    questionType: "COMPETENCY",
    dimension: "teamwork",
    isReverseCoded: false,
    orderIndex: 207
  },
  {
    questionText: "I value diverse perspectives and skills in a team setting.",
    questionType: "COMPETENCY",
    dimension: "teamwork",
    isReverseCoded: false,
    orderIndex: 208
  },
  {
    questionText: "I support my teammates when they need help.",
    questionType: "COMPETENCY",
    dimension: "teamwork",
    isReverseCoded: false,
    orderIndex: 209
  },
  {
    questionText: "I can compromise and find common ground with team members.",
    questionType: "COMPETENCY",
    dimension: "teamwork",
    isReverseCoded: false,
    orderIndex: 210
  },

  // LEADERSHIP (5 questions)
  {
    questionText: "I take initiative when I see something that needs to be done.",
    questionType: "COMPETENCY",
    dimension: "leadership",
    isReverseCoded: false,
    orderIndex: 211
  },
  {
    questionText: "I can motivate and inspire others to achieve goals.",
    questionType: "COMPETENCY",
    dimension: "leadership",
    isReverseCoded: false,
    orderIndex: 212
  },
  {
    questionText: "I am comfortable delegating tasks appropriately.",
    questionType: "COMPETENCY",
    dimension: "leadership",
    isReverseCoded: false,
    orderIndex: 213
  },
  {
    questionText: "I take responsibility for outcomes, both successes and failures.",
    questionType: "COMPETENCY",
    dimension: "leadership",
    isReverseCoded: false,
    orderIndex: 214
  },
  {
    questionText: "I lead by example and demonstrate the behaviors I expect from others.",
    questionType: "COMPETENCY",
    dimension: "leadership",
    isReverseCoded: false,
    orderIndex: 215
  },

  // PROBLEM SOLVING (5 questions)
  {
    questionText: "I approach problems systematically and logically.",
    questionType: "COMPETENCY",
    dimension: "problemSolving",
    isReverseCoded: false,
    orderIndex: 216
  },
  {
    questionText: "I can think of creative solutions to complex problems.",
    questionType: "COMPETENCY",
    dimension: "problemSolving",
    isReverseCoded: false,
    orderIndex: 217
  },
  {
    questionText: "I analyze situations from multiple angles before deciding on a solution.",
    questionType: "COMPETENCY",
    dimension: "problemSolving",
    isReverseCoded: false,
    orderIndex: 218
  },
  {
    questionText: "I remain calm and focused when facing difficult challenges.",
    questionType: "COMPETENCY",
    dimension: "problemSolving",
    isReverseCoded: false,
    orderIndex: 219
  },
  {
    questionText: "I learn from past mistakes and apply those lessons to new situations.",
    questionType: "COMPETENCY",
    dimension: "problemSolving",
    isReverseCoded: false,
    orderIndex: 220
  },

  // ADAPTABILITY (5 questions)
  {
    questionText: "I am comfortable with change and uncertainty.",
    questionType: "COMPETENCY",
    dimension: "adaptability",
    isReverseCoded: false,
    orderIndex: 221
  },
  {
    questionText: "I can quickly adjust my approach when circumstances change.",
    questionType: "COMPETENCY",
    dimension: "adaptability",
    isReverseCoded: false,
    orderIndex: 222
  },
  {
    questionText: "I remain effective when working under pressure or tight deadlines.",
    questionType: "COMPETENCY",
    dimension: "adaptability",
    isReverseCoded: false,
    orderIndex: 223
  },
  {
    questionText: "I am open to feedback and willing to change my behavior.",
    questionType: "COMPETENCY",
    dimension: "adaptability",
    isReverseCoded: false,
    orderIndex: 224
  },
  {
    questionText: "I handle setbacks and disappointments constructively.",
    questionType: "COMPETENCY",
    dimension: "adaptability",
    isReverseCoded: false,
    orderIndex: 225
  },

  // EMOTIONAL INTELLIGENCE (5 questions)
  {
    questionText: "I am aware of my own emotions and how they affect my behavior.",
    questionType: "COMPETENCY",
    dimension: "emotionalIntelligence",
    isReverseCoded: false,
    orderIndex: 226
  },
  {
    questionText: "I can accurately read and understand other people's emotions.",
    questionType: "COMPETENCY",
    dimension: "emotionalIntelligence",
    isReverseCoded: false,
    orderIndex: 227
  },
  {
    questionText: "I manage my emotions effectively in stressful situations.",
    questionType: "COMPETENCY",
    dimension: "emotionalIntelligence",
    isReverseCoded: false,
    orderIndex: 228
  },
  {
    questionText: "I show empathy and understanding toward others.",
    questionType: "COMPETENCY",
    dimension: "emotionalIntelligence",
    isReverseCoded: false,
    orderIndex: 229
  },
  {
    questionText: "I build positive relationships with diverse groups of people.",
    questionType: "COMPETENCY",
    dimension: "emotionalIntelligence",
    isReverseCoded: false,
    orderIndex: 230
  },

  // TIME MANAGEMENT (5 questions)
  {
    questionText: "I prioritize tasks effectively based on importance and urgency.",
    questionType: "COMPETENCY",
    dimension: "timeManagement",
    isReverseCoded: false,
    orderIndex: 231
  },
  {
    questionText: "I meet deadlines consistently.",
    questionType: "COMPETENCY",
    dimension: "timeManagement",
    isReverseCoded: false,
    orderIndex: 232
  },
  {
    questionText: "I plan my work schedule to maximize productivity.",
    questionType: "COMPETENCY",
    dimension: "timeManagement",
    isReverseCoded: false,
    orderIndex: 233
  },
  {
    questionText: "I avoid procrastination and get started on tasks promptly.",
    questionType: "COMPETENCY",
    dimension: "timeManagement",
    isReverseCoded: false,
    orderIndex: 234
  },
  {
    questionText: "I balance multiple responsibilities without becoming overwhelmed.",
    questionType: "COMPETENCY",
    dimension: "timeManagement",
    isReverseCoded: false,
    orderIndex: 235
  },

  // CONFLICT RESOLUTION (5 questions)
  {
    questionText: "I address conflicts directly rather than avoiding them.",
    questionType: "COMPETENCY",
    dimension: "conflictResolution",
    isReverseCoded: false,
    orderIndex: 236
  },
  {
    questionText: "I can remain neutral and objective when mediating disputes.",
    questionType: "COMPETENCY",
    dimension: "conflictResolution",
    isReverseCoded: false,
    orderIndex: 237
  },
  {
    questionText: "I find win-win solutions that satisfy all parties involved.",
    questionType: "COMPETENCY",
    dimension: "conflictResolution",
    isReverseCoded: false,
    orderIndex: 238
  },
  {
    questionText: "I control my emotions during disagreements.",
    questionType: "COMPETENCY",
    dimension: "conflictResolution",
    isReverseCoded: false,
    orderIndex: 239
  },
  {
    questionText: "I help others resolve their conflicts constructively.",
    questionType: "COMPETENCY",
    dimension: "conflictResolution",
    isReverseCoded: false,
    orderIndex: 240
  },
]

async function seed() {
  console.log('🌱 Seeding psychometric question bank...')

  try {
    // Clear existing questions (optional - remove if you want to preserve data)
    await prisma.psychometricQuestion.deleteMany({})
    console.log('✅ Cleared existing questions')

    // Seed Big Five questions
    console.log('📝 Seeding Big Five personality questions...')
    for (const question of bigFiveQuestions) {
      await prisma.psychometricQuestion.create({
        data: question as any
      })
    }
    console.log(`✅ Created ${bigFiveQuestions.length} Big Five questions`)

    // Seed DISC questions
    console.log('📝 Seeding DISC behavioral questions...')
    for (const question of discQuestions) {
      await prisma.psychometricQuestion.create({
        data: question as any
      })
    }
    console.log(`✅ Created ${discQuestions.length} DISC questions`)

    // Seed Competency questions
    console.log('📝 Seeding competency assessment questions...')
    for (const question of competencyQuestions) {
      await prisma.psychometricQuestion.create({
        data: question as any
      })
    }
    console.log(`✅ Created ${competencyQuestions.length} competency questions`)

    console.log('\n🎉 Psychometric question bank seeded successfully!')
    console.log(`Total questions: ${bigFiveQuestions.length + discQuestions.length + competencyQuestions.length}`)
    console.log('- Big Five: 50 questions (10 minutes)')
    console.log('- DISC: 24 questions (8 minutes)')
    console.log('- Competencies: 40 questions (12 minutes)')
    console.log('- Full assessment: ~30 minutes total')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
