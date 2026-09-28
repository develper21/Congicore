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
  CheckCircle2,
  User,
  Sparkles,
  Mail,
  Phone,
  Share2,
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
    firstName: "Knowledge",
    lastName: "Explorer",
    email: "user@congicore.ai",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    bio: "AI researcher & lifelong learner investigating transformer attention matrices and neural knowledge graphs.",
    website: "https://congicore.ai",
    linkedin: "https://linkedin.com",
    twitter: "@congicore_ai",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProfile();
      if (response && response.profile) {
        setProfileData((prev) => ({
          ...prev,
          ...response.profile,
        }));
      }
    } catch {
      // Default to initial state
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(profileData);
      setIsEditing(false);
      triggerNotice("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AuthGuard>
      <Layout>
        {notice && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel border-mintFoam/30 text-mintFoam text-xs flex items-center gap-2.5 shadow-glow-mint bg-carbonTeal/90 animate-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 className="h-4 w-4 text-mintFoam" />
            <span>{notice}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-chromeViolet" />
            <span className="text-xs">Loading profile settings...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center glass-panel rounded-2xl max-w-md mx-auto space-y-3">
            <p className="text-rose-400 text-xs">{error}</p>
            <Button onClick={fetchProfile} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-chromeViolet/15 text-glassBlue border border-chromeViolet/30 mb-2">
                  <User className="h-3.5 w-3.5" /> Identity & Neural Credentials
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  User Profile
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Manage your personal persona, bio, and linked presence.
                </p>
              </div>

              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                disabled={saving}
                className={isEditing ? "shadow-glow-violet" : "border-white/10 hover:border-chromeViolet/30 hover:bg-carbonTeal/20"}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Shield className="mr-2 h-4 w-4 text-mintFoam" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4 text-glassBlue" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            {/* Profile Overview Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Avatar & Key Details Card */}
              <Card className="md:col-span-1 p-6 text-center space-y-5 border-white/[0.08] bg-card/80">
                <div className="relative inline-block mx-auto">
                  <div className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-chromeViolet via-hyperCobalt to-toxicViolet flex items-center justify-center text-white text-3xl font-extrabold shadow-glow-violet border border-white/20">
                    {profileData.firstName?.[0] || "U"}
                    {profileData.lastName?.[0] || ""}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-[#021618] border border-chromeViolet/40 text-glassBlue flex items-center justify-center shadow-lg hover:bg-carbonTeal transition-colors cursor-pointer">
                      <Camera className="h-4 w-4 text-glassBlue" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono truncate">{profileData.email}</p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] text-xs space-y-2.5 text-left text-muted-foreground">
                  {profileData.location && (
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-glassBlue" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-mintFoam" />
                    <span>Member since 2026</span>
                  </div>
                  {profileData.website && (
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-skinSand" />
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-glassBlue hover:underline truncate"
                      >
                        {profileData.website}
                      </a>
                    </div>
                  )}
                </div>
              </Card>

              {/* Personal Information Form */}
              <Card className="md:col-span-2 p-6 space-y-5">
                <CardTitle className="text-base font-semibold text-white">
                  Personal Information
                </CardTitle>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-muted/30 border border-white/[0.04] rounded-xl text-muted-foreground opacity-60 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80">Location</label>
                    <input
                      type="text"
                      value={profileData.location || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80">Bio & Research Interests</label>
                    <textarea
                      rows={3}
                      value={profileData.bio || ""}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Social Links Card */}
            <Card className="p-6 space-y-4 border-white/[0.08] bg-card/80">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Share2 className="h-4 w-4 text-glassBlue" />
                Linked Public Presence
              </CardTitle>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">Personal Website</label>
                  <input
                    type="url"
                    value={profileData.website || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, website: e.target.value }))
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">LinkedIn</label>
                  <input
                    type="text"
                    value={profileData.linkedin || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, linkedin: e.target.value }))
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">X / Twitter</label>
                  <input
                    type="text"
                    value={profileData.twitter || ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, twitter: e.target.value }))
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-sm bg-muted/50 border border-white/[0.08] rounded-xl text-foreground disabled:opacity-60 focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </Layout>
    </AuthGuard>
  );
}
