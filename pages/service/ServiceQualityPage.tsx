import React, { useState } from 'react';
import { Search, ClipboardList, ThumbsUp } from 'lucide-react';
import DamageDetectionModal from '../../components/DamageDetectionModal';
import QualityChecklistModal from '../../components/QualityChecklistModal';
import FeedbackAnalysisModal from '../../components/FeedbackAnalysisModal';

const ServiceQualityPage: React.FC = () => {
    const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
    const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => setIsDamageModalOpen(true)}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <Search size={24} className="text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Deep Scan Damage Detection</h3>
                    <p className="text-sm text-slate-500">AI Vision analysis for automated damage assessment and cost estimation.</p>
                </div>

                <div
                    onClick={() => setIsQualityModalOpen(true)}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                        <ClipboardList size={24} className="text-teal-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Quality Assurance Audit</h3>
                    <p className="text-sm text-slate-500">Digital checklist with photo proofing and compliance tracking.</p>
                </div>

                <div
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                        <ThumbsUp size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">Feedback Intelligence</h3>
                    <p className="text-sm text-slate-500">NPS tracking and sentiment analysis from customer reviews.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Quality Trends</h3>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    Placeholder for Quality Trend Chart
                </div>
            </div>

            {/* Modals */}
            <DamageDetectionModal
                isOpen={isDamageModalOpen}
                onClose={() => setIsDamageModalOpen(false)}
            />

            <QualityChecklistModal
                isOpen={isQualityModalOpen}
                onClose={() => setIsQualityModalOpen(false)}
            />

            <FeedbackAnalysisModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
            />
        </div>
    );
};

export default ServiceQualityPage;
