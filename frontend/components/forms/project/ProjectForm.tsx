'use client'

import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FileUpload } from './FileUpload'
import { TechnologySelector } from './TechnologySelector'
import { CollaboratorInput } from './CollaboratorInput'
import { 
  X, 
  Plus, 
  Github, 
  ExternalLink, 
  Upload, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const projectCategories = [
  // Technology
  { value: 'web-development', label: 'Web Development', discipline: 'tech' },
  { value: 'mobile-development', label: 'Mobile Development', discipline: 'tech' },
  { value: 'data-science', label: 'Data Science', discipline: 'tech' },
  { value: 'machine-learning', label: 'Machine Learning / AI', discipline: 'tech' },
  { value: 'cybersecurity', label: 'Cybersecurity', discipline: 'tech' },
  { value: 'iot', label: 'Internet of Things', discipline: 'tech' },
  { value: 'game-development', label: 'Game Development', discipline: 'tech' },
  // Engineering
  { value: 'mechanical-engineering', label: 'Mechanical Engineering', discipline: 'engineering' },
  { value: 'civil-engineering', label: 'Civil / Structural Engineering', discipline: 'engineering' },
  { value: 'electrical-engineering', label: 'Electrical / Electronic Engineering', discipline: 'engineering' },
  { value: 'chemical-engineering', label: 'Chemical / Process Engineering', discipline: 'engineering' },
  { value: 'environmental-engineering', label: 'Environmental Engineering', discipline: 'engineering' },
  { value: 'industrial-engineering', label: 'Industrial / Manufacturing Engineering', discipline: 'engineering' },
  // Business & Finance
  { value: 'business-analysis', label: 'Business Analysis / Strategy', discipline: 'business' },
  { value: 'financial-analysis', label: 'Financial Analysis / Modeling', discipline: 'business' },
  { value: 'marketing', label: 'Marketing / Market Research', discipline: 'business' },
  { value: 'supply-chain', label: 'Supply Chain / Operations', discipline: 'business' },
  { value: 'consulting', label: 'Consulting / Advisory', discipline: 'business' },
  { value: 'accounting-audit', label: 'Accounting / Audit', discipline: 'business' },
  // Design & Architecture
  { value: 'ux-ui-design', label: 'UX / UI Design', discipline: 'design' },
  { value: 'graphic-design', label: 'Graphic Design / Branding', discipline: 'design' },
  { value: 'architecture', label: 'Architecture / Urban Planning', discipline: 'design' },
  // Sciences & Healthcare
  { value: 'lab-research', label: 'Lab Research / Science', discipline: 'science' },
  { value: 'healthcare', label: 'Healthcare / Biomedical', discipline: 'science' },
  { value: 'pharma', label: 'Pharmaceutical / Chemistry', discipline: 'science' },
  // Legal & Social
  { value: 'legal', label: 'Legal / Compliance', discipline: 'legal' },
  { value: 'social-sciences', label: 'Social Sciences / Research', discipline: 'social' },
  { value: 'education', label: 'Education / Training', discipline: 'social' },
  // Other
  { value: 'other', label: 'Other', discipline: 'other' },
]

const getDiscipline = (category: string): string => {
  const cat = projectCategories.find(c => c.value === category)
  return cat?.discipline || 'other'
}

const isTechDiscipline = (category: string) => getDiscipline(category) === 'tech'
const isEngineeringDiscipline = (category: string) => getDiscipline(category) === 'engineering'
const isBusinessDiscipline = (category: string) => getDiscipline(category) === 'business'
const isDesignDiscipline = (category: string) => getDiscipline(category) === 'design'

const projectSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  category: z.string().min(1, 'Please select a category'),
  technologies: z.array(z.string()).default([]),
  repositoryUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
  collaborators: z.array(z.string().email()).optional(),
  images: z.array(z.string()).optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void
  isSubmitting: boolean
  onStepChange: (step: number) => void
  currentStep: number
  initialData?: Partial<ProjectFormData>
}

export function ProjectForm({ 
  onSubmit, 
  isSubmitting, 
  onStepChange, 
  currentStep,
  initialData 
}: ProjectFormProps) {
  const [customTag, setCustomTag] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || [])
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      technologies: initialData?.technologies || [],
      repositoryUrl: initialData?.repositoryUrl || '',
      liveUrl: initialData?.liveUrl || '',
      tags: initialData?.tags || [],
      isPublic: initialData?.isPublic ?? true,
      collaborators: initialData?.collaborators || [],
      images: initialData?.images || []
    },
    mode: 'onChange'
  })

  const watchedData = watch()
  const selectedTechnologies = watch('technologies') || []
  const selectedTags = watch('tags') || []
  const selectedCategory = watch('category') || ''

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setValue('tags', [...selectedTags, customTag.trim()])
      setCustomTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleImageUpload = useCallback((imageUrls: string[]) => {
    setUploadedImages(imageUrls)
    setValue('images', imageUrls)
  }, [setValue])

  const handleDocumentUpload = useCallback((docUrls: string[]) => {
    setUploadedDocuments(docUrls)
  }, [])

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProjectFormData)[] = []

    switch (currentStep) {
      case 0:
        fieldsToValidate = ['title', 'description', 'category']
        break
      case 1:
        fieldsToValidate = ['technologies']
        break
    }

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid && currentStep < 2) {
      onStepChange(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const onFormSubmit = (data: ProjectFormData) => {
    const formData = {
      ...data,
      images: uploadedImages,
    }
    onSubmit(formData)
  }

  const getStepValidation = (step: number) => {
    switch (step) {
      case 0:
        return !errors.title && !errors.description && !errors.category && 
               watchedData.title && watchedData.description && watchedData.category
      case 1:
        return !errors.technologies
      case 2:
        return isValid
      default:
        return false
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Step 0: Basic Information */}
      {currentStep === 0 && (
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Project Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter your project title..."
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
            <p className="text-sm text-gray-700">
              A clear, descriptive title that explains what your project does
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Project Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your project in detail..."
              rows={6}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="text-sm text-gray-700">
              Explain the problem you solved, your approach, key features, and any challenges you overcame. 
              This helps our AI provide better analysis.
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Project Category <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
            <p className="text-sm text-gray-700">
              Choose the category that best describes your project
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Tools, Links & Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Tools/Technologies — label adapts to discipline */}
          <div className="space-y-2">
            <Label>
              {isEngineeringDiscipline(selectedCategory)
                ? 'Tools & Software Used'
                : isBusinessDiscipline(selectedCategory)
                  ? 'Tools & Methods Used'
                  : isDesignDiscipline(selectedCategory)
                    ? 'Design Tools Used'
                    : 'Technologies Used'}
            </Label>
            <Controller
              name="technologies"
              control={control}
              render={({ field }) => (
                <TechnologySelector
                  selected={field.value}
                  onChange={field.onChange}
                  error={!!errors.technologies}
                />
              )}
            />
            <p className="text-sm text-gray-700">
              {isEngineeringDiscipline(selectedCategory)
                ? 'e.g. SolidWorks, AutoCAD, MATLAB, ANSYS, SAP2000, LabVIEW'
                : isBusinessDiscipline(selectedCategory)
                  ? 'e.g. Excel, Power BI, Tableau, SAP, Python, R, SPSS'
                  : isDesignDiscipline(selectedCategory)
                    ? 'e.g. Figma, Sketch, Adobe XD, Photoshop, Illustrator, Rhino'
                    : 'Select all technologies, frameworks, and tools you used'}
            </p>
          </div>

          {/* Repository URL — only for tech/data */}
          {(isTechDiscipline(selectedCategory) || selectedCategory === 'data-science' || selectedCategory === 'lab-research') && (
            <div className="space-y-2">
              <Label htmlFor="repositoryUrl">Repository URL</Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                <Input
                  id="repositoryUrl"
                  type="url"
                  placeholder="https://github.com/username/project"
                  {...register('repositoryUrl')}
                  className={`pl-10 ${errors.repositoryUrl ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.repositoryUrl && (
                <p className="text-sm text-red-600">{errors.repositoryUrl.message}</p>
              )}
              <p className="text-sm text-gray-700">
                Link to your GitHub repository (helps with AI analysis)
              </p>
            </div>
          )}

          {/* Live URL / Portfolio URL — adapts label */}
          <div className="space-y-2">
            <Label htmlFor="liveUrl">
              {isEngineeringDiscipline(selectedCategory)
                ? 'Project Documentation URL'
                : isBusinessDiscipline(selectedCategory)
                  ? 'Presentation / Report URL'
                  : isDesignDiscipline(selectedCategory)
                    ? 'Portfolio / Behance URL'
                    : 'Live Demo URL'}
            </Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                id="liveUrl"
                type="url"
                placeholder={
                  isEngineeringDiscipline(selectedCategory)
                    ? 'https://docs.google.com/... or project page'
                    : isDesignDiscipline(selectedCategory)
                      ? 'https://behance.net/... or portfolio link'
                      : 'https://your-project.com'
                }
                {...register('liveUrl')}
                className={`pl-10 ${errors.liveUrl ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.liveUrl && (
              <p className="text-sm text-red-600">{errors.liveUrl.message}</p>
            )}
          </div>

          {/* Discipline-specific context */}
          {isEngineeringDiscipline(selectedCategory) && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-blue-800">
                  <strong>Engineering projects:</strong> Upload your CAD files, technical drawings, simulation results, or lab reports using the document upload below. Our AI analyzes PDFs, Word docs, and Excel files to understand your technical work.
                </p>
              </CardContent>
            </Card>
          )}

          {isBusinessDiscipline(selectedCategory) && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-green-800">
                  <strong>Business projects:</strong> Upload your analysis reports, financial models, strategy presentations, or market research. Include quantifiable outcomes (revenue impact, cost savings, efficiency gains) in your description for stronger AI analysis.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tags..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomTag()
                  }
                }}
              />
              <Button type="button" onClick={addCustomTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-700">
              Add keywords that describe your project (e.g., responsive, real-time, API)
            </p>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Project Screenshots</Label>
            <FileUpload
              onUpload={handleImageUpload}
              acceptedFileTypes={['image/*']}
              maxFiles={5}
              maxFileSize={5 * 1024 * 1024} // 5MB
            />
            <p className="text-sm text-gray-700">
              Upload screenshots or images of your project (up to 5 images, max 5MB each)
            </p>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <Label>Project Documents (Optional)</Label>
            <FileUpload
              onUpload={handleDocumentUpload}
              acceptedFileTypes={[
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/msword',
                'application/vnd.ms-excel',
              ]}
              maxFiles={3}
              maxFileSize={25 * 1024 * 1024}
            />
            <p className="text-sm text-gray-700">
              Upload PDFs, Word docs, or Excel files related to your project (up to 3 files, max 25MB each). These will be analyzed by AI.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Collaborators & Settings */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Collaborators */}
          <div className="space-y-2">
            <Label>Collaborators (Optional)</Label>
            <Controller
              name="collaborators"
              control={control}
              render={({ field }) => (
                <CollaboratorInput
                  collaborators={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="text-sm text-gray-700">
              Add email addresses of people who worked on this project with you
            </p>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Project Visibility</Label>
            <div className="flex items-start space-x-3">
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isPublic"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="space-y-1">
                <Label htmlFor="isPublic" className="text-sm font-normal cursor-pointer">
                  Make this project public
                </Label>
                <p className="text-sm text-gray-700">
                  Public projects can be viewed by recruiters and other users. 
                  Private projects are only visible to you.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Project Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="ml-2 text-gray-600">{watchedData.title || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">
                    {projectCategories.find(c => c.value === watchedData.category)?.label || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Technologies:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedTechnologies.length > 0 ? (
                      selectedTechnologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-700">None selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Visibility:</span>
                  <span className="ml-2 text-gray-600">
                    {watchedData.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              After submitting, your project will be analyzed by our AI system to:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Generate an innovation and complexity score</li>
                <li>Identify key skills demonstrated</li>
                <li>Create professional project narratives</li>
                <li>Find relevant job opportunities</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center space-x-2">
          {[0, 1, 2].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full ${
                step === currentStep
                  ? 'bg-primary'
                  : step < currentStep
                  ? 'bg-primary/50'
                  : 'bg-gray-200'
              }`}
            />
          ))}
          <span className="text-sm text-gray-700 ml-2">
            Step {currentStep + 1} of 3
          </span>
        </div>

        <div className="flex space-x-3">
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          
          {currentStep < 2 ? (
            <Button 
              type="button" 
              onClick={nextStep}
              disabled={!getStepValidation(currentStep)}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting || !isValid}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}