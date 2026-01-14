
import React, { useState, useMemo, useCallback } from 'react';
import { AppMode, QuestionData, TestResult } from './types';
import { allQuestions } from './data/questions';

// --- Global UI Components ---

const Header: React.FC<{ title: string; onBack: () => void; right?: React.ReactNode }> = ({ title, onBack, right }) => (
  <header className="h-14 bg-white border-b border-gray-100 px-4 flex items-center justify-between shrink-0 pt-safe">
    <button onClick={(e) => { e.preventDefault(); onBack(); }} className="p-2 -ml-2 text-blue-600 active:opacity-40">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
    </button>
    <h1 className="text-xs font-black text-gray-900 uppercase tracking-widest truncate px-2">{title}</h1>
    <div className="w-10 flex justify-end">{right}</div>
  </header>
);

const ExitConfirmModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
    <div className="bg-white rounded-[2rem] w-full max-w-xs p-8 shadow-2xl">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2 text-center">Abbrechen?</h3>
      <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">Möchten Sie das Training wirklich beenden?</p>
      <div className="space-y-3">
        <button onClick={onConfirm} className="w-full py-4 bg-red-500 text-white font-black rounded-2xl active:scale-95 shadow-lg shadow-red-100">Ja, abbrechen</button>
        <button onClick={onCancel} className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl active:bg-gray-200">Weiterlernen</button>
      </div>
    </div>
  </div>
);

const Flashcard: React.FC<{ 
  question: QuestionData; 
  onAnswer: (i: number) => void; 
  selectedIdx: number | null; 
  showBack: boolean 
}> = ({ question, onAnswer, selectedIdx, showBack }) => (
  <div className="w-full h-full p-2 perspective-1000">
    <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${showBack ? 'rotate-y-180' : ''}`}>
      {/* Front */}
      <div className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl p-5 flex flex-col backface-hidden border border-gray-100 ${showBack ? 'hidden' : 'flex'}`}>
        <div className="shrink-0 text-center mb-2">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-tighter">Frage {question.id}</span>
        </div>
        
        {/* Scrollable Question Area */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col">
           <div className="my-auto">
              <h2 className="text-base md:text-lg font-bold leading-tight text-gray-900 text-center px-2">
                {question.questionDe || "Lade Frage..."}
              </h2>
           </div>
        </div>

        {/* Options Area - Fixed height per item to save space */}
        <div className="space-y-2 shrink-0 mt-2">
          {question.optionsDe.map((opt, i) => (
            <button key={i} onClick={() => onAnswer(i)} className="w-full text-left p-3 rounded-2xl border border-gray-100 bg-gray-50/50 active:bg-blue-50 active:border-blue-200 transition-all flex items-center group">
              <span className="w-7 h-7 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-[10px] font-black mr-3 shadow-sm group-active:border-blue-300 shrink-0">{String.fromCharCode(65 + i)}</span>
              <span className="text-[13px] font-medium leading-snug flex-1">{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Back */}
      <div className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl p-5 flex flex-col border-2 border-gray-50 ${showBack ? 'flex' : 'hidden'} rotate-y-180`}>
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          <section>
            <p className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Original (DE)</p>
            <h3 className="text-[14px] font-bold mb-3 leading-snug">{question.questionDe}</h3>
            <div className="space-y-1.5">
              {question.optionsDe.map((opt, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-xl border ${i === question.answerIndex ? 'bg-green-100 border-green-200 text-green-900 font-bold' : (selectedIdx === i ? 'bg-red-100 border-red-200 text-red-900' : 'bg-gray-50 text-gray-400 border-transparent')}`}>
                  {String.fromCharCode(65 + i)}: {opt}
                </div>
              ))}
            </div>
          </section>
          <section className="border-t border-gray-100 pt-5">
            <p className="text-[9px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Übersetzung (ZH)</p>
            <h3 className="text-[14px] font-bold mb-3 text-blue-900 leading-snug">{question.questionZh}</h3>
            <div className="space-y-1.5">
              {question.optionsZh.map((opt, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-xl border ${i === question.answerIndex ? 'bg-green-50 border-green-100 text-green-800 font-bold' : (selectedIdx === i ? 'bg-red-50 border-red-100 text-red-700' : 'bg-gray-50 text-gray-400 border-transparent')}`}>
                  {String.fromCharCode(65 + i)}: {opt}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUnit, setCurrentUnit] = useState<number | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [jumpId, setJumpId] = useState("");
  const [exitRequest, setExitRequest] = useState(false);

  // Test states
  const [testQs, setTestQs] = useState<QuestionData[]>([]);
  const [testAns, setTestAns] = useState<(number | null)[]>([]);
  const [testIdx, setTestIdx] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [score, setScore] = useState(0);

  const resetAll = useCallback(() => {
    setMode(AppMode.HOME); setCurrentIndex(0); setCurrentUnit(null); setShowBack(false);
    setSelectedIdx(null); setTestQs([]); setTestAns([]); setTestIdx(0); setResult(null);
    setScore(0); setJumpId(""); setExitRequest(false);
  }, []);

  const activeQs = useMemo(() => {
    if (mode === AppMode.FLASHCARD_UNIT && currentUnit) {
      const start = (currentUnit - 1) * 30;
      return allQuestions.slice(start, start + 30);
    }
    return allQuestions;
  }, [mode, currentUnit]);

  const startTest = () => {
    resetAll();
    const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
    const p1 = allQuestions.filter(q => q.id <= 300);
    const p2 = allQuestions.filter(q => q.id > 300);
    const combined = [...shuffle(p1).slice(0, 30), ...shuffle(p2).slice(0, 3)];
    setTestQs(combined); setTestAns(new Array(33).fill(null)); setMode(AppMode.TEST);
  };

  if (mode === AppMode.HOME) {
    const unitsCount = Math.ceil(allQuestions.length / 30);
    return (
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden pb-safe">
        <header className="bg-white border-b border-gray-100 pt-14 pb-8 px-6 text-center shrink-0">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-4 shadow-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Einbürgerungstest</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-2">Prüfungstrainer</p>
        </header>
        <main className="flex-1 overflow-y-auto p-5 space-y-4 max-w-lg mx-auto w-full">
          <button onClick={() => { resetAll(); setMode(AppMode.FLASHCARD_ALL); }} className="w-full bg-white border border-gray-200 p-5 rounded-3xl shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">ALL</div>
              <div className="text-left"><p className="font-black text-gray-800 text-sm uppercase">Alle Fragen</p><p className="text-xs text-gray-400">Frage 1 bis 317</p></div>
            </div>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: unitsCount }).map((_, i) => (
              <button key={i} onClick={() => { resetAll(); setCurrentUnit(i+1); setMode(AppMode.FLASHCARD_UNIT); }} className="bg-white border border-gray-100 py-4 rounded-2xl shadow-sm text-center font-black text-gray-600 text-[10px] uppercase active:bg-blue-600 active:text-white transition-all">Unit {i+1}</button>
            ))}
          </div>
          <button onClick={startTest} className="w-full bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between active:scale-[0.98] transition-all mt-4">
            <span className="font-black text-sm uppercase tracking-widest">Prüfung starten</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
          </button>
        </main>
      </div>
    );
  }

  if (mode === AppMode.FLASHCARD_ALL || mode === AppMode.FLASHCARD_UNIT) {
    const q = activeQs[currentIndex];
    return (
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden pb-safe">
        {exitRequest && <ExitConfirmModal onConfirm={resetAll} onCancel={() => setExitRequest(false)} />}
        <Header title={mode === AppMode.FLASHCARD_UNIT ? `Unit ${currentUnit}` : "Übung"} onBack={() => setExitRequest(true)} />
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex items-center justify-between max-w-md mx-auto w-full mb-2 shrink-0 px-2">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-gray-900">{currentIndex + 1}</span>
              <span className="text-[10px] font-bold text-gray-300">/ {activeQs.length}</span>
            </div>
            <div className="flex gap-1">
              <input type="number" value={jumpId} onChange={e => setJumpId(e.target.value)} placeholder="Nr." className="w-14 h-8 text-center text-xs font-bold border border-gray-200 rounded-xl bg-white focus:outline-none" />
              <button onClick={() => { const i = activeQs.findIndex(x => x.id === parseInt(jumpId)); if(i !== -1) { setCurrentIndex(i); setShowBack(false); setSelectedIdx(null); setJumpId(""); } }} className="bg-gray-900 text-white px-3 py-1 text-[10px] font-black rounded-xl active:bg-blue-600 transition-colors">GO</button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Flashcard question={q} onAnswer={i => { setSelectedIdx(i); setShowBack(true); }} selectedIdx={selectedIdx} showBack={showBack} />
          </div>
        </div>
        <footer className="h-24 bg-white border-t border-gray-50 px-6 flex items-center justify-between shrink-0 shadow-2xl">
          <button onClick={() => { if(currentIndex > 0) { setCurrentIndex(v=>v-1); setShowBack(false); setSelectedIdx(null); } }} disabled={currentIndex === 0} className="w-24 py-3.5 border border-gray-200 text-gray-600 text-xs font-black rounded-2xl disabled:opacity-10 active:bg-gray-50">ZURÜCK</button>
          <button onClick={() => { if(currentIndex < activeQs.length -1) { setCurrentIndex(v=>v+1); setShowBack(false); setSelectedIdx(null); } }} disabled={currentIndex === activeQs.length - 1} className="flex-1 ml-4 py-4 bg-blue-600 text-white text-xs font-black rounded-2xl disabled:opacity-10 active:scale-95 transition-all shadow-lg uppercase">Nächste</button>
        </footer>
      </div>
    );
  }

  if (mode === AppMode.TEST) {
    if (result) {
      return (
        <div className="h-full bg-white flex flex-col overflow-hidden pb-safe">
          <header className="h-16 border-b flex items-center justify-between px-6 shrink-0 pt-safe">
            <h1 className="font-black text-xs tracking-widest uppercase text-gray-400">Ergebnis</h1>
            <button onClick={resetAll} className="text-blue-600 font-black text-xs uppercase">Fertig</button>
          </header>
          <main className="flex-1 overflow-y-auto p-6 max-w-lg mx-auto w-full">
            <div className={`p-10 rounded-[2.5rem] text-center mb-8 ${result.passed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <h2 className="text-2xl font-black mb-1">{result.passed ? 'Bestanden!' : 'Nicht bestanden'}</h2>
              <p className="text-5xl font-black mb-4">{result.score} <span className="text-xl opacity-30">/ 33</span></p>
            </div>
            <div className="space-y-3">
              {testQs.map((q, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${testAns[i] === q.answerIndex ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                   <p className="text-xs font-bold leading-relaxed">{i+1}. {q.questionDe}</p>
                </div>
              ))}
            </div>
          </main>
        </div>
      );
    }

    const q = testQs[testIdx];
    const isAns = testAns[testIdx] !== null;

    return (
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden pb-safe">
        {exitRequest && <ExitConfirmModal onConfirm={resetAll} onCancel={() => setExitRequest(false)} />}
        <Header title="Prüfung" onBack={() => setExitRequest(true)} right={<span className="font-black text-blue-600 text-sm">{score}</span>} />
        
        {/* Progress Bar */}
        <div className="px-6 py-2 bg-white border-b border-gray-100 flex items-center gap-4 shrink-0">
          <div className="flex-1 flex gap-1">
            {testQs.map((_, i) => (<div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i === testIdx ? 'bg-blue-600' : i < testIdx ? 'bg-blue-200' : 'bg-gray-100'}`} />))}
          </div>
          <span className="text-[10px] font-black text-gray-300">{testIdx + 1}/33</span>
        </div>

        <main className="flex-1 overflow-hidden p-4 flex flex-col">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex-1 flex flex-col overflow-hidden p-6">
            
            {/* Question Area */}
            <div className="flex-1 overflow-y-auto py-2 flex flex-col">
              <div className="my-auto">
                <h2 className="text-base md:text-lg font-bold text-center leading-tight px-2">{q.questionDe}</h2>
              </div>
            </div>

            {/* Options Area */}
            <div className="space-y-2 shrink-0 mt-4">
              {q.optionsDe.map((opt, i) => {
                let s = 'border-gray-100 bg-gray-50/30 text-gray-700';
                if (isAns) {
                  if (i === q.answerIndex) s = 'border-green-500 bg-green-50 text-green-900 font-bold ring-2 ring-green-100';
                  else if (testAns[testIdx] === i) s = 'border-red-500 bg-red-50 text-red-900 font-bold ring-2 ring-red-100';
                  else s = 'border-gray-50 opacity-20 text-gray-400';
                }
                return (
                  <button key={i} disabled={isAns} onClick={() => { if(!isAns) { const n = [...testAns]; n[testIdx] = i; setTestAns(n); if(i === q.answerIndex) setScore(s=>s+1); } }} className={`w-full text-left p-3 rounded-2xl border transition-all ${s} flex items-center`}>
                    <div className="w-7 h-7 flex items-center justify-center rounded-xl border border-gray-200 bg-white font-black text-[10px] shrink-0 mr-3 shadow-sm">{String.fromCharCode(65 + i)}</div>
                    <span className="text-[13px] leading-snug flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Translation (only if answered) */}
            {isAns && (
              <div className="mt-4 p-4 bg-blue-50/30 rounded-[1.5rem] border border-blue-50 overflow-y-auto max-h-24 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="text-[8px] font-black text-blue-400 uppercase mb-1 tracking-[0.2em]">Übersetzung</p>
                <p className="text-[12px] font-bold text-blue-900 leading-normal">{q.questionZh}</p>
              </div>
            )}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-50 p-6 flex flex-col gap-3 shrink-0 shadow-2xl">
          {testIdx === 32 ? (
            <button onClick={() => setResult({ score, total: 33, passed: score >= 17, userAnswers: testAns, questions: testQs })} disabled={!isAns} className="w-full h-14 bg-green-600 text-white rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-green-100">Ergebnis anzeigen</button>
          ) : (
            <button onClick={() => setTestIdx(v => v + 1)} disabled={!isAns} className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-blue-100">Nächste Frage</button>
          )}
          <button onClick={() => setExitRequest(true)} className="w-full h-10 text-red-500 font-black text-[10px] uppercase tracking-[0.25em] active:bg-red-50 rounded-xl transition-colors">Abbrechen</button>
        </footer>
      </div>
    );
  }
  return null;
};

export default App;
