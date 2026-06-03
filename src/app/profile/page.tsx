"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  MapPin,
  Calendar,
  Edit,
  Camera,
  Shield,
  Globe,
  Loader2,
} from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    linkedin: "",
    twitter: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProfile();
      setProfileData(response.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.updateProfile(profileData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    }
  };

  return (
    <AuthGuard>
      <Layout>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProfile}>Retry</Button>
          </div>
        ) : (
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
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
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
                    {profileData.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {new Date().toLocaleDateString()}</span>
                    </div>
                    {profileData.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={profileData.website}
                          className="text-primary hover:underline"
                        >
                          {profileData.website}
                        </a>
                      </div>
                    )}
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
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Location</label>
                      <input
                        type="text"
                        value={profileData.location || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea
                        rows={3}
                        value={profileData.bio || ""}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                      value={profileData.website || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">LinkedIn</label>
                    <input
                      type="text"
                      value={profileData.linkedin || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          linkedin: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Twitter</label>
                    <input
                      type="text"
                      value={profileData.twitter || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          twitter: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Layout>
    </AuthGuard>
  );
}
