import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Trophy, Home, ChevronRight, Check, X, RotateCcw, Flame, Star, Zap, Share2 } from 'lucide-react';

// --- Mock Data ---
const VOCAB_DATA = [
  { id: 1, word: "Consensus", pronunciation: "/kənˈsensəs/", meaning: "n. 一致意见，共识", example: "The committee finally reached a consensus.", difficulty: "困难" },
  { id: 2, word: "Ambiguous", pronunciation: "/æmˈbɪɡjuəs/", meaning: "adj. 模棱两可的，含糊不清的", example: "The instructions were too ambiguous to follow.", difficulty: "中等" },
  { id: 3, word: "Vulnerable", pronunciation: "/ˈvʌlnərəbl/", meaning: "adj. 易受攻击的，脆弱的", example: "Children are vulnerable to illnesses.", difficulty: "困难" },
  { id: 4, word: "Dilemma", pronunciation: "/dɪˈlemə/", meaning: "n. 进退两难的境地，困境", example: "She faced a terrible dilemma.", difficulty: "中等" },
  { id: 5, word: "Absurd", pronunciation: "/əbˈsɜːrd/", meaning: "adj. 荒谬的，可笑的", example: "It is absurd to wear a coat in summer.", difficulty: "简单" },
  { id: 6, word: "Skeptical", pronunciation: "/ˈskeptɪkl/", meaning: "adj. 怀疑的", example: "I am skeptical about his chances of winning.", difficulty: "中等" },
  { id: 7, word: "Plausible", pronunciation: "/ˈplɔːzəbl/", meaning: "adj. 貌似合理的", example: "His explanation sounds plausible.", difficulty: "困难" },
  { id: 8, word: "Scrutiny", pronunciation: "/ˈskruːtəni/", meaning: "n. 仔细检查", example: "The document came under close scrutiny.", difficulty: "困难" },
];

const QUIZ_DATA = [
  {
    id: 1,
    question: "Without proper protection, the system is ______ to virus attacks.",
    options: ["versatile", "valuable", "vulnerable", "void"],
    correctAnswer: "vulnerable"
  },
  {
    id: 2,
    question: "The committee finally reached a ______ on the proposal.",
    options: ["controversy", "consensus", "collision", "compromise"],
    correctAnswer: "consensus"
  },
  {
    id: 3,
    question: "His explanation sounds ______, but I'm not sure if it's true.",
    options: ["plausible", "ambiguous", "absurd", "vulnerable"],
    correctAnswer: "plausible"
  }
];

// --- Components ---

const ProgressBar = ({ current, total, color = "bg-indigo-500" }) => (
  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
    <div 
      className={`h-full ${color} transition-all duration-500 ease-out`} 
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

// --- Main App Component ---

export default function CET6App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userXP, setUserXP] = useState(1250);
  const [streak, setStreak] = useState(12);
  const [dailyGoal, setDailyGoal] = useState(5); // words learned today
  const [dailyProgress, setDailyProgress] = useState(3);
  
  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Share Functionality
  const handleShare = () => {
    const text = `🔥 我在“小陈带你学六级”APP里已经坚持打卡 ${streak} 天了！\n当前经验值：${userXP}\n快来和我一起卷六级单词吧！💪`;
    
    // Create hidden textarea to copy text (works in most iframe/browser contexts)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      // Show a simple custom toast/alert simulation
      const toast = document.createElement("div");
      toast.innerText = "📋 学习进度已复制！快去粘贴发给朋友吧";
      toast.style.position = "fixed";
      toast.style.top = "20px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.backgroundColor = "#333";
      toast.style.color = "white";
      toast.style.padding = "10px 20px";
      toast.style.borderRadius = "20px";
      toast.style.zIndex = "1000";
      toast.style.fontSize = "14px";
      toast.style.animation = "fade-in 0.5s";
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % VOCAB_DATA.length);
    }, 200);
  };

  const handleQuizAnswer = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    
    const isCorrect = option === QUIZ_DATA[quizIndex].correctAnswer;
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      setUserXP(prev => prev + 20); // Bonus XP
    }

    setTimeout(() => {
      if (quizIndex < QUIZ_DATA.length - 1) {
        setQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        setIsQuizComplete(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsQuizComplete(false);
  };

  // --- Views ---

  const renderHome = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="flex justify-between items-center bg-indigo-600 text-white p-6 rounded-3xl shadow-lg shadow-indigo-200">
        <div>
          <p className="text-indigo-100 text-sm font-medium">总经验值 (Total XP)</p>
          <h2 className="text-3xl font-bold">{userXP}</h2>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/50 px-3 py-1.5 rounded-full">
          <Flame className="w-5 h-5 text-orange-300 fill-orange-300" />
          <span className="font-bold">{streak} 天</span>
        </div>
      </div>

      {/* Daily Goal */}
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">每日目标</h3>
          <span className="text-sm text-gray-500">{dailyProgress}/{dailyGoal} 词</span>
        </div>
        <ProgressBar current={dailyProgress} total={dailyGoal} />
        <p className="text-xs text-gray-400 mt-3">加油！你快达标了。</p>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setActiveTab('vocab')}
          className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="font-bold text-purple-900">单词卡</span>
          <span className="text-xs text-purple-600/70">学习新单词</span>
        </button>

        <button 
          onClick={() => setActiveTab('quiz')}
          className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <Brain className="w-6 h-6" />
          </div>
          <span className="font-bold text-orange-900">快速测验</span>
          <span className="text-xs text-orange-600/70">自我检测</span>
        </button>
      </div>

      {/* Suggested */}
      <div className="mt-4">
        <h3 className="font-bold text-gray-800 mb-3">为你推荐</h3>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-sm">真题挑战</h4>
            <p className="text-xs text-gray-500">2023年6月 - 翻译部分</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </div>
  );

  const renderVocab = () => {
    const card = VOCAB_DATA[currentCardIndex];
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">单词卡</h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {currentCardIndex + 1} / {VOCAB_DATA.length}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center perspective-1000 relative">
          <div 
            className={`relative w-full aspect-[4/5] transition-all duration-500 transform-style-3d cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center hover:border-indigo-300 transition-colors">
              <span className={`px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                card.difficulty === '困难' ? 'bg-red-100 text-red-600' : 
                card.difficulty === '中等' ? 'bg-yellow-100 text-yellow-600' : 
                'bg-green-100 text-green-600'
              }`}>
                {card.difficulty}
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">{card.word}</h2>
              <p className="text-gray-400 font-mono">{card.pronunciation}</p>
              <p className="text-gray-400 text-sm mt-8 animate-pulse">点击翻转</p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{card.meaning}</h3>
              <div className="w-12 h-1 bg-white/20 rounded-full mb-6"></div>
              <p className="text-indigo-100 text-lg italic">"{card.example}"</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-1 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            翻转
          </button>
          <button 
            onClick={handleNextCard}
            className="flex-1 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
          >
            下一个 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (isQuizComplete) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mb-6">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">测验完成！</h2>
          <p className="text-gray-500 mb-8">你获得了 {quizScore} 分。</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <Card className="flex flex-col items-center py-4">
              <span className="text-xs text-gray-400 uppercase tracking-wider">正确率</span>
              <span className="text-xl font-bold text-green-600">100%</span>
            </Card>
            <Card className="flex flex-col items-center py-4">
              <span className="text-xs text-gray-400 uppercase tracking-wider">获得 XP</span>
              <span className="text-xl font-bold text-indigo-600">+60</span>
            </Card>
          </div>

          <button 
            onClick={resetQuiz}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> 再试一次
          </button>
        </div>
      );
    }

    const currentQ = QUIZ_DATA[quizIndex];

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">第 {quizIndex + 1}/{QUIZ_DATA.length} 题</span>
            <div className="flex gap-1 mt-2">
              {QUIZ_DATA.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 w-8 rounded-full ${idx <= quizIndex ? 'bg-indigo-600' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
          <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Zap className="w-4 h-4" /> {quizScore}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 leading-relaxed mb-8">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex justify-between items-center ";
              
              if (showResult && option === currentQ.correctAnswer) {
                btnClass += "border-green-500 bg-green-50 text-green-700";
              } else if (showResult && selectedOption === option && option !== currentQ.correctAnswer) {
                btnClass += "border-red-500 bg-red-50 text-red-700";
              } else if (!showResult) {
                btnClass += "border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50 text-gray-600";
              } else {
                btnClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleQuizAnswer(option)}
                  disabled={showResult}
                  className={btnClass}
                >
                  {option}
                  {showResult && option === currentQ.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                  {showResult && selectedOption === option && option !== currentQ.correctAnswer && <X className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Feedback Area (Placeholder for spacing) */}
        <div className="h-12 mt-4 flex items-center justify-center">
            {showResult && (
                <span className="text-sm text-gray-400 animate-pulse">加载下一题...</span>
            )}
        </div>
      </div>
    );
  };

  const renderStats = () => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">学习进度</h2>
        
        <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                <Star className="w-8 h-8 mb-2 opacity-80" />
                <h3 className="text-3xl font-bold">{userXP}</h3>
                <p className="text-indigo-100 text-sm">总经验值</p>
            </Card>
            <Card className="bg-gradient-to-br from-orange-400 to-pink-500 text-white border-none">
                <Flame className="w-8 h-8 mb-2 opacity-80" />
                <h3 className="text-3xl font-bold">{streak}</h3>
                <p className="text-orange-100 text-sm">连续打卡</p>
            </Card>
        </div>

        <Card>
            <h3 className="font-bold text-gray-800 mb-4">本周活跃度</h3>
            <div className="flex justify-between items-end h-32 gap-2">
                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                            className={`w-full rounded-t-lg transition-all hover:bg-indigo-600 ${i === 5 ? 'bg-indigo-500' : 'bg-indigo-200'}`} 
                            style={{ height: `${h}%` }}
                        ></div>
                        <span className="text-xs text-gray-400">{['一','二','三','四','五','六','日'][i]}</span>
                    </div>
                ))}
            </div>
        </Card>

        <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">我的成就</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800">词汇大师</h4>
                        <p className="text-xs text-gray-500">已学习 100 个单词</p>
                    </div>
                    <span className="text-xs font-bold text-green-600">已达成</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800">速度恶魔</h4>
                        <p className="text-xs text-gray-500">30秒内完成测验</p>
                    </div>
                    <span className="text-xs font-bold text-gray-400">未解锁</span>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Top Bar (Only specific views) */}
        {activeTab === 'home' && (
            <div className="pt-8 pb-4 px-6 flex justify-between items-center bg-white z-10">
                <div>
                    <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">小陈带你 <span className="text-indigo-600">学六级</span></h1>
                    <p className="text-xs text-gray-400">一起拿下六级！</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                      onClick={handleShare}
                      className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                      title="分享进度"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200">
                        陈
                    </div>
                </div>
            </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide pb-24">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'vocab' && renderVocab()}
            {activeTab === 'quiz' && renderQuiz()}
            {activeTab === 'stats' && renderStats()}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-20">
            {[
                { id: 'home', icon: Home, label: '首页' },
                { id: 'vocab', icon: BookOpen, label: '学习' },
                { id: 'quiz', icon: Brain, label: '测验' },
                { id: 'stats', icon: Trophy, label: '统计' },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id);
                        if (item.id === 'quiz') resetQuiz();
                    }}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                        activeTab === item.id ? 'text-indigo-600 -translate-y-1' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-indigo-100' : ''}`} />
                    <span className="text-[10px] font-bold">{item.label}</span>
                </button>
            ))}
        </div>

      </div>
      
      {/* Global Styles for Flip Animation */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
