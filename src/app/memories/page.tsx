"use client"

import { useState } from "react"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/dashboard/stats-card"
import { 
  Clock, 
  Search, 
  Filter, 
  Calendar,
  Brain,
  TrendingUp,
  BookOpen,
  Target,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock as HistoryIcon
} from "lucide-react"

interface Memory {
  id: string
  title: string
  content: string
  category: string
  retentionScore: number
  lastReviewed: Date
  nextReview: Date
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  starred: boolean
}

const mockMemories: Memory[] = [
  {
    id: "1",
    title: "Neural Network Architecture",
    content: "Neural networks consist of layers of interconnected nodes that process information...",
    category: "Machine Learning",
    retentionScore: 85,
    lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 24),
    nextReview: new Date(Date.now() + 1000 * 60 * 60 * 48),
    difficulty: "medium",
    tags: ["AI", "ML", "Neural Networks"],
    starred: true
  },
  {
    id: "2",
    title: "Python List Comprehensions",
    content: "List comprehensions provide a concise way to create lists based on existing lists...",
    category: "Programming",
    retentionScore: 92,
    lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 12),
    nextReview: new Date(Date.now() + 1000 * 60 * 60 * 72),
    difficulty: "easy",
    tags: ["Python", "Programming"],
    starred: false
  },
  {
    id: "3",
    title: "Backpropagation Algorithm",
    content: "Backpropagation is a method used to train neural networks by calculating gradients...",
    category: "Machine Learning",
    retentionScore: 67,
    lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 48),
    nextReview: new Date(Date.now() + 1000 * 60 * 60 * 6),
    difficulty: "hard",
    tags: ["AI", "ML", "Algorithms"],
    starred: true
  },
  {
    id: "4",
    title: "React Hooks Usage",
    content: "React Hooks allow you to use state and other React features in functional components...",
    category: "Web Development",
    retentionScore: 78,
    lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 36),
    nextReview: new Date(Date.now() + 1000 * 60 * 60 * 24),
    difficulty: "medium",
    tags: ["React", "JavaScript", "Frontend"],
    starred: false
  }
]

export default function MemoriesPage() {
  const [memories, setMemories] = useState(mockMemories)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")

  const getRetentionColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || memory.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const dueForReview = memories.filter(memory => 
    memory.nextReview <= new Date()
  ).length

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Memories</h1>
            <p className="text-muted-foreground">
              Review and reinforce your knowledge with spaced repetition
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Memory
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Memories"
            value={memories.length}
            icon={Brain}
          />
          <StatsCard
            title="Due for Review"
            value={dueForReview}
            change={{ value: "3 urgent", trend: "up" }}
            icon={Clock}
          />
          <StatsCard
            title="Avg Retention"
            value="81%"
            change={{ value: "+5%", trend: "up" }}
            icon={TrendingUp}
          />
          <StatsCard
            title="Mastered"
            value="12"
            icon={Target}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="all">All Categories</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Programming">Programming</option>
            <option value="Web Development">Web Development</option>
          </select>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <HistoryIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Review All Due
          </Button>
        </div>

        {viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMemories.map((memory) => (
              <Card key={memory.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{memory.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMemories(prev => prev.map(m => 
                          m.id === memory.id ? {...m, starred: !m.starred} : m
                        ))
                      }}
                    >
                      <Star className={`h-4 w-4 ${memory.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{memory.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(memory.difficulty)}`}>
                      {memory.difficulty}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {memory.content}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Retention Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r from-primary to-primary/60 rounded-full`}
                            style={{ width: `${memory.retentionScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${getRetentionColor(memory.retentionScore).split(' ')[0]}`}>
                          {memory.retentionScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Next review: {memory.nextReview.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {memory.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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
        ) : (
          <div className="space-y-2">
            {filteredMemories.map((memory) => (
              <Card key={memory.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{memory.title}</h3>
                          <span className="text-xs text-muted-foreground">{memory.category}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(memory.difficulty)}`}>
                            {memory.difficulty}
                          </span>
                          {memory.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {memory.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Retention: {memory.retentionScore}%</span>
                          <span>Next review: {memory.nextReview.toLocaleDateString()}</span>
                          <div className="flex gap-1">
                            {memory.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-secondary rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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
  )
}
