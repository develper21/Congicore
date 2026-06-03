"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Brain,
  Download,
  Trash2,
  Eye,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Laptop,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    aiInsights: true,
  });
  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analytics: false,
    personalization: true,
    publicProfile: false,
  });

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Passionate about learning and knowledge management",
  });

  // Settings form state
  const [settingsData, setSettingsData] = useState({
    digestFrequency: "Weekly",
    sessionTimeout: "1 hour",
    aiModel: "GPT-4 (Recommended)",
    responseStyle: "Balanced",
    language: "English",
    learningPace: "Moderate",
    difficultyLevel: "Intermediate",
    adaptiveLearning: true,
    accentColor: "blue",
    fontSize: "Medium",
    compactMode: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSettings();
      if (response.settings) {
        setSettingsData(response.settings);
        setNotifications(response.settings.notifications || notifications);
        setPrivacy(response.settings.privacy || privacy);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      await api.updateProfile(profileData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      await api.updateSettings({
        ...settingsData,
        notifications,
        privacy,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "ai", label: "AI Settings", icon: Brain },
    { id: "data", label: "Data Management", icon: Database },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-700">Settings saved successfully</p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
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
                className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Laptop className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">MacBook Pro</p>
                  <p className="text-sm text-muted-foreground">
                    Current device • Last active now
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Current
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">iPhone 14</p>
                  <p className="text-sm text-muted-foreground">
                    Last active 2 hours ago
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-700">Settings saved successfully</p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) =>
                setNotifications({ ...notifications, email: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Browser push notifications
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) =>
                setNotifications({ ...notifications, push: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">
                Get weekly knowledge insights
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weekly}
              onChange={(e) =>
                setNotifications({ ...notifications, weekly: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI Insights</p>
              <p className="text-sm text-muted-foreground">
                Personalized learning recommendations
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.aiInsights}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  aiInsights: e.target.checked,
                })
              }
              className="h-4 w-4"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Digest Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={settingsData.digestFrequency}
            onChange={(e) =>
              setSettingsData((prev) => ({
                ...prev,
                digestFrequency: e.target.value,
              }))
            }
            className="w-full p-2 border border-border rounded-lg bg-background"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
            <option>Never</option>
          </select>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-700">Settings saved successfully</p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Data Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Collection</p>
              <p className="text-sm text-muted-foreground">
                Allow collection of usage data
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.dataCollection}
              onChange={(e) =>
                setPrivacy({ ...privacy, dataCollection: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Analytics</p>
              <p className="text-sm text-muted-foreground">
                Help improve the service
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.analytics}
              onChange={(e) =>
                setPrivacy({ ...privacy, analytics: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Personalization</p>
              <p className="text-sm text-muted-foreground">
                Customize experience based on usage
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.personalization}
              onChange={(e) =>
                setPrivacy({ ...privacy, personalization: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Public Profile</p>
              <p className="text-sm text-muted-foreground">
                Make profile visible to others
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacy.publicProfile}
              onChange={(e) =>
                setPrivacy({ ...privacy, publicProfile: e.target.checked })
              }
              className="h-4 w-4"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">
                Auto-logout after inactivity
              </p>
            </div>
            <select
              value={settingsData.sessionTimeout}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  sessionTimeout: e.target.value,
                }))
              }
              className="p-2 border border-border rounded-lg bg-background"
            >
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>Never</option>
            </select>
          </div>
          <Button variant="destructive" className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm text-green-700">Settings saved successfully</p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">AI Model</label>
            <select
              value={settingsData.aiModel}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  aiModel: e.target.value,
                }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
            >
              <option>GPT-4 (Recommended)</option>
              <option>GPT-3.5 Turbo</option>
              <option>Claude 3</option>
              <option>Local Model</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Response Style</label>
            <select
              value={settingsData.responseStyle}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  responseStyle: e.target.value,
                }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
            >
              <option>Balanced</option>
              <option>Concise</option>
              <option>Detailed</option>
              <option>Creative</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Language</label>
            <select
              value={settingsData.language}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  language: e.target.value,
                }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Learning Pace</label>
            <select
              value={settingsData.learningPace}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  learningPace: e.target.value,
                }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
            >
              <option>Relaxed</option>
              <option>Moderate</option>
              <option>Intensive</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Difficulty Level</label>
            <select
              value={settingsData.difficultyLevel}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  difficultyLevel: e.target.value,
                }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Adaptive Learning</p>
              <p className="text-sm text-muted-foreground">
                AI adjusts to your learning style
              </p>
            </div>
            <input
              type="checkbox"
              checked={settingsData.adaptiveLearning}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  adaptiveLearning: e.target.checked,
                }))
              }
              className="h-4 w-4"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Documents</span>
              <span>1.2 GB</span>
            </div>
            <div className="flex justify-between">
              <span>Audio Recordings</span>
              <span>800 MB</span>
            </div>
            <div className="flex justify-between">
              <span>Video Content</span>
              <span>400 MB</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Used</span>
              <span>2.4 GB of 10 GB</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Upgrade Storage Plan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Database className="mr-2 h-4 w-4" />
            Create Backup
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Eye className="mr-2 h-4 w-4" />
            View Data Summary
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={isDarkMode === false ? "secondary" : "outline"}
              onClick={() => setIsDarkMode(false)}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Sun className="h-6 w-6" />
              <span className="text-sm">Light</span>
            </Button>
            <Button
              variant={isDarkMode === true ? "secondary" : "outline"}
              onClick={() => setIsDarkMode(true)}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Moon className="h-6 w-6" />
              <span className="text-sm">Dark</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Globe className="h-6 w-6" />
              <span className="text-sm">System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Accent Color</label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {[
                "bg-blue-500",
                "bg-green-500",
                "bg-purple-500",
                "bg-orange-500",
                "bg-red-500",
                "bg-gray-500",
              ].map((color) => (
                <button
                  key={color}
                  className={`h-8 w-8 rounded-full ${color} border-2 border-background`}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Font Size</label>
            <select
              value={settingsData.fontSize}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  fontSize: e.target.value,
                }))
              }
              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>Extra Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground">
                Reduce spacing between elements
              </p>
            </div>
            <input
              type="checkbox"
              checked={settingsData.compactMode}
              onChange={(e) =>
                setSettingsData((prev) => ({
                  ...prev,
                  compactMode: e.target.checked,
                }))
              }
              className="h-4 w-4"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      case "ai":
        return renderAISettings();
      case "data":
        return renderDataManagement();
      case "appearance":
        return renderAppearanceSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-secondary text-secondary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">{renderTabContent()}</div>
        </div>
      </div>
    </Layout>
  );
}
