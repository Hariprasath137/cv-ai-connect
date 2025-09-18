import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  profileType?: 'Student' | 'Fresher' | 'Working';
  language?: 'English' | 'Tamil' | 'Hindi' | 'French';
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const QUESTIONS = [
  { key: 'name', question: 'Please tell me your *Name*.' },
  { key: 'email', question: 'Please provide your *Email address*.' },
  { key: 'phone', question: 'Please provide your *Phone Number*.' },
  { key: 'gender', question: 'What is your *Gender*?' },
  { key: 'profileType', question: 'Please select your *Profile Type*.', options: ['Student', 'Fresher', 'Working'] },
  { key: 'language', question: 'Finally, please select a *Language* to continue the conversation.', options: ['English', 'Tamil', 'Hindi', 'French'] }
];

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize conversation
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: "Hello! I'm your recruitment assistant. I'll ask you a few questions to get to know you better. Let's start!",
      role: 'assistant',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages([welcomeMessage]);
      setTimeout(() => askNextQuestion(), 1000);
    }, 500);
  }, []);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const askNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length) {
      const currentQuestion = QUESTIONS[currentQuestionIndex];
      setTimeout(() => {
        addMessage(currentQuestion.question, 'assistant');
      }, 500);
    } else {
      // All questions completed
      showConfirmation();
    }
  };

  const showConfirmation = () => {
    const confirmationMessage = `Thank you for providing all the information! Here's what I have collected:

📝 **Name:** ${userData.name}
📧 **Email:** ${userData.email}  
📞 **Phone:** ${userData.phone}
👤 **Gender:** ${userData.gender}
🎯 **Profile Type:** ${userData.profileType}
🌐 **Language:** ${userData.language}

Is this information correct? Our recruitment team will review your details and get back to you soon!`;

    setTimeout(() => {
      addMessage(confirmationMessage, 'assistant');
      setIsComplete(true);
    }, 500);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInput.trim()) return;

    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const userInput = currentInput.trim();

    // Add user message
    addMessage(userInput, 'user');

    // Validate input based on question type
    let isValid = true;
    let errorMessage = "";

    if (currentQuestion.key === 'email' && !validateEmail(userInput)) {
      isValid = false;
      errorMessage = "Please provide a valid email address (e.g., john@example.com).";
    } else if (currentQuestion.key === 'phone' && !validatePhone(userInput)) {
      isValid = false;
      errorMessage = "Please provide a valid phone number with at least 10 digits.";
    }

    if (!isValid) {
      setTimeout(() => {
        addMessage(errorMessage, 'assistant');
      }, 500);
      setCurrentInput("");
      return;
    }

    // Store the answer
    setUserData(prev => ({
      ...prev,
      [currentQuestion.key]: userInput
    }));

    // Move to next question
    setCurrentInput("");
    setCurrentQuestionIndex(prev => prev + 1);
    
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  };

  const handleOptionSelect = (option: string) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    
    // Add user message
    addMessage(option, 'user');
    
    // Store the answer
    setUserData(prev => ({
      ...prev,
      [currentQuestion.key]: option
    }));

    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
    
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const showOptions = currentQuestion?.options && !isComplete;
  const showInput = !showOptions && !isComplete;

  return (
    <div className="min-h-screen bg-gradient-chat flex flex-col">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Recruitment Assistant</h1>
              <p className="text-sm text-muted-foreground">AI-powered interview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs sm:max-w-sm md:max-w-md`}>
                {message.role === 'assistant' && (
                  <div className="p-2 bg-primary rounded-lg flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`chat-message ${
                    message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div className={`text-xs mt-1 opacity-70`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="p-2 bg-accent rounded-lg flex-shrink-0">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isComplete && (
        <div className="bg-card/80 backdrop-blur-sm border-t border-border/50 p-4">
          <div className="max-w-3xl mx-auto">
            {showOptions && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">Select one of the options below:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {currentQuestion.options?.map((option) => (
                    <Button
                      key={option}
                      variant="option"
                      size="default"
                      onClick={() => handleOptionSelect(option)}
                      className="w-full"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {showInput && (
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 rounded-xl"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="recruitment"
                  size="icon"
                  disabled={!currentInput.trim()}
                  className="rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {isComplete && (
        <div className="bg-card/80 backdrop-blur-sm border-t border-border/50 p-4">
          <div className="max-w-3xl mx-auto text-center">
            <Button variant="recruitment" size="lg" onClick={onBack}>
              Complete Application
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;