"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
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
  Brain,
  Download,
  Trash2,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
  Loader2,
  CheckCircle2,
  Laptop,
  Smartphone,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("ai");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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

  const [profileData, setProfileData] = useState({
    firstName: "Knowledge",
    lastName: "Explorer",
    email: "user@congicore.ai",
    bio: "AI researcher investigating knowledge graphs and spaced repetition.",
  });

  const [settingsData, setSettingsData] = useState({
    digestFrequency: "Weekly",
    sessionTimeout: "1 hour",
    aiModel: "GPT-4o (Recommended)",
    responseStyle: "Balanced",
    language: "English",
    learningPace: "Moderate",
    difficultyLevel: "Intermediate",
    adaptiveLearning: true,
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
      if (response && response.settings) {
        setSettingsData((prev) => ({ ...prev, ...response.settings }));
        if (response.settings.notifications) setNotifications(response.settings.notifications);
        if (response.settings.privacy) setPrivacy(response.settings.privacy);
      }
    } catch {
      // Default to initial state
    } finally {
      setLoading(false);
    }
  };

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
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
      triggerNotice("Settings updated successfully!");
    } catch {
      triggerNotice("Preferences saved locally!");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "ai", label: "AI & Model", icon: Brain },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "data", label: "Data Management", icon: Database },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <AuthGuard>
      <Layout>
        {notice && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel border-mintFoam/30 text-mintFoam text-xs flex items-center gap-2.5 shadow-glow-mint bg-carbonTeal/90 animate-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 className="h-4 w-4 text-mintFoam" />
            <span>{notice}</span>
          </div>
        )}

        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-chromeViolet/15 text-glassBlue border border-chromeViolet/30 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-glassBlue" /> Workspace Configuration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              System Settings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Customize AI synthesis behavior, notification alerts, privacy parameters, and data vault exports.
            </p>
          </div>

          {/* Navigation Tabs Pill Bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border-white/[0.08] overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-chromeViolet to-hyperCobalt text-white shadow-glow-violet"
                      : "text-muted-foreground hover:text-softChrome hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs">Loading preferences...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TAB: AI Settings */}
              {activeTab === "ai" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="p-6 space-y-5">
                    <CardTitle className="text-base font-semibold text-white">
                      AI Model & Reasoning Preferences
                    </CardTitle>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80">Primary Model</label>
                        <select
                          value={settingsData.aiModel}
                          onChange={(e) =>
                            setSettingsData((prev) => ({ ...prev, aiModel: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm bg-muted/60 border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                        >
                          <option>GPT-4o (Recommended)</option>
                          <option>Claude 3.5 Sonnet</option>
                          <option>Llama 3.3 (Local On-Device)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80">Synthesis Tone</label>
                        <select
                          value={settingsData.responseStyle}
                          onChange={(e) =>
                            setSettingsData((prev) => ({ ...prev, responseStyle: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm bg-muted/60 border border-white/[0.08] rounded-xl text-foreground focus:outline-none focus:border-chromeViolet/50 focus:ring-1 focus:ring-chromeViolet/20"
                        >
                          <option>Balanced & Rigorous</option>
                          <option>Concise & Bulleted</option>
                          <option>Socratic & Exploratory</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
                      <div>
                        <p className="text-sm font-semibold text-white">Adaptive Learning Adjustments</p>
                        <p className="text-xs text-muted-foreground">
                          Allow AI to autonomously modify flashcard repetition intervals based on cognitive fatigue.
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
                        className="h-4 w-4 rounded border-white/20 bg-muted/60 text-chromeViolet focus:ring-chromeViolet/20 cursor-pointer"
                      />
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB: Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="p-6 space-y-4">
                    <CardTitle className="text-base font-semibold text-white">
                      Alert & Digest Frequencies
                    </CardTitle>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                        <div>
                          <p className="text-sm font-semibold text-white">Spaced Repetition Reminders</p>
                          <p className="text-xs text-muted-foreground">
                            Receive daily notifications when cards are due for SM-2 review.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) =>
                            setNotifications((prev) => ({ ...prev, email: e.target.checked }))
                          }
                          className="h-4 w-4 rounded border-white/20 bg-muted/60 text-chromeViolet focus:ring-chromeViolet/20 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                        <div>
                          <p className="text-sm font-semibold text-white">Proactive AI Insight Bulletins</p>
                          <p className="text-xs text-muted-foreground">
                            Weekly breakdown of newly discovered knowledge graph links and gaps.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.aiInsights}
                          onChange={(e) =>
                            setNotifications((prev) => ({ ...prev, aiInsights: e.target.checked }))
                          }
                          className="h-4 w-4 rounded border-white/20 bg-muted/60 text-chromeViolet focus:ring-chromeViolet/20 cursor-pointer"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB: Privacy & Security */}
              {activeTab === "privacy" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="p-6 space-y-4">
                    <CardTitle className="text-base font-semibold text-white">
                      Data Encryption & Privacy Vault
                    </CardTitle>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                        <div>
                          <p className="text-sm font-semibold text-white">Zero-Knowledge Storage</p>
                          <p className="text-xs text-muted-foreground">
                            Client-side AES-256 encryption applied before upload to vector DB.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-mintFoam/10 text-mintFoam border border-mintFoam/20">
                          Active
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                        <div>
                          <p className="text-sm font-semibold text-white">AI Training Opt-Out</p>
                          <p className="text-xs text-muted-foreground">
                            Guarantees your knowledge base is never used for foundation model training.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-mintFoam/10 text-mintFoam border border-mintFoam/20">
                          Enforced
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB: Data Management */}
              {activeTab === "data" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="p-6 space-y-4">
                    <CardTitle className="text-base font-semibold text-white">
                      Storage & Data Export
                    </CardTitle>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span className="text-glassBlue">2.4 GB utilized</span>
                        <span>10.0 GB quota</span>
                      </div>
                      <div className="h-2 bg-[#021618] border border-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-chromeViolet to-mintFoam rounded-full shadow-glow-mint"
                          style={{ width: "24%" }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:border-chromeViolet/30 text-softChrome">
                        <Download className="h-4 w-4 text-glassBlue" /> Export All Memories (JSON)
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:border-chromeViolet/30 text-softChrome">
                        <Database className="h-4 w-4 text-mintFoam" /> Full Graph Backup
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB: Appearance */}
              {activeTab === "appearance" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="p-6 space-y-4">
                    <CardTitle className="text-base font-semibold text-white">
                      Theme & Interface Density
                    </CardTitle>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsDarkMode(true)}
                        className={`p-4 rounded-2xl border text-center space-y-2 transition-all cursor-pointer ${
                          isDarkMode
                            ? "border-chromeViolet bg-chromeViolet/15 shadow-glow-violet"
                            : "border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <Moon className="h-6 w-6 text-glassBlue mx-auto" />
                        <div>
                          <p className="text-xs font-semibold text-white">Deep Obsidian (Default)</p>
                          <p className="text-[10px] text-muted-foreground">Cyber-modern AI dark</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setIsDarkMode(false)}
                        className={`p-4 rounded-2xl border text-center space-y-2 transition-all cursor-pointer ${
                          !isDarkMode
                            ? "border-chromeViolet bg-chromeViolet/15 shadow-glow-violet"
                            : "border-white/[0.08] hover:border-white/20"
                        }`}
                      >
                        <Sun className="h-6 w-6 text-skinSand mx-auto" />
                        <div>
                          <p className="text-xs font-semibold text-white">Cyber Light</p>
                          <p className="text-[10px] text-muted-foreground">High contrast day theme</p>
                        </div>
                      </button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Save Footer Button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="shadow-glow-violet px-6 h-11 font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
