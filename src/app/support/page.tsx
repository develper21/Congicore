"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Mail,
  Phone,
  Search,
  Book,
  HelpCircle,
  FileText,
  Video,
  ExternalLink,
  Send,
  AlertCircle,
  Info,
} from "lucide-react";

const faqCategories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: <Book className="h-5 w-5" />,
    questions: [
      {
        q: "How do I upload my first document?",
        a: "Navigate to the Documents page and click the 'Upload Document' button. You can upload PDFs, Word documents, images, audio files, and videos. Our AI will automatically process and extract key information.",
      },
      {
        q: "What file formats are supported?",
        a: "We support PDF, DOC, DOCX, TXT, MD, JPG, PNG, MP3, MP4, and many other formats. Maximum file size is 100MB for free users and 500MB for Pro users.",
      },
      {
        q: "How does the AI chat work?",
        a: "Our AI chat allows you to have natural conversations with your knowledge base. Simply ask questions about your uploaded content, and the AI will provide answers based on your documents.",
      },
    ],
  },
  {
    id: "features",
    name: "Features",
    icon: <HelpCircle className="h-5 w-5" />,
    questions: [
      {
        q: "What is the Knowledge Graph?",
        a: "The Knowledge Graph visualizes connections between concepts in your documents. It helps you see relationships and discover insights you might have missed.",
      },
      {
        q: "How does spaced repetition work?",
        a: "Our system uses scientifically-proven spaced repetition algorithms to show you information at optimal intervals for maximum retention.",
      },
      {
        q: "Can I collaborate with others?",
        a: "Team plans allow you to share documents and collaborate with team members. You can create shared knowledge bases and work together on projects.",
      },
    ],
  },
  {
    id: "billing",
    name: "Billing & Plans",
    icon: <FileText className="h-5 w-5" />,
    questions: [
      {
        q: "How do I upgrade my plan?",
        a: "Go to the Billing page and select the plan you want to upgrade to. You can pay monthly or yearly, with a 20% discount for yearly billing.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, and PayPal. For enterprise customers, we also offer invoice billing.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical Support",
    icon: <AlertCircle className="h-5 w-5" />,
    questions: [
      {
        q: "Why is my document processing slowly?",
        a: "Processing time depends on file size and complexity. Large files may take longer. You can check processing status in the Documents page.",
      },
      {
        q: "Is my data secure?",
        a: "Yes, we use industry-standard encryption for data storage and transmission. Your data is stored securely and is never shared with third parties.",
      },
      {
        q: "Can I export my data?",
        a: "Yes, you can export all your data at any time from the Settings page. We support multiple export formats including JSON, CSV, and PDF.",
      },
    ],
  },
];

const supportOptions = [
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: <MessageCircle className="h-6 w-6" />,
    action: "Start Chat",
    available: "24/7",
  },
  {
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours",
    icon: <Mail className="h-6 w-6" />,
    action: "Send Email",
    available: "Business hours",
  },
  {
    title: "Phone Support",
    description: "Call us for immediate assistance",
    icon: <Phone className="h-6 w-6" />,
    action: "Call Now",
    available: "Mon-Fri, 9AM-6PM EST",
  },
  {
    title: "Video Call",
    description: "Schedule a video call with our experts",
    icon: <Video className="h-6 w-6" />,
    action: "Schedule Call",
    available: "By appointment",
  },
];

const resources = [
  {
    title: "User Guide",
    description: "Comprehensive guide to all features",
    icon: <Book className="h-5 w-5" />,
    link: "#",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    icon: <Video className="h-5 w-5" />,
    link: "#",
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers",
    icon: <FileText className="h-5 w-5" />,
    link: "#",
  },
  {
    title: "Community Forum",
    description: "Connect with other users",
    icon: <MessageCircle className="h-5 w-5" />,
    link: "#",
  },
];

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
    priority: "medium",
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle support ticket submission
    console.log("Support ticket:", supportForm);
  };

  const filteredQuestions =
    faqCategories
      .find((cat) => cat.id === selectedCategory)
      ?.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || [];

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Help & Support
            </h1>
            <p className="text-muted-foreground">
              Find answers and get help with your AI Knowledge Twin
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {supportOptions.map((option, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 text-primary">{option.icon}</div>
                  <h3 className="font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    {option.action}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    {option.available}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Frequently Asked Questions
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredQuestions.map((qa, index) => (
                    <div key={index} className="border rounded-lg">
                      <button
                        onClick={() =>
                          setExpandedQuestion(
                            expandedQuestion === index ? null : index,
                          )
                        }
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/50"
                      >
                        <span className="font-medium">{qa.q}</span>
                        <div
                          className={`transform transition-transform ${
                            expandedQuestion === index ? "rotate-180" : ""
                          }`}
                        >
                          <Info className="h-4 w-4" />
                        </div>
                      </button>
                      {expandedQuestion === index && (
                        <div className="px-4 pb-4 text-muted-foreground">
                          {qa.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Ticket Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <input
                      type="text"
                      value={supportForm.subject}
                      onChange={(e) =>
                        setSupportForm((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      placeholder="Brief description of your issue"
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      value={supportForm.priority}
                      onChange={(e) =>
                        setSupportForm((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    rows={5}
                    value={supportForm.message}
                    onChange={(e) =>
                      setSupportForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Describe your issue in detail"
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background resize-none"
                    required
                  />
                </div>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-primary">{resource.icon}</div>
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </AuthGuard>
  );
}
