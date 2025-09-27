'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X, Search } from 'lucide-react'

const technologyCategories = {
  'Frontend': [
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
    'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS',
    'Bootstrap', 'Material-UI', 'Chakra UI', 'Styled Components'
  ],
  'Backend': [
    'Node.js', 'Express.js', 'Nest.js', 'Python', 'Django', 'Flask', 'FastAPI',
    'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails',
    'Go', 'Rust', 'Kotlin', 'Scala'
  ],
  'Database': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Cassandra',
    'DynamoDB', 'Firebase', 'Supabase', 'Prisma', 'TypeORM', 'Sequelize'
  ],
  'Mobile': [
    'React Native', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Java',
    'Xamarin', 'Ionic', 'Cordova', 'Expo'
  ],
  'Cloud & DevOps': [
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
    'Jenkins', 'GitHub Actions', 'CircleCI', 'Vercel', 'Netlify', 'Heroku'
  ],
  'Data & AI': [
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter',
    'R', 'Matplotlib', 'Seaborn', 'OpenAI', 'Hugging Face', 'LangChain'
  ],
  'Tools & Other': [
    'Git', 'GitHub', 'GitLab', 'Webpack', 'Vite', 'ESLint', 'Prettier',
    'Jest', 'Cypress', 'Playwright', 'Storybook', 'Figma', 'Adobe XD'
  ]
}

interface TechnologySelectorProps {
  selected: string[]
  onChange: (technologies: string[]) => void
  error?: boolean
}

export function TechnologySelector({ selected, onChange, error }: TechnologySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [customTech, setCustomTech] = useState('')
  const [activeCategory, setActiveCategory] = useState('Frontend')

  const addTechnology = (tech: string) => {
    if (!selected.includes(tech)) {
      onChange([...selected, tech])
    }
  }

  const removeTechnology = (tech: string) => {
    onChange(selected.filter(t => t !== tech))
  }

  const addCustomTechnology = () => {
    if (customTech.trim() && !selected.includes(customTech.trim())) {
      onChange([...selected, customTech.trim()])
      setCustomTech('')
    }
  }

  const getFilteredTechnologies = (category: string) => {
    const technologies = technologyCategories[category as keyof typeof technologyCategories] || []
    if (!searchTerm) return technologies
    
    return technologies.filter(tech =>
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getAllFilteredTechnologies = () => {
    if (!searchTerm) return []
    
    const allTechs = Object.values(technologyCategories).flat()
    return allTechs.filter(tech =>
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="space-y-4">
      {/* Selected Technologies */}
      {selected.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Technologies ({selected.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {(selected || []).map((tech) => (
              <Badge key={tech} variant="default" className="flex items-center gap-1">
                {tech}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeTechnology(tech)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search technologies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`pl-10 ${error ? 'border-red-500' : ''}`}
        />
      </div>

      {/* Technology Browser */}
      <Card className={error ? 'border-red-500' : ''}>
        <CardContent className="p-4">
          {searchTerm ? (
            // Search Results
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Search Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {getAllFilteredTechnologies().map((tech) => (
                  <Button
                    key={tech}
                    type="button"
                    variant={selected.includes(tech) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addTechnology(tech)}
                    disabled={selected.includes(tech)}
                    className="justify-start h-8 text-xs"
                  >
                    {tech}
                  </Button>
                ))}
              </div>
              {getAllFilteredTechnologies().length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No technologies found. Try adding it as a custom technology below.
                </p>
              )}
            </div>
          ) : (
            // Category Tabs
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4">
                {Object.keys(technologyCategories).map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-xs px-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(technologyCategories).map(([category, technologies]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {technologies.map((tech) => (
                      <Button
                        key={tech}
                        type="button"
                        variant={selected.includes(tech) ? "default" : "outline"}
                        size="sm"
                        onClick={() => addTechnology(tech)}
                        disabled={selected.includes(tech)}
                        className="justify-start h-8 text-xs"
                      >
                        {tech}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Custom Technology */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Add Custom Technology</h4>
        <div className="flex gap-2">
          <Input
            placeholder="Enter technology name..."
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustomTechnology()
              }
            }}
          />
          <Button 
            type="button" 
            onClick={addCustomTechnology}
            disabled={!customTech.trim() || selected.includes(customTech.trim())}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Popular Combinations */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Popular Combinations</h4>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const combo = ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
                const newSelected = Array.from(new Set([...selected, ...combo]))
                onChange(newSelected)
              }}
              className="text-xs"
            >
              Full Stack React
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const combo = ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel']
                const newSelected = Array.from(new Set([...selected, ...combo]))
                onChange(newSelected)
              }}
              className="text-xs"
            >
              Next.js + Tailwind
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const combo = ['Python', 'Django', 'PostgreSQL', 'Redis']
                const newSelected = Array.from(new Set([...selected, ...combo]))
                onChange(newSelected)
              }}
              className="text-xs"
            >
              Django Stack
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const combo = ['React Native', 'TypeScript', 'Firebase', 'Expo']
                const newSelected = Array.from(new Set([...selected, ...combo]))
                onChange(newSelected)
              }}
              className="text-xs"
            >
              Mobile App
            </Button>
          </div>
        </div>
      </div>

      {/* Technology Count */}
      <div className="text-xs text-gray-500 text-center">
        {selected.length === 0 
          ? 'Select at least one technology'
          : `${selected.length} technolog${selected.length === 1 ? 'y' : 'ies'} selected`
        }
      </div>
    </div>
  )
}