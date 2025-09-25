const fs = require('fs');
const path = require('path');

// Route configuration from breadcrumb component
const routeConfig = {
  'dashboard': 'Dashboard',
  'student': 'Student',
  'recruiter': 'Recruiter',
  'university': 'University',
  'admin': 'Admin',
  'profile': 'Profile',
  'edit': 'Edit',
  'projects': 'Projects',
  'new': 'New',
  'jobs': 'Jobs',
  'applications': 'Applications',
  'messages': 'Messages',
  'analytics': 'Analytics',
  'courses': 'Courses',
  'candidates': 'Candidates',
  'post-job': 'Post Job',
  'students': 'Students',
  'search': 'Search',
  'auth': 'Authentication',
  'login': 'Sign In',
  'register': 'Register',
  'forgot-password': 'Forgot Password',
  'role-selection': 'Select Role',
  'companies': 'Companies',
  'create': 'Create',
  'cv-samples': 'CV Samples',
  'pricing': 'Pricing',
  'about': 'About',
  'legal': 'Legal',
  'terms': 'Terms of Service',
  'privacy': 'Privacy Policy',
  'survey': 'Survey',
  'company': 'Company',
  'university': 'University',
  'thank-you': 'Thank You',
  'validation': 'Validation',
  'mvp': 'MVP',
  'demo': 'Demo',
  'targeting-examples': 'Targeting Examples',
  'progression-demo': 'Progression Demo',
  'linkedin-integration': 'LinkedIn Integration',
  'opportunities': 'Opportunities',
  'send-surveys': 'Send Surveys',
  'survey-results': 'Survey Results'
};

function findPages(dir, basePath = '') {
  const pages = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      pages.push(...findPages(filePath, path.join(basePath, file)));
    } else if (file === 'page.tsx') {
      pages.push(basePath || '/');
    }
  }

  return pages;
}

// Find all pages
const appDir = path.join(__dirname, '..', 'app');
const allPages = findPages(appDir);

console.log('📊 Breadcrumb Coverage Report');
console.log('=' .repeat(50));
console.log(`Total pages found: ${allPages.length}`);
console.log('');

// Check coverage for each page
const covered = [];
const uncovered = [];

allPages.forEach(page => {
  const segments = page.split('/').filter(s => s !== '');
  let hasCoverage = true;
  let missingSegments = [];

  segments.forEach(segment => {
    // Skip dynamic segments
    if (segment.startsWith('[') && segment.endsWith(']')) {
      return;
    }

    if (!routeConfig[segment]) {
      hasCoverage = false;
      missingSegments.push(segment);
    }
  });

  if (hasCoverage || page === '/') {
    covered.push(page);
  } else {
    uncovered.push({ page, missingSegments });
  }
});

console.log(`✅ Pages with breadcrumb support: ${covered.length}/${allPages.length}`);
console.log(`❌ Pages missing configuration: ${uncovered.length}/${allPages.length}`);
console.log('');

if (uncovered.length > 0) {
  console.log('Pages needing configuration:');
  console.log('-'.repeat(50));
  uncovered.forEach(({ page, missingSegments }) => {
    console.log(`  ${page}`);
    console.log(`    Missing: ${missingSegments.join(', ')}`);
  });
}

console.log('');
console.log('Summary:');
console.log(`Coverage: ${((covered.length / allPages.length) * 100).toFixed(1)}%`);

// List all unique segments that need configuration
const allMissingSegments = new Set();
uncovered.forEach(({ missingSegments }) => {
  missingSegments.forEach(s => allMissingSegments.add(s));
});

if (allMissingSegments.size > 0) {
  console.log('');
  console.log('Add these to routeConfig in breadcrumb.tsx:');
  console.log('-'.repeat(50));
  Array.from(allMissingSegments).sort().forEach(segment => {
    console.log(`  '${segment}': '${segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}',`);
  });
}