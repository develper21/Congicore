"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Camera,
  Shield,
  Bell,
  Globe,
  Award,
  TrendingUp,
  Clock,
  Target,
  Star
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate about learning and knowledge management. Always curious about new technologies and ways to improve productivity.",
    website: "https://johndoe.com",
    linkedin: "linkedin.com/in/johndoe",
    twitter: "@johndoe"
  })

  const stats = [
    {
      label: "Documents Uploaded",
      value: "248",
      icon: <User className="h-5 w-5" />,
      trend: "+12%"
    },
    {
      label: "Knowledge Points",
      value: "1,847",
      icon: <Award className="h-5 w-5" />,
      trend: "+23%"
    },
    {
      label: "Learning Streak",
      value: "15 days",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: "+5 days"
    },
    {
      label: "Study Time",
      value: "124h",
      icon: <Clock className="h-5 w-5" />,
      trend: "+8h"
    }
  ]

  const achievements = [
    {
      id: 1,
      title: "Early Adopter",
      description: "Joined in the first month",
      icon: <Star className="h-6 w-6" />,
      earned: true,
      date: "Jan 2024"
    },
    {
      id: 2,
      title: "Knowledge Seeker",
      description: "Uploaded 100+ documents",
      icon: <Target className="h-6 w-6" />,
      earned: true,
      date: "Mar 2024"
    },
    {
      id: 3,
      title: "Consistent Learner",
      description: "30-day learning streak",
      icon: <TrendingUp className="h-6 w-6" />,
      earned: false,
      date: "In Progress"
    },
    {
      id: 4,
      title: "Master Mind",
      description: "Reached 1000 knowledge points",
      icon: <Award className="h-6 w-6" />,
      earned: true,
      date: "Feb 2024"
    }
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Save profile data
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">
                Manage your personal information and preferences
              </p>
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Profile Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="relative inline-block">
                  <div className="h-24 w-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </div>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="mt-4">
                  {profileData.firstName} {profileData.lastName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {profileData.email}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined January 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={profileData.website} className="text-primary hover:underline">
                      {profileData.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600">{stat.trend}</p>
                    </div>
                    <div className="text-primary">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`text-center p-4 border rounded-lg ${
                      achievement.earned 
                        ? 'border-primary/20 bg-primary/5' 
                        : 'border-muted opacity-50'
                    }`}
                  >
                    <div className={`mx-auto mb-2 ${
                      achievement.earned ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {achievement.icon}
                    </div>
                    <h3 className="font-medium text-sm">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                    <p className="text-xs mt-2">{achievement.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">LinkedIn</label>
                  <input
                    type="text"
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Twitter</label>
                  <input
                    type="text"
                    value={profileData.twitter}
                    onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </AuthGuard>
  )
}
