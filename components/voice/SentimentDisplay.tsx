import React from 'react';
import { Smile, Meh, Frown, TrendingUp } from 'lucide-react';
import { SentimentAnalysis } from '../../types/voice';

interface SentimentDisplayProps {
  sentiment: SentimentAnalysis;
}

const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ sentiment }) => {
  const getSentimentIcon = () => {
    switch (sentiment.overall) {
      case 'positive':
        return <Smile size={32} className="text-green-600" />;
      case 'negative':
        return <Frown size={32} className="text-red-600" />;
      default:
        return <Meh size={32} className="text-yellow-600" />;
    }
  };

  const getSentimentColor = () => {
    switch (sentiment.overall) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      default:
        return 'yellow';
    }
  };

  const color = getSentimentColor();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-600" />
        Sentiment Analysis
      </h3>

      {/* Overall Sentiment */}
      <div className={`bg-${color}-50 rounded-lg p-4 mb-4 border border-${color}-200`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall</span>
          {getSentimentIcon()}
        </div>
        <p className={`text-2xl font-bold text-${color}-700 capitalize`}>
          {sentiment.overall}
        </p>
        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
          <div
            className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.abs(sentiment.score) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Emotions Breakdown */}
      {sentiment.emotions && sentiment.emotions.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Emotions Detected</p>
          <div className="space-y-2">
            {sentiment.emotions.slice(0, 3).map((emotion, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 capitalize">{emotion.emotion}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${emotion.score * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8">
                    {Math.round(emotion.score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentDisplay;
