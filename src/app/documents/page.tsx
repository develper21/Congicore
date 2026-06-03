"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import {
  FileText,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Download,
  Trash2,
  Upload,
  Loader2,
} from "lucide-react";

interface Document {
  _id: string;
  title: string;
  type: string;
  size: number;
  status: string;
  tags: string[];
  fileUrl: string;
  thumbnail: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDocuments();
      setDocuments(response.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDocument(id);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <Button onClick={() => router.push('/upload')}>
              <Upload className="mr-2 h-4 w-4" />
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchDocuments}>Retry</Button>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents found"
              description={searchQuery ? "Try a different search term" : "Upload your first document to get started"}
              action={{
                label: "Upload Document",
                onClick: () => router.push('/upload'),
              }}
            />
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc._id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="p-4">
                    <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-3">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-sm line-clamp-2">
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{doc.type}</span>
                      <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(doc._id)}>
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
              {filteredDocuments.map((doc) => (
                <Card key={doc._id}>
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
                            <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary"
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
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(doc._id)}>
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
  );
}
