import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mic, MessageSquare, Mail, Zap, Settings, Play, Pause, MoreVertical, User, Calendar, Plus, Bot, Volume2, CheckCircle, TrendingUp, Clock, Activity, Send, RefreshCw, Users } from 'lucide-react';
import { VoiceCall, EmailTemplate, AutomationRule, VoiceAgentState, VoiceLog } from '../types';
import StatCard from './StatCard';
import VoiceCampaignManager from './voice/VoiceCampaignManager';

const mockTemplates: EmailTemplate[] = [
    { id: '1', name: 'Appointment Confirmation', subject: 'Your Upcoming Service Appointment', lastUsed: '2 hours ago' },
    { id: '2', name: 'Service Reminder - 7 Days', subject: 'Upcoming Maintenance Due', lastUsed: '1 day ago' },
    { id: '3', name: 'Post-Service Feedback', subject: 'How was your service experience?', lastUsed: '30 mins ago' },
];

const mockRules: AutomationRule[] = [
    { id: '1', name: 'Welcome New Leads', trigger: 'New Lead Added', action: 'Send Email: Welcome', status: 'Active' },
    { id: '2', name: 'Service Reminder', trigger: '3 days before appt', action: 'Send WhatsApp: Reminder', status: 'Active' },
    { id: '3', name: 'Invoice Paid Confirmation', trigger: 'Invoice Paid', action: 'Send Email: Receipt', status: 'Active' },
];

const ServiceCommunication: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'voice' | 'campaigns' | 'email' | 'automation'>('voice');
    
    // Voice Agent State
    const [agentState, setAgentState] = useState<VoiceAgentState>('IDLE');
    const [conversation, setConversation] = useState<VoiceLog[]>([]);
    const [customerInput, setCustomerInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [detectedContext, setDetectedContext] = useState({
        vehicle: 'Unknown',
        issue: 'Unknown',
        sentiment: 'Neutral',
        appointment: 'Pending'
    });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    // Agent Logic
    const startCall = () => {
        setAgentState('GREETING');
        setConversation([]);
        setDetectedContext({ vehicle: 'Unknown', issue: 'Unknown', sentiment: 'Neutral', appointment: 'Pending' });
        
        setTimeout(() => {
            const msg = "Hi, I'm AUTOERA's virtual assistant Priya. How can I help you today?";
            addLog('agent', msg, 'GREETING');
        }, 500);
    };

    const addLog = (role: 'agent' | 'customer', message: string, state?: VoiceAgentState) => {
        setConversation(prev => [...prev, { role, message, timestamp: new Date(), state }]);
    };

    const handleCustomerReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerInput.trim()) return;

        const input = customerInput;
        addLog('customer', input);
        setCustomerInput('');
        setIsThinking(true);

        // Process State Machine
        setTimeout(() => {
            processAgentResponse(input);
            setIsThinking(false);
        }, 1200);
    };

    const processAgentResponse = (input: string) => {
        const lowerInput = input.toLowerCase();
        let nextState = agentState;
        let response = "";

        switch (agentState) {
            case 'GREETING':
                nextState = 'PROBLEM_IDENTIFICATION';
                response = "I'm sorry to hear that. Let me help you get that checked out. Could you provide the make and model of your vehicle and the specific issue?";
                if (lowerInput.includes('service') || lowerInput.includes('appointment')) {
                    setDetectedContext(prev => ({ ...prev, issue: 'General Service' }));
                } else if (lowerInput.includes('problem') || lowerInput.includes('issue') || lowerInput.includes('noise')) {
                    setDetectedContext(prev => ({ ...prev, issue: 'Mechanical Issue', sentiment: 'Concerned' }));
                }
                break;

            case 'PROBLEM_IDENTIFICATION':
                nextState = 'INFORMATION_GATHERING';
                // Simple entity extraction simulation
                if (lowerInput.includes('honda')) setDetectedContext(prev => ({...prev, vehicle: 'Honda'}));
                if (lowerInput.includes('toyota')) setDetectedContext(prev => ({...prev, vehicle: 'Toyota'}));
                
                response = `Thank you. I see you have a ${detectedContext.vehicle !== 'Unknown' ? detectedContext.vehicle : 'vehicle'} with a potential issue. Would you like me to schedule a service appointment with our certified technicians?`;
                break;

            case 'INFORMATION_GATHERING':
                if (lowerInput.includes('yes') || lowerInput.includes('sure')) {
                    nextState = 'APPOINTMENT_SCHEDULING';
                    response = "Great. We have openings tomorrow at 10 AM or 2 PM. Which works better for you?";
                } else {
                    response = "I understand. Is there anything else I can assist you with?";
                    nextState = 'CONFIRMATION';
                }
                break;

            case 'APPOINTMENT_SCHEDULING':
                nextState = 'CONTACT_COLLECTION';
                setDetectedContext(prev => ({ ...prev, appointment: 'Scheduled' }));
                response = "Perfect. Let me lock that in. Could you provide your phone number for the confirmation message?";
                break;

            case 'CONTACT_COLLECTION':
                nextState = 'UPSELLING';
                response = "Thanks. We also offer a transmission fluid service that improves performance for your model. It's currently 20% off. Would you like to add that?";
                break;

            case 'UPSELLING':
                nextState = 'CONFIRMATION';
                if (lowerInput.includes('yes')) {
                    response = "Excellent choice. I've added that to your job card. You'll receive a confirmation shortly. Is there anything else?";
                } else {
                    response = "No problem. You're all set with the standard service. You'll receive a confirmation shortly. Is there anything else?";
                }
                break;

            case 'CONFIRMATION':
                nextState = 'IDLE';
                response = "Thank you for choosing AUTOERA. Have a wonderful day!";
                break;

            default:
                response = "I didn't quite catch that. Could you repeat?";
                break;
        }

        setAgentState(nextState);
        addLog('agent', response, nextState);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="flex border-b border-slate-100 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('voice')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'voice' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Phone size={18} /> Voice Agent
                </button>
                <button 
                    onClick={() => setActiveTab('campaigns')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'campaigns' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Users size={18} /> Bulk Campaigns
                </button>
                <button 
                    onClick={() => setActiveTab('email')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'email' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Mail size={18} /> Email Templates
                </button>
                <button 
                    onClick={() => setActiveTab('automation')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'automation' ? 'border-orange-600 text-orange-600 bg-orange-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <Zap size={18} /> Automation
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                {activeTab === 'voice' && (
                    <div className="space-y-6">
                        {/* Metrics Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatCard title="Total Calls Today" value="247" trend="High Vol" icon={<Phone size={20}/>} color="blue" />
                            <StatCard title="Appointments Set" value="89" trend="+26%" trendUp={true} icon={<Calendar size={20}/>} color="green" />
                            <StatCard title="Conversion Rate" value="37%" trend="+11%" trendUp={true} icon={<TrendingUp size={20}/>} color="purple" />
                            <StatCard title="Avg Duration" value="2:46" icon={<Clock size={20}/>} color="orange" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                            {/* Live Call Console */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
                                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center relative">
                                            <Bot size={20} />
                                            {agentState !== 'IDLE' && (
                                                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Agent Priya (AI)</h3>
                                            <p className="text-xs text-slate-400">
                                                {agentState === 'IDLE' ? 'Ready to call' : 'In Call • Live Processing'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {agentState !== 'IDLE' && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-4 bg-green-500 animate-[pulse_1s_ease-in-out_infinite]"></div>
                                                <div className="w-1 h-6 bg-green-500 animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                                                <div className="w-1 h-3 bg-green-500 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                                            </div>
                                        )}
                                        <button 
                                            onClick={agentState === 'IDLE' ? startCall : () => setAgentState('IDLE')}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                                agentState === 'IDLE' 
                                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                                : 'bg-red-600 hover:bg-red-700 text-white'
                                            }`}
                                        >
                                            {agentState === 'IDLE' ? 'Start Call' : 'End Call'}
                                        </button>
                                    </div>
                                </div>

                                {/* Conversation Window */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                    {conversation.length === 0 && agentState === 'IDLE' && (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                                            <Phone size={48} className="mb-4" />
                                            <p>Start a call to interact with Priya</p>
                                        </div>
                                    )}
                                    {conversation.map((log, idx) => (
                                        <div key={idx} className={`flex ${log.role === 'agent' ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                                                log.role === 'agent' 
                                                ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                                                : 'bg-indigo-600 text-white rounded-tr-none'
                                            }`}>
                                                {log.message}
                                                {log.role === 'agent' && (
                                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                                                        {log.state?.replace('_', ' ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isThinking && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 flex items-center gap-1">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <form onSubmit={handleCustomerReply} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                                    <div className="p-2 bg-slate-100 rounded-full text-slate-500">
                                        <Mic size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={customerInput}
                                        onChange={(e) => setCustomerInput(e.target.value)}
                                        placeholder={agentState === 'IDLE' ? "Start call to speak..." : "Speak as customer..."}
                                        disabled={agentState === 'IDLE' || isThinking}
                                        className="flex-1 bg-transparent outline-none text-sm"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={agentState === 'IDLE' || !customerInput.trim()}
                                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>

                            {/* AI Intelligence Panel */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Zap size={16} className="text-yellow-500" /> Live Intelligence
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Detected Vehicle</p>
                                            <p className="text-sm font-bold text-slate-800">{detectedContext.vehicle}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Issue / Intent</p>
                                            <p className="text-sm font-bold text-slate-800">{detectedContext.issue}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Customer Sentiment</p>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                detectedContext.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                                                detectedContext.sentiment === 'Concerned' ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-200 text-slate-600'
                                            }`}>
                                                {detectedContext.sentiment}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Activity size={16} className="text-indigo-500" /> State Machine
                                    </h4>
                                    <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                        {['GREETING', 'PROBLEM', 'INFO', 'RECOMMEND', 'SCHEDULE', 'CONFIRM'].map((step, i) => {
                                            const isActive = agentState.includes(step) || (agentState === 'IDLE' && i === 5 && conversation.length > 0);
                                            return (
                                                <div key={step} className="relative flex items-center gap-3">
                                                    <div className={`absolute -left-[1.35rem] w-3 h-3 rounded-full border-2 ${
                                                        isActive ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                                                    }`}></div>
                                                    <span className={`text-xs font-medium ${isActive ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>
                                                        {step}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Confidence Score</span>
                                        <span className="font-bold text-green-600">98.5%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1">
                                        <div className="bg-green-500 h-1.5 rounded-full w-[98%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'campaigns' && (
                    <div className="space-y-6">
                        <VoiceCampaignManager />
                    </div>
                )}

                {activeTab === 'email' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Templates</h3>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
                                <Plus size={16} /> Create Template
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockTemplates.map(template => (
                                <div key={template.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600"><Settings size={16}/></button>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">{template.name}</h4>
                                    <p className="text-xs text-slate-500 mb-4 truncate">{template.subject}</p>
                                    <div className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">
                                        Used {template.lastUsed}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'automation' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Active Rules & Triggers</h3>
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-orange-700 transition-colors">
                                <Plus size={16} /> New Rule
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {mockRules.map(rule => (
                                <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">{rule.name}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                            <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">IF</span> {rule.trigger}
                                            <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">THEN</span> {rule.action}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase">Active</span>
                                        <button className="text-slate-400 hover:text-slate-600"><Settings size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceCommunication;