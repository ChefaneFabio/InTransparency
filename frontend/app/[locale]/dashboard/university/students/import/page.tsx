'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/navigation'
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Download, Loader2, XCircle } from 'lucide-react'

interface ImportError {
  row: number
  email?: string
  errors: string[]
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  total: number
  errors: ImportError[]
  message: string
}

export default function ImportStudentsPage() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
        setResult(null)
        setError(null)
      } else {
        setError('Please select a CSV file')
      }
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/dashboard/university/students/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to import students')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = "email,first_name,last_name,course,year\nstudent@university.edu,Mario,Rossi,Computer Science,3\nstudent2@university.edu,Laura,Bianchi,Business Administration,2\n"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/university/students">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Import Students</h1>
          <p className="text-gray-600">Upload a CSV file to add multiple students</p>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Format</CardTitle>
          <CardDescription>
            Your CSV file should include the following columns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm mb-4 overflow-x-auto">
            <p className="text-gray-600 mb-2"># Required columns:</p>
            <p>email, first_name, last_name</p>
            <p className="text-gray-600 mt-2 mb-2"># Optional columns:</p>
            <p>course, year</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Maximum 1000 students per import. File size limit: 5MB.
          </p>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            {file ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-green-600" />
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null)
                    setResult(null)
                    setError(null)
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-600">
                  Drag and drop a CSV file, or click to browse
                </p>
                <Button variant="outline" asChild>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    Choose File
                  </label>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Import Failed</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className={`${
          result.failed > 0 ? 'border-amber-200' : 'border-green-200'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {result.failed > 0 ? (
                <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">Import Complete</p>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>{result.success} imported</span>
                  </div>
                  {result.skipped > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>{result.skipped} skipped</span>
                    </div>
                  )}
                  {result.failed > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>{result.failed} failed</span>
                    </div>
                  )}
                </div>

                {/* Error Details */}
                {result.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Error Details:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                      {result.errors.map((err, idx) => (
                        <div key={idx} className="text-xs text-gray-600 mb-2 last:mb-0">
                          <span className="font-medium">Row {err.row}</span>
                          {err.email && <span className="text-gray-400"> ({err.email})</span>}
                          <span>: {err.errors.join(', ')}</span>
                        </div>
                      ))}
                      {result.errors.length >= 50 && (
                        <p className="text-xs text-gray-400 italic mt-2">
                          Showing first 50 errors...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard/university/students">Cancel</Link>
        </Button>
        <Button
          onClick={handleImport}
          disabled={!file || importing}
        >
          {importing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Import Students
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
