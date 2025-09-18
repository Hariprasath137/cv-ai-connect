import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, MessageCircle, Briefcase } from "lucide-react";
import ResumeUpload from "./ResumeUpload";
import ChatInterface from "./ChatInterface";

const LandingPage = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'resume' | 'chat'>('landing');

  if (currentView === 'resume') {
    return <ResumeUpload onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'chat') {
    return <ChatInterface onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-hero rounded-2xl shadow-button">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Recruitment Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get started with our AI-powered recruitment process. Choose how you'd like to begin your application.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Resume Upload Card */}
          <Card className="recruitment-card group cursor-pointer" onClick={() => setCurrentView('resume')}>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-accent rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Continue With Resume</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload your resume (PDF, DOC, or DOCX) and let our AI analyze your qualifications instantly.
                </p>
              </div>
              <Button variant="recruitment" size="lg" className="w-full">
                Upload Resume
              </Button>
            </div>
          </Card>

          {/* Chatbot Card */}
          <Card className="recruitment-card group cursor-pointer" onClick={() => setCurrentView('chat')}>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-accent rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <MessageCircle className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Continue With Chatbot</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Have a conversation with our AI assistant to guide you through the application process step by step.
                </p>
              </div>
              <Button variant="recruitment" size="lg" className="w-full">
                Start Chat
              </Button>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">AI-Powered</div>
              <div className="text-muted-foreground">Smart analysis and personalized guidance</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Secure & Private</div>
              <div className="text-muted-foreground">Your data is protected and confidential</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Quick & Easy</div>
              <div className="text-muted-foreground">Complete the process in just a few minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;