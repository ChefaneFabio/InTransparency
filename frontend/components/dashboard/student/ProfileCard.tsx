'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Building2, 
  Edit3,
  Star,
  Award,
  Target
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileCardProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    university?: string
    major?: string
    graduationYear?: number
    company?: string
    position?: string
    bio?: string
    avatarUrl?: string
    skills: string[]
    location?: string
    createdAt: string
  } | null
}

export function ProfileCard({ user }: ProfileCardProps) {
  if (!user) return null

  // Calculate profile completion percentage
  const calculateCompleteness = () => {
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.bio,
      user.university,
      user.major,
      user.location,
      user.avatarUrl,
      user.skills?.length > 0 ? 'skills' : null
    ]
    const completedFields = fields.filter(field => field && field.length > 0).length
    return Math.round((completedFields / fields.length) * 100)
  }

  const completeness = calculateCompleteness()
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const memberSince = new Date(user.createdAt).getFullYear()

  return (
    <Card>
      <CardContent className="p-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {user.role}
            </p>
            {user.location && (
              <p className="text-sm text-gray-700 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {user.location}
              </p>
            )}
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/student/profile/edit">
              <Edit3 className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 line-clamp-3">{user.bio}</p>
          </div>
        )}

        {/* Education & Work */}
        <div className="mt-4 space-y-2">
          {user.university && (
            <div className="flex items-center text-sm text-gray-600">
              <GraduationCap className="h-4 w-4 mr-2 text-gray-600" />
              <span>
                {user.major ? `${user.major} at ` : ''}{user.university}
                {user.graduationYear && ` • Class of ${user.graduationYear}`}
              </span>
            </div>
          )}
          
          {user.company && (
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="h-4 w-4 mr-2 text-gray-600" />
              <span>
                {user.position ? `${user.position} at ` : ''}{user.company}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-600" />
            <span>Member since {memberSince}</span>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Profile Completion</span>
            <span className={`font-medium ${getCompletenessColor(completeness)}`}>
              {completeness}%
            </span>
          </div>
          <Progress value={completeness} className="h-2" />
          {completeness < 100 && (
            <p className="text-xs text-gray-700 mt-1">
              Complete your profile to attract more opportunities
            </p>
          )}
        </div>

        {/* Skills Preview */}
        {user.skills && user.skills.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Top Skills</span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/student/profile/edit">
                  <Edit3 className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 6).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{user.skills.length - 6}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">4.8</div>
            <div className="text-xs text-gray-700">Rating</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">12</div>
            <div className="text-xs text-gray-700">Projects</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">86%</div>
            <div className="text-xs text-gray-700">Match Rate</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/student/profile">
              <User className="mr-2 h-4 w-4" />
              View Full Profile
            </Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/dashboard/student/profile/edit">
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Profile Tips */}
        {completeness < 80 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Boost your profile! 
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              {!user.avatarUrl && <li>• Add a professional photo</li>}
              {!user.bio && <li>• Write a compelling bio</li>}
              {(!user.skills || user.skills.length === 0) && <li>• Add your skills</li>}
              {!user.location && <li>• Add your location</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}