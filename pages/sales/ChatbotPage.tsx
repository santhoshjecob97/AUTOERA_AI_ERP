import React, { useState } from 'react';
import { Bot, MessageSquare, User, Clock, TrendingUp, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'agent';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  customerName: string;
  startTime: string;
  status: 'active' | 'completed' | 'escalated';
  leadScore: number;
  intent: string;
  intentConfidence: number;
  messages: ChatMessage[];
  phone?: string;
  email?: string;
}

const mockConversations: Conversation[] = [
  {
    id: 'C001',
    customerName: 'Vikram Malhotra',
    startTime: '10 mins ago',
    status: 'active',
    leadScore: 94,
    intent: 'Purchase Intent - High',
    intentConfidence: 92,
    phone: '+91-9876543220',
    email: 'vikram@example.com',
    messages: [
      { id: 'M1', sender: 'customer', content: 'Hi, I\'m looking for a luxury SUV under ₹1 crore', timestamp: '10:30 AM' },
      { id: 'M2', sender: 'ai', content: 'Great! I can help you find the perfect SUV. Based on your budget, I recommend the BMW X5 (₹92L) or Audi Q7 (₹88L). What features are most important to you?', timestamp: '10:30 AM' },
      { id: 'M3', sender: 'customer', content: 'I need good fuel efficiency and latest tech features', timestamp: '10:32 AM' },
      { id: 'M4', sender: 'ai', content: 'Perfect! The BMW X5 Hybrid offers 30 km/l in city with cutting-edge technology. Would you like to schedule a test drive?', timestamp: '10:32 AM' },
    ]
  },
  {
    id: 'C002',
    customerName: 'Anjali Desai',
    startTime: '25 mins ago',
    status: 'completed',
    leadScore: 78,
    intent: 'Information Gathering',
    intentConfidence: 85,
    phone: '+91-9876543221',
    email: 'anjali@example.com',
    messages: [
      { id: 'M5', sender: 'customer', content: 'What are the financing options available?', timestamp: '10:15 AM' },
      { id: 'M6', sender: 'ai', content: 'We offer flexible financing with rates starting at 7.5% APR. Would you like me to connect you with our finance team?', timestamp: '10:15 AM' },
      { id: 'M7', sender: 'customer', content: 'Yes, please send me the details', timestamp: '10:17 AM' },
      { id: 'M8', sender: 'ai', content: 'I\'ve sent the financing brochure to your email. Our finance specialist will call you within 24 hours.', timestamp: '10:17 AM' },
    ]
  },
  {
    id: 'C003',
    customerName: 'Rahul Verma',
    startTime: '1 hour ago',
    status: 'escalated',
    leadScore: 88,
    intent: 'Technical Query - Complex',
    intentConfidence: 78,
    phone: '+91-9876543222',
    email: 'rahul@example.com',
    messages: [
      { id: 'M9', sender: 'customer', content: 'I need detailed specs comparison between X7 and GLE', timestamp: '9:40 AM' },
      { id: 'M10', sender: 'ai', content: 'I can provide a basic comparison. For detailed technical specifications, let me connect you with our product specialist.', timestamp: '9:40 AM' },
      { id: 'M11', sender: 'customer', content: 'Yes, I need expert advice', timestamp: '9:42 AM' },
      { id: 'M12', sender: 'agent', content: 'Hi Rahul, I\'m Amit from the sales team. I\'d be happy to provide a detailed comparison. When would be a good time to discuss?', timestamp: '9:45 AM' },
    ]
  },
];

const ChatbotPage: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(mockConversations[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'escalated': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-blue-600';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bot className="text-indigo-600" /> Chatbot Management
        </h1>
        <p className="text-slate-500">AI conversation monitoring and lead qualification.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare size={24} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="text-3xl font-bold">3</div>
          <div className="text-green-100 text-sm">Active Conversations</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} />
          </div>
          <div className="text-3xl font-bold">78%</div>
          <div className="text-blue-100 text-sm">Resolution Rate</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-bold">84%</div>
          <div className="text-purple-100 text-sm">Lead Qualification Accuracy</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} />
          </div>
          <div className="text-3xl font-bold">2.3m</div>
          <div className="text-orange-100 text-sm">Avg Response Time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-900 mb-4">Active Conversations</h3>
            <div className="space-y-3">
              {mockConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedConv?.id === conv.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-slate-900">{conv.customerName}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(conv.status)}`}>
                      {conv.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{conv.startTime}</span>
                    <span className={`font-bold ${getScoreColor(conv.leadScore)}`}>
                      Score: {conv.leadScore}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 truncate">
                    {conv.messages[conv.messages.length - 1].content}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedConv ? (
            <>
              {/* Customer Info & AI Insights */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4">Customer Profile</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        <span className="text-slate-900">{selectedConv.customerName}</span>
                      </div>
                      {selectedConv.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-slate-400" />
                          <span className="text-slate-600 text-sm">{selectedConv.phone}</span>
                        </div>
                      )}
                      {selectedConv.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" />
                          <span className="text-slate-600 text-sm">{selectedConv.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-slate-600 text-sm">{selectedConv.startTime}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 mb-4">AI Insights</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Lead Score</div>
                        <div className="flex items-center gap-2">
                          <div className={`text-2xl font-bold ${getScoreColor(selectedConv.leadScore)}`}>
                            {selectedConv.leadScore}
                          </div>
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedConv.leadScore >= 85 ? 'bg-red-500' :
                                selectedConv.leadScore >= 60 ? 'bg-orange-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${selectedConv.leadScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Detected Intent</div>
                        <div className="font-medium text-slate-900">{selectedConv.intent}</div>
                        <div className="text-xs text-slate-600">Confidence: {selectedConv.intentConfidence}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Take Over Chat
                  </button>
                  <button className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors">
                    Assign to Sales Rep
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Conversation History</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedConv.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${
                        msg.sender === 'customer'
                          ? 'bg-indigo-600 text-white'
                          : msg.sender === 'ai'
                          ? 'bg-slate-100 text-slate-900'
                          : 'bg-green-100 text-green-900'
                      } rounded-lg p-3`}>
                        <div className="flex items-center gap-2 mb-1">
                          {msg.sender === 'ai' && <Bot size={14} />}
                          {msg.sender === 'agent' && <User size={14} />}
                          <span className="text-xs font-medium opacity-75">
                            {msg.sender === 'customer' ? 'Customer' : msg.sender === 'ai' ? 'AI Assistant' : 'Sales Agent'}
                          </span>
                          <span className="text-xs opacity-60">{msg.timestamp}</span>
                        </div>
                        <div className="text-sm">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedConv.status === 'active' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-sm text-blue-900">
                    <Bot size={16} className="text-blue-600" />
                    <span>AI is typing...</span>
                  </div>
                )}
              </div>

              {/* Recommended Actions */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <h3 className="font-bold text-slate-900 mb-4">Recommended Next Actions</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                    <CheckCircle className="text-green-600 mt-0.5" size={18} />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">Schedule Test Drive</div>
                      <div className="text-sm text-slate-600">Customer shows high purchase intent - recommend scheduling within 24 hours</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                    <CheckCircle className="text-green-600 mt-0.5" size={18} />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">Send Financing Options</div>
                      <div className="text-sm text-slate-600">Customer mentioned budget concerns - share flexible payment plans</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <Bot size={64} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Select a conversation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
