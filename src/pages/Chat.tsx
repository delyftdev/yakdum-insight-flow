
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Send, BarChart3, Share } from 'lucide-react';
import Logo from '@/components/Logo';
import CollapsiblePanel from '@/components/navigation/CollapsiblePanel';
import ClientSelector from '@/components/chat/ClientSelector';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  chart?: any;
  table?: any;
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

// Mock financial data
const mockRevenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 33000 },
  { month: 'Apr', revenue: 61000, expenses: 38000 },
  { month: 'May', revenue: 55000, expenses: 36000 },
  { month: 'Jun', revenue: 67000, expenses: 41000 },
];

const mockExpenseCategories = [
  { category: 'Office Supplies', amount: 2500, percentage: 15 },
  { category: 'Marketing', amount: 4200, percentage: 25 },
  { category: 'Utilities', amount: 1800, percentage: 11 },
  { category: 'Software', amount: 3200, percentage: 19 },
  { category: 'Travel', amount: 2800, percentage: 17 },
  { category: 'Other', amount: 2200, percentage: 13 },
];

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
    if (!userProfile) return "Welcome to Yakdum!";

    if (userProfile.user_type === 'accounting_firm') {
      if (selectedClient) {
        return `Welcome to Yakdum! I'm ready to help you analyze ${selectedClient.name}'s financial data. What would you like to know about their finances?`;
      } else {
        return `Welcome to Yakdum! I'm your AI accounting assistant for your firm. Select a client above to analyze their financial data, or I can help with general accounting questions. What would you like to know?`;
      }
    } else {
      return `Welcome to Yakdum! I'm your AI accounting assistant. I can help you analyze your financial data, answer questions about your business finances, and provide insights. What would you like to know?`;
    }
  };

  const generateMockResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('revenue') || lowerQuestion.includes('income') || lowerQuestion.includes('sales')) {
      return {
        content: "Here's your revenue analysis for the past 6 months. I can see your revenue has been growing steadily with some seasonal variations. Your best month was June with $67,000 in revenue.",
        chart: (
          <div className="w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      };
    }
    
    if (lowerQuestion.includes('expense') || lowerQuestion.includes('cost') || lowerQuestion.includes('spending')) {
      return {
        content: "Here's your expense breakdown by category. Marketing represents your largest expense category at 25% of total spending.",
        table: (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {mockExpenseCategories.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">${item.amount.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      };
    }
    
    if (lowerQuestion.includes('profit') || lowerQuestion.includes('margin')) {
      return {
        content: "Your profit margins have been healthy, averaging around 35% over the past 6 months. June was your most profitable month with a $26,000 profit margin.",
        chart: (
          <div className="w-full h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      };
    }
    
    // Default response
    return {
      content: `I understand you're asking about "${question}". ${
        userProfile?.user_type === 'accounting_firm' && selectedClient
          ? `For ${selectedClient.name}, I'd be happy to help you analyze this. I can provide insights on revenue, expenses, profit margins, cash flow, and more. Try asking about specific financial metrics!`
          : userProfile?.user_type === 'accounting_firm' && !selectedClient
          ? `As a firm admin, you can select a specific client above to get targeted insights, or I can help with general accounting practices and firm management questions.`
          : `I'd be happy to help you analyze this. I can provide insights on revenue, expenses, profit margins, cash flow, and more. Try asking about specific financial metrics!`
      }`
    };
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

    // Generate mock AI response
    setTimeout(() => {
      const mockResponse = generateMockResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mockResponse.content,
        sender: 'ai',
        timestamp: new Date(),
        chart: mockResponse.chart,
        table: mockResponse.table
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleShareMessage = (messageId: string) => {
    // Mock share functionality
    navigator.clipboard.writeText(`Shared financial insight from Yakdum: Message ID ${messageId}`);
    alert('Message shared with team!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <CollapsiblePanel userProfile={userProfile} />
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
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
          <Card className="h-[70vh] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-black to-gray-700 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                Yakdum Assistant
                {selectedClient && (
                  <span className="ml-3 text-sm font-normal text-gray-600">
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
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.chart && message.chart}
                        {message.table && message.table}
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                          {message.sender === 'ai' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareMessage(message.id)}
                              className="ml-2 h-6 w-6 p-0"
                            >
                              <Share className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
