"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
} from "lucide-react"

const documents = [
  {
    id: 1,
    title: "Machine Learning Basics.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploaded: "2 hours ago",
    status: "processed",
    tags: ["AI", "ML", "Basics"],
    thumbnail: "/api/placeholder/100/140"
  },
  {
    id: 2,
    title: "Team Meeting Recording.mp4",
    type: "Video",
    size: "156 MB",
    uploaded: "1 day ago",
    status: "processing",
    tags: ["Meeting", "Team"],
    thumbnail: "/api/placeholder/100/140"
  },
  {
    id: 3,
    title: "Project Notes.docx",
    type: "Document",
    size: "1.2 MB",
    uploaded: "3 days ago",
    status: "processed",
    tags: ["Project", "Notes"],
    thumbnail: "/api/placeholder/100/140"
  },
  {
    id: 4,
    title: "Research Paper.pdf",
    type: "PDF",
    size: "5.8 MB",
    uploaded: "1 week ago",
    status: "processed",
    tags: ["Research", "Academic"],
    thumbnail: "/api/placeholder/100/140"
  },
  {
    id: 5,
    title: "Lecture Recording.mp3",
    type: "Audio",
    size: "45 MB",
    uploaded: "2 weeks ago",
    status: "processed",
    tags: ["Lecture", "Education"],
    thumbnail: "/api/placeholder/100/140"
  },
  {
    id: 6,
    title: "Code Documentation.md",
    type: "Markdown",
    size: "0.3 MB",
    uploaded: "3 weeks ago",
    status: "processed",
    tags: ["Code", "Documentation"],
    thumbnail: "/api/placeholder/100/140"
  }
]

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
              <p className="text-muted-foreground">
                Manage and organize your knowledge base
              </p>
            </div>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-sm line-clamp-2">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{doc.type}</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{doc.uploaded}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{doc.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <span>{doc.uploaded}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}
