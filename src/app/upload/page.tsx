"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  Upload,
  FileText,
  FileAudio,
  FileVideo,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  Mic,
  Video,
  Camera,
  Link,
} from "lucide-react";

interface UploadedFile {
  _id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  extractedContent?: string;
  error?: string;
}

const fileTypes = [
  {
    type: "document",
    icon: FileText,
    extensions: ["PDF", "DOC", "DOCX", "TXT", "MD"],
    color: "text-blue-500",
  },
  {
    type: "audio",
    icon: FileAudio,
    extensions: ["MP3", "WAV", "M4A", "AAC"],
    color: "text-green-500",
  },
  {
    type: "video",
    icon: FileVideo,
    extensions: ["MP4", "AVI", "MOV", "MKV"],
    color: "text-purple-500",
  },
  {
    type: "image",
    icon: Image,
    extensions: ["JPG", "PNG", "GIF", "SVG"],
    color: "text-orange-500",
  },
];

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileType = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["pdf", "doc", "docx", "txt", "md"].includes(ext || ""))
    return "document";
  if (["mp3", "wav", "m4a", "aac"].includes(ext || "")) return "audio";
  if (["mp4", "avi", "mov", "mkv"].includes(ext || "")) return "video";
  if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext || ""))
    return "image";
  return "unknown";
};

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      _id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name),
      status: "uploading" as const,
      progress: 0,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Upload files using API
    for (const uploadedFile of newFiles) {
      try {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f._id === uploadedFile._id
              ? { ...f, status: "uploading", progress: 25 }
              : f,
          ),
        );

        const response = await api.uploadFile(uploadedFile.file, uploadedFile.name);

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f._id === uploadedFile._id
              ? { ...f, status: "processing", progress: 50 }
              : f,
          ),
        );

        // Simulate processing
        setTimeout(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f._id === uploadedFile._id
                ? {
                    ...f,
                    status: "completed",
                    progress: 100,
                    extractedContent:
                      "AI has extracted key concepts and insights from this document...",
                  }
                : f,
          ),
        );
        }, 2000);
      } catch (err) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f._id === uploadedFile._id
              ? {
                  ...f,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
                : f,
          ),
        );
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "audio/*": [".mp3", ".wav", ".m4a", ".aac"],
      "video/*": [".mp4", ".avi", ".mov", ".mkv"],
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".svg"],
    },
  });

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f._id !== id));
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      // Start recording logic here
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) {
            clearInterval(interval);
            setIsRecording(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setRecordingTime(0);
      // Stop recording logic here
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "processing":
        return <Brain className="h-4 w-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Content</h1>
          <p className="text-muted-foreground">
            Add documents, recordings, and other content to your knowledge base
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Drag & Drop Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {isDragActive ? (
                    <p className="text-lg font-medium">
                      Drop the files here...
                    </p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-2">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDFs, documents, audio, video, and images
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={toggleRecording}
                  >
                    <Mic
                      className={`h-6 w-6 ${isRecording ? "text-red-500" : ""}`}
                    />
                    <span className="text-sm">
                      {isRecording
                        ? `Recording ${recordingTime}s`
                        : "Voice Recording"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Video className="h-6 w-6" />
                    <span className="text-sm">Video Recording</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">Scan Document</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Link className="h-6 w-6" />
                    <span className="text-sm">Import from URL</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedFiles.map((uploadedFile) => (
                      <div
                        key={uploadedFile._id}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {getStatusIcon(uploadedFile.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {uploadedFile.name}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{uploadedFile.size}</span>
                            <span>{uploadedFile.type}</span>
                            <span>{uploadedFile.status}</span>
                          </div>
                          {uploadedFile.status === "uploading" && (
                            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${uploadedFile.progress}%` }}
                              />
                            </div>
                          )}
                          {uploadedFile.extractedContent && (
                            <p className="mt-2 text-xs text-muted-foreground italic">
                              {uploadedFile.extractedContent}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadedFile._id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fileTypes.map((fileType) => (
                    <div
                      key={fileType.type}
                      className="flex items-center space-x-3"
                    >
                      <fileType.icon className={`h-5 w-5 ${fileType.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium capitalize">
                          {fileType.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fileType.extensions.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Text Extraction</p>
                      <p className="text-xs text-muted-foreground">
                        OCR and text recognition from all formats
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Concept Analysis</p>
                      <p className="text-xs text-muted-foreground">
                        Automatic concept identification and linking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Speech Recognition</p>
                      <p className="text-xs text-muted-foreground">
                        Transcribe audio and video content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Smart Tagging</p>
                      <p className="text-xs text-muted-foreground">
                        Automatic categorization and tagging
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Storage Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">2.4 GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium">7.6 GB</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Upgrade Storage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
