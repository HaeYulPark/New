import React, { useState, useEffect } from 'react';
import { User, Sparkles, Loader2, Trophy } from 'lucide-react';
import { Accordion } from './components/Accordion';
import { Alert } from './components/Alert';
import { generateDailyQuests } from './services/geminiService';
import { QuestItem } from './types';

const INITIAL_QUESTS: QuestItem[] = [
  {
    id: '1',
    title: '난이도 1',
    content: '일어나서 씻기!',
    difficulty: 1,
    completed: false,
  },
  {
    id: '2',
    title: '난이도 2',
    content: '핸드폰없이 30분이상 산책하기!',
    difficulty: 2,
    completed: false,
  },
  {
    id: '3',
    title: '난이도 3',
    content: '산책 중에 초면인 사람 3명과 가벼운 인사하기!',
    difficulty: 3,
    completed: false,
  },
];

export default function App() {
  const [quests, setQuests] = useState<QuestItem[]>(INITIAL_QUESTS);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const handleGenerateQuests = async () => {
    setLoading(true);
    try {
      const generated = await generateDailyQuests();
      const newQuests: QuestItem[] = generated.map((q, idx) => ({
        id: Date.now().toString() + idx,
        title: q.title,
        content: q.content,
        difficulty: idx + 1,
        completed: false
      }));
      setQuests(newQuests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestComplete = (id: string) => {
    setQuests(prev => prev.map(q => 
      q.id === id ? { ...q, completed: !q.completed } : q
    ));
  };

  // Calculate progress for a subtle visual effect
  const completedCount = quests.filter(q => q.completed).length;
  const progress = (completedCount / quests.length) * 100;

  // Calculate score: difficulty * 10 points
  const currentScore = quests.reduce((acc, quest) => {
    return acc + (quest.completed ? (quest.difficulty * 10) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      
      {/* Container matching specs */}
      <div className="relative w-full max-w-[424px] bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl shadow-2xl flex flex-col p-6 overflow-hidden transition-all">
        
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left transition-all duration-500" style={{ width: `${progress}%` }}></div>

        {/* Header / Icon Area */}
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
             <User className="w-[108px] h-[108px] text-gray-400 relative z-10" strokeWidth={1} />
             {completedCount === quests.length && quests.length > 0 && (
               <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-8 h-8 animate-bounce" />
             )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-tight">오늘의 퀘스트</h1>
          <p className="text-gray-400 text-sm mt-1">집콕 생활을 레벨업 하세요!</p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerateQuests}
            disabled={loading}
            className="w-[233px] h-[48px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-900/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>집콕 퀘스트!</span>
              </>
            )}
          </button>
        </div>

        {/* Score Display Area */}
        <div className="mb-6 px-1">
          <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-all duration-300 ${currentScore > 0 ? 'bg-yellow-500/20' : 'bg-gray-600/20'}`}>
                <Trophy className={`w-5 h-5 transition-colors duration-300 ${currentScore > 0 ? 'text-yellow-400' : 'text-gray-500'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Score</span>
                <span className="text-gray-200 font-bold text-sm">퀘스트 점수</span>
              </div>
            </div>
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-bold tabular-nums transition-colors duration-300 ${currentScore > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                {currentScore}
              </span>
              <span className="text-gray-500 text-sm font-medium mb-1">점</span>
            </div>
          </div>
        </div>

        {/* Quest List (Accordion) */}
        <div className="flex-1 mb-8 min-h-[240px]">
          <Accordion items={quests} onToggleComplete={toggleQuestComplete} />
        </div>

        {/* Footer Alert */}
        {showAlert && (
          <div className="mt-auto animate-fade-in-up">
            <Alert 
              text="시행하지 못하면 내일 퀘스트에 추가됩니다." 
              onDismiss={() => setShowAlert(false)} 
            />
          </div>
        )}
        
      </div>
    </div>
  );
}