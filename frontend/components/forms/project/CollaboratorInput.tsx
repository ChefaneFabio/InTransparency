'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, X, Mail, Search, UserPlus } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CollaboratorInputProps {
  collaborators: string[]
  onChange: (collaborators: string[]) => void
}

interface Collaborator {
  email: string
  name?: string
  avatar?: string
  status?: 'pending' | 'accepted' | 'declined'
}

export function CollaboratorInput({ collaborators, onChange }: CollaboratorInputProps) {
  const [emailInput, setEmailInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [emailError, setEmailError] = useState('')

  // Mock suggested collaborators (in real app, this would come from an API)
  const suggestedCollaborators = [
    {
      email: 'john.doe@university.edu',
      name: 'John Doe',
      avatar: '',
      status: 'accepted' as const
    },
    {
      email: 'jane.smith@university.edu', 
      name: 'Jane Smith',
      avatar: '',
      status: 'accepted' as const
    },
    {
      email: 'mike.wilson@university.edu',
      name: 'Mike Wilson', 
      avatar: '',
      status: 'pending' as const
    },
    {
      email: 'sarah.johnson@university.edu',
      name: 'Sarah Johnson',
      avatar: '',
      status: 'accepted' as const
    }
  ]

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const addCollaborator = (email: string) => {
    setEmailError('')
    
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    if (collaborators.includes(email)) {
      setEmailError('This collaborator has already been added')
      return
    }

    onChange([...collaborators, email])
    setEmailInput('')
  }

  const removeCollaborator = (email: string) => {
    onChange(collaborators.filter(c => c !== email))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCollaborator(emailInput)
    }
  }

  const getFilteredSuggestions = () => {
    if (!searchQuery) return suggestedCollaborators.slice(0, 4)
    
    return suggestedCollaborators.filter(collab =>
      collab.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getCollaboratorInfo = (email: string): Collaborator => {
    const suggested = suggestedCollaborators.find(c => c.email === email)
    return suggested || { email }
  }

  return (
    <div className="space-y-4">
      {/* Current Collaborators */}
      {collaborators.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Current Collaborators ({collaborators.length})
          </h4>
          <div className="space-y-2">
            {collaborators.map((email) => {
              const collab = getCollaboratorInfo(email)
              return (
                <Card key={email}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collab.avatar} />
                          <AvatarFallback className="text-xs">
                            {collab.name ? getInitials(collab.name) : <Mail className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {collab.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {collab.email}
                          </p>
                        </div>
                        {collab.status && (
                          <Badge 
                            variant={collab.status === 'accepted' ? 'default' : 
                                   collab.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {collab.status}
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaborator(email)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Add New Collaborator */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Add Collaborator</h4>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter email address..."
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value)
                setEmailError('')
              }}
              onKeyPress={handleKeyPress}
              className={emailError ? 'border-red-500' : ''}
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
          </div>
          <Button 
            type="button" 
            onClick={() => addCollaborator(emailInput)}
            disabled={!emailInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Suggestions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Find Collaborators</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Suggested Collaborators */}
        <div className="space-y-2">
          {getFilteredSuggestions().map((collab) => (
            <Card 
              key={collab.email} 
              className={`cursor-pointer transition-colors ${
                collaborators.includes(collab.email) 
                  ? 'bg-gray-50 border-gray-300' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => !collaborators.includes(collab.email) && addCollaborator(collab.email)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback className="text-xs">
                        {collab.name ? getInitials(collab.name) : <Mail className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {collab.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {collab.email}
                      </p>
                    </div>
                    <Badge 
                      variant={collab.status === 'accepted' ? 'default' : 
                             collab.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {collab.status}
                    </Badge>
                  </div>
                  {collaborators.includes(collab.email) ? (
                    <Badge variant="secondary" className="text-xs">Added</Badge>
                  ) : (
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {getFilteredSuggestions().length === 0 && searchQuery && (
            <p className="text-sm text-gray-500 text-center py-4">
              No collaborators found matching "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Information */}
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Collaborators will receive an email invitation to join this project. 
          They can view and edit project details, and will be credited as contributors.
        </AlertDescription>
      </Alert>

      {/* Collaboration Guidelines */}
      {collaborators.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Collaboration Guidelines</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• All collaborators can edit project information and upload files</li>
              <li>• Contributors will be listed on the project showcase page</li>
              <li>• Project analytics and AI insights will be shared with all collaborators</li>
              <li>• Collaborators can remove themselves from the project at any time</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}