
import React, { useState, useMemo, useCallback } from 'react';
import { AppMode, QuestionData, TestResult } from './types';
import { allQuestions } from './data/questions';

// --- Sub-components ---

const ExitConfirmModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Prüfung abbrechen?</h3>
      <p className="text-sm text-gray-500 mb-6">Möchten Sie die aktuelle Sitzung wirklich beenden und zum Hauptmenü zurückkehren?</p>
      <div className="flex flex-col gap-2">
        <button onClick={onConfirm} className="w-full py-3 bg-red-500 text-white font-bold rounded-xl active:bg-red-600 transition-colors">Ja, abbrechen</button>
        <button onClick={onCancel} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl active:bg-gray-200 transition-colors">Weiterlernen</button>
      </div>
    </div>
  </div>
);

const Header: React.FC<{ title: string; onBack: () => void; rightElement?: React.ReactNode }> = ({ title, onBack, rightElement }) => (
  <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm shrink-0">
    <button 
      onClick={(e) => { e.preventDefault(); onBack(); }}
      className="p-2 -ml-2 text-blue-600 active:bg-blue-50 rounded-full transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h1 className="text-base font-bold text-gray-800 truncate px-2">{title}</h1>
    <div className="flex items-center justify-end min-w-[40px]">{rightElement}</div>
  </header>
);

const Flashcard: React.FC<{ 
  question: QuestionData; 
  onAnswer: (index: number) => void;
  selectedIdx: number | null;
  showBack: boolean;
}> = ({ question, onAnswer, selectedIdx, showBack }) => (
  <div className="w-full max-w-md mx-auto h-full p-2 perspective-1000">
    <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${showBack ? 'rotate-y-180' : ''}`}>
      <div className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between backface-hidden border border-gray-100 ${showBack ? 'hidden' : 'flex'}`}>
        <div className="flex-1 flex flex-col justify-center text-center overflow-y-auto mb-4">
          <span className="inline-block mx-auto px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mb-2">NR. {question.id}</span>
          <h2 className="text-lg font-bold leading-tight text-gray-800">{question.questionDe}</h2>
        </div>
        <div className="space-y-2 shrink-0">
          {question.optionsDe.map((opt, idx) => (
            <button key={idx} onClick={() => onAnswer(idx)} className="w-full text-left p-3 rounded-xl border border-gray-200 active:bg-blue-50 transition-all flex items-center">
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 text-[10px] font-bold mr-3">{String.fromCharCode(65 + idx)}</span>
              <span className="text-sm font-medium leading-tight">{opt}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between border-2 border-gray-100 ${showBack ? 'flex' : 'hidden'}`}>
        <div className="flex-1 overflow-y-auto space-y-4">
           <section>
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Original</p>
              <h3 className="text-base font-bold mb-2 leading-tight">{question.questionDe}</h3>
              <div className="space-y-1">
                {question.optionsDe.map((opt, idx) => (
                  <p key={idx} className={`text-sm p-1.5 rounded ${idx === question.answerIndex ? 'bg-green-100 text-green-800 font-bold' : (selectedIdx === idx ? 'bg-red-100 text-red-800' : 'text-gray-600')}`}>
                    {String.fromCharCode(65 + idx)}: {opt}
                  </p>
                ))}
              </div>
           </section>
           <div className="border-t border-gray-100 pt-3">
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">翻譯</p>
              <h3 className="text-base font-bold mb-2 text-blue-900 leading-tight">{question.questionZh}</h3>
              <div className="space-y-1">
                {question.optionsZh.map((opt, idx) => (
                  <p key={idx} className={`text-sm p-1.5 rounded ${idx === question.answerIndex ? 'bg-green-50 text-green-700 font-bold' : (selectedIdx === idx ? 'bg-red-50 text-red-700' : 'text-gray-500')}`}>
                    {String.fromCharCode(65 + idx)}: {opt}
                  </p>
                ))}
              </div>
           </div>
        </div>
        <div className="pt-2 text-center shrink-0 border-t border-gray-50">
           <p className="text-[10px] text-gray-400">Tippe auf "Weiter" für die nächste Karte</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUnit, setCurrentUnit] = useState<number | null>(null);
  const [showFlashcardBack, setShowFlashcardBack] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [jumpId, setJumpId] = useState("");
  const [showExitModal, setShowExitModal] = useState(false);

  // Test states
  const [testQuestions, setTestQuestions] = useState<QuestionData[]>([]);
  const [testAnswers, setTestAnswers] = useState<(number | null)[]>([]);
  const [testIndex, setTestIndex] = useState(0);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [runningScore, setRunningScore] = useState(0);

  const resetAppStates = useCallback(() => {
    setMode(AppMode.HOME);
    setCurrentIndex(0);
    setCurrentUnit(null);
    setShowFlashcardBack(false);
    setSelectedIdx(null);
    setTestQuestions([]);
    setTestAnswers([]);
    setTestIndex(0);
    setTestResult(null);
    setRunningScore(0);
    setJumpId("");
    setShowExitModal(false);
  }, []);

  const handleBackToHome = useCallback(() => {
    if (mode === AppMode.TEST && !testResult) {
      setShowExitModal(true);
    } else {
      resetAppStates();
    }
  }, [mode, testResult, resetAppStates]);

  const activeQuestions = useMemo(() => {
    if (mode === AppMode.FLASHCARD_UNIT && currentUnit !== null) {
      const start = (currentUnit - 1) * 30;
      return allQuestions.slice(start, start + 30);
    }
    return allQuestions;
  }, [mode, currentUnit]);

  const handleStartFlashcardsAll = () => { resetAppStates(); setMode(AppMode.FLASHCARD_ALL); };
  const handleStartFlashcardsUnit = (unit: number) => { resetAppStates(); setCurrentUnit(unit); setMode(AppMode.FLASHCARD_UNIT); };

  const handleStartTest = () => {
    resetAppStates();
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };
    const p1 = allQuestions.filter(q => q.id <= 300);
    const p2 = allQuestions.filter(q => q.id > 300);
    const combined = [...shuffle(p1).slice(0, 30), ...shuffle(p2).slice(0, 3)];
    setTestQuestions(combined);
    setTestAnswers(new Array(33).fill(null));
    setMode(AppMode.TEST);
  };

  const nextFlashcard = () => { if (currentIndex < activeQuestions.length - 1) { setCurrentIndex(prev => prev + 1); setShowFlashcardBack(false); setSelectedIdx(null); } };
  const prevFlashcard = () => { if (currentIndex > 0) { setCurrentIndex(prev => prev - 1); setShowFlashcardBack(false); setSelectedIdx(null); } };

  const handleJump = () => {
    const id = parseInt(jumpId);
    const fIdx = activeQuestions.findIndex(q => q.id === id);
    if (fIdx !== -1) { setCurrentIndex(fIdx); setShowFlashcardBack(false); setSelectedIdx(null); setJumpId(""); }
    else { alert("ID nicht gefunden!"); }
  };

  const handleTestAnswer = (idx: number) => {
    if (testAnswers[testIndex] !== null) return;
    const n = [...testAnswers]; n[testIndex] = idx; setTestAnswers(n);
    if (idx === testQuestions[testIndex].answerIndex) setRunningScore(s => s + 1);
  };

  if (mode === AppMode.HOME) {
    const totalUnits = Math.ceil(allQuestions.length / 30);
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-6 px-4 text-center shrink-0 shadow-sm">
          <div className="inline-block p-2 bg-blue-600 rounded-xl mb-2"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
          <h1 className="text-xl font-black text-gray-900 leading-none">Einbürgerungstest</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Trainer</p>
        </header>
        <main className="flex-1 overflow-y-auto w-full max-w-lg mx-auto p-4 space-y-4 pb-10">
          <button onClick={handleStartFlashcardsAll} className="w-full bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
              <div className="text-left"><p className="font-bold text-gray-800 text-sm">Alle Fragen</p><p className="text-[10px] text-gray-500">1 bis 317 nacheinander</p></div>
            </div>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: totalUnits }).map((_, i) => (
              <button key={i} onClick={() => handleStartFlashcardsUnit(i + 1)} className="bg-white border border-gray-200 py-3 rounded-xl shadow-sm text-center active:bg-blue-50 transition-all font-bold text-gray-700 text-xs">Unit {i + 1}</button>
            ))}
          </div>
          <button onClick={handleStartTest} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-lg flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <div className="text-left"><p className="font-bold text-sm">Prüfung (33 Fragen)</p><p className="text-[10px] text-blue-100">Simulationsmodus</p></div>
            </div>
          </button>
        </main>
      </div>
    );
  }

  if (mode === AppMode.FLASHCARD_ALL || mode === AppMode.FLASHCARD_UNIT) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <Header title={mode === AppMode.FLASHCARD_UNIT ? `Unit ${currentUnit}` : "Übung"} onBack={handleBackToHome} />
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
           <div className="flex items-center justify-between max-w-md mx-auto w-full mb-3 px-1 shrink-0">
              <span className="text-[10px] font-black text-gray-400">{currentIndex + 1} / {activeQuestions.length}</span>
              <div className="flex items-center gap-1">
                 <input type="number" value={jumpId} onChange={(e) => setJumpId(e.target.value)} placeholder="Nr." className="w-12 h-7 text-center text-[10px] border border-gray-300 rounded-md" />
                 <button onClick={handleJump} className="bg-gray-800 text-white px-2 py-1 text-[10px] font-bold rounded-md active:bg-black">OK</button>
              </div>
           </div>
           <div className="flex-1 min-h-0">
             <Flashcard question={activeQuestions[currentIndex]} onAnswer={(idx) => { setSelectedIdx(idx); setShowFlashcardBack(true); }} selectedIdx={selectedIdx} showBack={showFlashcardBack} />
           </div>
        </div>
        <footer className="h-20 bg-white border-t border-gray-100 px-6 flex items-center justify-between shrink-0 shadow-lg">
           <button onClick={prevFlashcard} disabled={currentIndex === 0} className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl disabled:opacity-20 active:bg-gray-50">Zurück</button>
           <button onClick={nextFlashcard} disabled={currentIndex === activeQuestions.length - 1} className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl disabled:opacity-20 active:scale-95 transition-all">Weiter</button>
        </footer>
      </div>
    );
  }

  if (mode === AppMode.TEST) {
    if (testResult) {
      return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
          <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 shadow-sm">
            <h1 className="text-base font-bold">Ergebnis</h1>
            <button onClick={resetAppStates} className="text-blue-600 text-sm font-bold active:opacity-60">Fertig</button>
          </header>
          <main className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
             <div className={`p-6 rounded-2xl text-center mb-6 ${testResult.passed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <h2 className="text-2xl font-black mb-1">{testResult.passed ? 'Bestanden!' : 'Nicht bestanden'}</h2>
                <p className="text-4xl font-black mb-2">{testResult.score} / 33</p>
             </div>
             <div className="space-y-3 pb-6">
                {testQuestions.map((q, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border ${testAnswers[idx] === q.answerIndex ? 'border-green-100 bg-green-50/20' : 'border-red-100 bg-red-50/20'}`}>
                       <p className="text-sm font-bold">{q.questionDe}</p>
                    </div>
                ))}
             </div>
          </main>
        </div>
      );
    }

    const currentQ = testQuestions[testIndex];
    const isLast = testIndex === 32;
    const hasAnswered = testAnswers[testIndex] !== null;

    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {showExitModal && <ExitConfirmModal onConfirm={resetAppStates} onCancel={() => setShowExitModal(false)} />}
        <Header title="Prüfung" onBack={handleBackToHome} rightElement={<div className="text-right"><span className="text-base font-black text-green-600">{runningScore}</span></div>} />
        <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex-1 flex gap-0.5 mr-4">
             {Array.from({ length: 33 }).map((_, i) => (<div key={i} className={`h-1 flex-1 rounded-full ${i === testIndex ? 'bg-blue-600' : i < testIndex ? 'bg-blue-200' : 'bg-gray-100'}`} />))}
          </div>
          <span className="text-[10px] font-bold text-gray-400">{testIndex + 1}/33</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 flex flex-col">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col justify-center overflow-y-auto mb-4">
                 <h2 className="text-lg font-bold text-center leading-tight">{currentQ.questionDe}</h2>
              </div>
              <div className="space-y-2 shrink-0">
                 {currentQ.optionsDe.map((opt, idx) => {
                   let style = 'border-gray-200 bg-white';
                   if (hasAnswered) {
                     if (idx === currentQ.answerIndex) style = 'border-green-600 bg-green-50 ring-1 ring-green-600/20';
                     else if (testAnswers[testIndex] === idx) style = 'border-red-600 bg-red-50 ring-1 ring-red-600/20';
                     else style = 'border-gray-100 opacity-40';
                   } else if (testAnswers[testIndex] === idx) style = 'border-blue-600 bg-blue-50';
                   return (
                    <button key={idx} disabled={hasAnswered} onClick={() => handleTestAnswer(idx)} className={`w-full text-left p-3 rounded-xl border transition-all ${style} flex items-center`}>
                      <div className="w-6 h-6 flex items-center justify-center rounded-full mr-3 border font-bold text-[10px] shrink-0">{String.fromCharCode(65 + idx)}</div>
                      <span className="text-sm font-medium leading-tight">{opt}</span>
                    </button>
                   );
                 })}
              </div>
              {hasAnswered && (
                <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 overflow-y-auto max-h-24 shrink-0">
                  <p className="text-[8px] font-bold text-blue-400 uppercase mb-1 tracking-wider">Übersetzung</p>
                  <p className="text-xs font-medium text-blue-900 leading-tight">{currentQ.questionZh}</p>
                </div>
              )}
           </div>
        </main>
        <footer className="h-28 bg-white border-t border-gray-100 p-4 flex flex-col gap-2 shrink-0 shadow-lg">
           {isLast ? (
             <button onClick={() => { setTestResult({ score: runningScore, total: 33, passed: runningScore >= 17, userAnswers: testAnswers, questions: testQuestions }); }} disabled={!hasAnswered} className="w-full h-11 bg-green-600 text-white rounded-xl font-bold disabled:opacity-30 active:scale-95 transition-all">Ergebnis anzeigen</button>
           ) : (
             <button onClick={() => setTestIndex(prev => prev + 1)} disabled={!hasAnswered} className="w-full h-11 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-2">Nächste Frage</button>
           )}
           <button onClick={() => setShowExitModal(true)} className="w-full h-9 text-red-500 font-bold text-xs uppercase tracking-widest active:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all">Prüfung Abbrechen</button>
        </footer>
      </div>
    );
  }
  return null;
};
export default App;
