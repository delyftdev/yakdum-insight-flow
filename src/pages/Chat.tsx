
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Send } from 'lucide-react';
import Logo from '@/components/Logo';
import CollapsiblePanel from '@/components/navigation/CollapsiblePanel';
import ClientSelector from '@/components/chat/ClientSelector';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  company_name: string;
  user_type: string;
  email: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  business_type: string;
}

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUserProfile();
  }, [user, navigate]);

  useEffect(() => {
    // Update welcome message when client selection changes
    if (userProfile) {
      const welcomeMessage = getWelcomeMessage();
      setMessages([{
        id: '1',
        content: welcomeMessage,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [selectedClient, userProfile]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setUserProfile(data);
    }
  };

  const getWelcomeMessage = () => {
    if (!userProfile) return "Welcome to Delyft.ai!";

    if (userProfile.user_type === 'accounting_firm') {
      if (selectedClient) {
        return `Welcome to Delyft.ai! I'm ready to help you analyze ${selectedClient.name}'s financial data. What would you like to know about their finances?`;
      } else {
        return `Welcome to Delyft.ai! I'm your AI accounting assistant for your firm. Select a client above to analyze their financial data, or I can help with general accounting questions. What would you like to know?`;
      }
    } else {
      return `Welcome to Delyft.ai! I'm your AI accounting assistant. I can help you analyze your financial data, answer questions about your business finances, and provide insights. What would you like to know?`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response with context awareness
    setTimeout(() => {
      let aiResponse = `I understand you're asking about "${inputMessage}". `;
      
      if (userProfile?.user_type === 'accounting_firm' && selectedClient) {
        aiResponse += `For ${selectedClient.name}, I'd be happy to help you analyze this. However, I notice you may need to ensure their accounting software is properly connected to provide accurate insights. Once connected, I can give you real-time analysis of their financial data.`;
      } else if (userProfile?.user_type === 'accounting_firm' && !selectedClient) {
        aiResponse += `As a firm admin, you can select a specific client above to get targeted insights, or I can help with general accounting practices and firm management questions.`;
      } else {
        aiResponse += `As your AI accounting assistant, I'd be happy to help you analyze this. However, I notice you may need to connect your accounting software first to provide accurate insights. Once connected, I can give you real-time analysis of your financial data.`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-delyft-gray-50 via-white to-delyft-primary-light/20">
      <CollapsiblePanel userProfile={userProfile} />
      
      {/* Header */}
      <header className="border-b border-delyft-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            {/* Client Selector for Firms */}
            {userProfile?.user_type === 'accounting_firm' && (
              <ClientSelector 
                onClientSelect={setSelectedClient}
                selectedClient={selectedClient}
              />
            )}
            
            <div className="w-[200px]"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card h-[70vh] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-delyft-primary to-delyft-secondary flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                Delyft.ai Assistant
                {selectedClient && (
                  <span className="ml-3 text-sm font-normal text-delyft-gray-600">
                    • {selectedClient.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-delyft-primary text-white'
                            : 'bg-delyft-gray-100 text-delyft-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-delyft-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-delyft-gray-100 text-delyft-gray-900 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-delyft-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-delyft-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-delyft-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex space-x-2 mt-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    selectedClient 
                      ? `Ask me anything about ${selectedClient.name}'s finances...`
                      : "Ask me anything about your finances..."
                  }
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
