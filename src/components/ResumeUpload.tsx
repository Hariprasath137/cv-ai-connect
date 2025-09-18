import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, File, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  onBack: () => void;
}

const ResumeUpload = ({ onBack }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PDF, DOC, or DOCX file.";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB.";
    }

    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    
    if (error) {
      setUploadStatus('error');
      toast({
        title: "Upload Failed",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadStatus('success');
    toast({
      title: "Upload Successful",
      description: `${file.name} has been uploaded successfully.`,
    });
  }, [toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const getStatusIcon = () => {
    if (uploadStatus === 'success') {
      return <CheckCircle className="w-12 h-12 text-recruitment-success" />;
    }
    if (uploadStatus === 'error') {
      return <AlertCircle className="w-12 h-12 text-destructive" />;
    }
    return <Upload className="w-12 h-12 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (uploadStatus === 'success') {
      return {
        title: "Resume Uploaded Successfully!",
        description: `${uploadedFile?.name} is ready for review. Our AI will analyze your qualifications and get back to you soon.`
      };
    }
    if (uploadStatus === 'error') {
      return {
        title: "Upload Failed",
        description: "Please try again with a valid PDF, DOC, or DOCX file."
      };
    }
    return {
      title: "Upload Your Resume",
      description: "Drag and drop your resume here, or click to browse. Supported formats: PDF, DOC, DOCX (max 10MB)"
    };
  };

  const statusText = getStatusText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Resume Upload</h1>
        </div>

        {/* Upload Area */}
        <Card className="recruitment-card">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : uploadStatus === 'success' 
                  ? 'border-recruitment-success bg-recruitment-success/5'
                  : uploadStatus === 'error'
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              <div className="flex justify-center">
                {getStatusIcon()}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{statusText.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {statusText.description}
                </p>
              </div>

              {uploadStatus !== 'success' && (
                <div className="space-y-4">
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                  />
                  <Button 
                    variant="recruitment" 
                    size="lg"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    <File className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}

              {uploadStatus === 'success' && uploadedFile && (
                <div className="space-y-4">
                  <div className="bg-accent/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-center space-x-3">
                      <File className="w-5 h-5 text-primary" />
                      <span className="font-medium">{uploadedFile.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({(uploadedFile.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="recruitment" 
                      size="lg"
                      className="flex-1"
                    >
                      Continue Application
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => {
                        setUploadStatus('idle');
                        setUploadedFile(null);
                      }}
                    >
                      Upload New File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Guidelines */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Supported Formats</div>
              <div className="text-muted-foreground text-sm">PDF, DOC, DOCX</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">File Size Limit</div>
              <div className="text-muted-foreground text-sm">Maximum 10MB</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Processing Time</div>
              <div className="text-muted-foreground text-sm">Usually under 1 minute</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;