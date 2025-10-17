// Utility functions for exporting data to CSV

export function exportToCsv(filename: string, rows: any[]) {
  if (!rows || rows.length === 0) {
    return
  }

  // Get headers from first row keys
  const headers = Object.keys(rows[0])

  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Data rows
    ...rows.map(row =>
      headers.map(header => {
        const cell = row[header]
        // Handle cells with commas, quotes, or newlines
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
          return `"${cell.replace(/"/g, '""')}"`
        }
        return cell ?? ''
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function exportCandidatesToCsv(candidates: any[]) {
  const formattedData = candidates.map(candidate => ({
    'First Name': candidate.firstName,
    'Last Name': candidate.lastName,
    'Email': candidate.email,
    'University': candidate.university,
    'Degree': candidate.degree,
    'Graduation Year': candidate.graduationYear,
    'Location': candidate.location || '',
    'GPA': candidate.gpa || '',
    'Match Score': candidate.matchScore || '',
    'Skills': Array.isArray(candidate.skills) ? candidate.skills.join('; ') : '',
    'Projects': candidate.projects || 0,
    'Innovation Score': candidate.avgInnovationScore || '',
    'Top Project': candidate.topProject || '',
    'Last Active': candidate.lastActive || '',
    'Status': candidate.status || ''
  }))

  const timestamp = new Date().toISOString().split('T')[0]
  exportToCsv(`candidates-export-${timestamp}.csv`, formattedData)
}

export function exportJobPostingsToCsv(jobPostings: any[]) {
  const formattedData = jobPostings.map(job => ({
    'Job Title': job.title,
    'Department': job.department || '',
    'Location': job.location || '',
    'Type': job.type || '',
    'Salary': job.salary || '',
    'Posted Date': job.postedDate || '',
    'Applications': job.applications || 0,
    'Views': job.views || 0,
    'Status': job.status || ''
  }))

  const timestamp = new Date().toISOString().split('T')[0]
  exportToCsv(`job-postings-export-${timestamp}.csv`, formattedData)
}

export function exportSavedCandidatesToCsv(candidates: any[]) {
  const formattedData = candidates.map(candidate => ({
    'First Name': candidate.firstName,
    'Last Name': candidate.lastName,
    'Email': candidate.email,
    'University': candidate.university,
    'Degree': candidate.degree,
    'Graduation Year': candidate.graduationYear,
    'Location': candidate.location || '',
    'Match Score': candidate.matchScore || '',
    'Skills': Array.isArray(candidate.skills) ? candidate.skills.join('; ') : '',
    'Saved Date': candidate.savedDate || new Date().toISOString().split('T')[0],
    'Notes': candidate.notes || ''
  }))

  const timestamp = new Date().toISOString().split('T')[0]
  exportToCsv(`saved-candidates-${timestamp}.csv`, formattedData)
}
