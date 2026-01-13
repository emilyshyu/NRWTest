
import React, { useState, useMemo, useCallback } from 'react';
import { AppMode, QuestionData, TestResult } from './types';
import { allQuestions } from './data/questions';

// --- Components ---

const Header: React.FC<{ title: string; onBack: () => void; right?: React.ReactNode }> = ({ title, onBack, right }) => (
  <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm shrink-0 pt-safe">
    <button onClick={onBack} className="p-2 -ml-2 text-blue-600 active:opacity-50">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
    </button>
    <h1 className="text-sm font-black text-gray-800 tracking-tight uppercase">{title}</h1>
    <div className="w-10 flex justify-end">{right}</div>
  </header>
);

const ExitConfirmModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-2xl">
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Abbrechen?</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">Möchten Sie das Lernen wirklich beenden?</p>
      <div className="space-y-3">
        <button onClick={onConfirm} className="w-full py-4 bg-red-500 text-white font-bold rounded-xl active:bg-red-600">Ja, abbrechen</button>
        <button onClick={onCancel} className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:bg-gray-200">Weiter</button>
      </div>
    </div>
  </div>
);

const Flashcard: React.FC<{ question: QuestionData; onAnswer: (i: number) => void; selectedIdx: number | null; showBack: boolean }> = ({ question, onAnswer, selectedIdx, showBack }) => (
  <div className="w-full max-w-md mx-auto h-full p-4 perspective-1000">
    <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${showBack ? 'rotate-y-180' : ''}`}>
      {/* Front */}
      <div className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between backface-hidden border border-gray-100 ${showBack ? 'hidden' : 'flex'}`}>
        <div className="flex-1 flex flex-col justify-center text-center mb-6 overflow-y-auto">
          <span className="inline-block mx-auto px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded mb-2">FRAGE {question.id}</span>
          <h2 className="text-lg font-bold leading-tight text-gray-900">{question.questionDe}</h2>
        </div>
        <div className="space-y-3 shrink-0">
          {question.optionsDe.map((opt, i) => (
            <button key={i} onClick={() => onAnswer(i)} className="w-full text-left p-4 rounded-xl border border-gray-200 active:bg-blue-50 transition-all flex items-center">
              <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs font-bold mr-3">{String.fromCharCode(65 + i)}</span>
              <span className="text-sm font-medium">{opt}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Back */}
      <div className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border-2 border-gray-50 ${showBack ? 'flex' : 'hidden'} rotate-y-180`}>
        <div className="flex-1 overflow-y-auto space-y-4">
          <section>
            <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">Original</p>
            <h3 className="text-sm font-bold mb-3">{question.questionDe}</h3>
            <div className="space-y-2">
              {question.optionsDe.map((opt, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-lg border ${i === question.answerIndex ? 'bg-green-100 border-green-200 text-green-800 font-bold' : (selectedIdx === i ? 'bg-red-100 border-red-200 text-red-800' : 'bg-gray-50 text-gray-400 border-transparent')}`}>
                  {String.fromCharCode(65 + i)}: {opt}
                </div>
              ))}
            </div>
          </section>
          <section className="border-t border-gray-100 pt-4">
            <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">翻譯</p>
            <h3 className="text-sm font-bold mb-3 text-blue-900">{question.questionZh}</h3>
            <div className="space-y-2">
              {question.optionsZh.map((opt, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-lg border ${i === question.answerIndex ? 'bg-green-50 border-green-100 text-green-700 font-bold' : (selectedIdx === i ? 'bg-red-50 border-red-100 text-red-700' : 'bg-gray-50 text-gray-400 border-transparent')}`}>
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

// --- Main App ---

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUnit, setCurrentUnit] = useState<number | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [jumpId, setJumpId] = useState("");
  const [exitRequest, setExitRequest] = useState(false);

  // Test
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
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden pb-safe">
        <header className="bg-white border-b border-gray-200 py-10 px-6 text-center shrink-0">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Einbürgerungstest</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Prüfungssimulation & Lernen</p>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-lg mx-auto w-full">
          <button onClick={() => { resetAll(); setMode(AppMode.FLASHCARD_ALL); }} className="w-full bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center justify-between active:bg-gray-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
              <div className="text-left"><p className="font-black text-gray-800 text-sm">Alle Fragen</p><p className="text-xs text-gray-400">1 bis 317 nacheinander</p></div>
            </div>
          </button>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: unitsCount }).map((_, i) => (
              <button key={i} onClick={() => { resetAll(); setCurrentUnit(i+1); setMode(AppMode.FLASHCARD_UNIT); }} className="bg-white border border-gray-200 py-4 rounded-xl shadow-sm text-center font-bold text-gray-700 text-xs active:bg-blue-50 active:border-blue-200">Unit {i+1}</button>
            ))}
          </div>
          <button onClick={startTest} className="w-full bg-blue-600 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between active:bg-blue-700 active:scale-95 transition-all">
            <span className="font-black text-sm uppercase tracking-wider">Prüfung starten (33 Fragen)</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
          </button>
        </main>
      </div>
    );
  }

  if (mode === AppMode.FLASHCARD_ALL || mode === AppMode.FLASHCARD_UNIT) {
    const q = activeQs[currentIndex];
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden pb-safe">
        {exitRequest && <ExitConfirmModal onConfirm={resetAll} onCancel={() => setExitRequest(false)} />}
        <Header title={mode === AppMode.FLASHCARD_UNIT ? `Unit ${currentUnit}` : "Übung"} onBack={() => setExitRequest(true)} />
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
          <div className="flex items-center justify-between max-w-md mx-auto w-full mb-3 shrink-0 px-2">
            <span className="text-[10px] font-black text-gray-400">{currentIndex + 1} / {activeQs.length}</span>
            <div className="flex gap-1">
              <input type="number" value={jumpId} onChange={e => setJumpId(e.target.value)} placeholder="Nr." className="w-12 h-8 text-center text-xs border border-gray-300 rounded-lg" />
              <button onClick={() => { const i = activeQs.findIndex(x => x.id === parseInt(jumpId)); if(i !== -1) { setCurrentIndex(i); setShowBack(false); setSelectedIdx(null); setJumpId(""); } }} className="bg-gray-800 text-white px-3 py-1 text-xs font-bold rounded-lg">OK</button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Flashcard question={q} onAnswer={i => { setSelectedIdx(i); setShowBack(true); }} selectedIdx={selectedIdx} showBack={showBack} />
          </div>
        </div>
        <footer className="h-24 bg-white border-t border-gray-100 px-6 flex items-center justify-between shrink-0 shadow-lg">
          <button onClick={() => { if(currentIndex > 0) { setCurrentIndex(v=>v-1); setShowBack(false); setSelectedIdx(null); } }} disabled={currentIndex === 0} className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl disabled:opacity-20 active:bg-gray-50">Zurück</button>
          <button onClick={() => { if(currentIndex < activeQs.length -1) { setCurrentIndex(v=>v+1); setShowBack(false); setSelectedIdx(null); } }} disabled={currentIndex === activeQs.length - 1} className="px-10 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl disabled:opacity-20 active:scale-95 transition-all">Weiter</button>
        </footer>
      </div>
    );
  }

  if (mode === AppMode.TEST) {
    if (result) {
      return (
        <div className="h-screen bg-white flex flex-col overflow-hidden pb-safe">
          <header className="h-16 border-b flex items-center justify-between px-6 shrink-0">
            <h1 className="font-black text-sm tracking-widest uppercase">Ergebnis</h1>
            <button onClick={resetAll} className="text-blue-600 font-bold text-sm">Fertig</button>
          </header>
          <main className="flex-1 overflow-y-auto p-6 max-w-lg mx-auto w-full">
            <div className={`p-8 rounded-3xl text-center mb-8 ${result.passed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <h2 className="text-2xl font-black mb-2">{result.passed ? 'BESTANDEN!' : 'DURCHGEFALLEN'}</h2>
              <p className="text-5xl font-black mb-3">{result.score} / 33</p>
              <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{result.passed ? 'Herzlichen Glückwunsch!' : 'Noch einmal versuchen.'}</p>
            </div>
            <div className="space-y-4">
              {testQs.map((q, i) => (
                <div key={i} className={`p-4 rounded-xl border ${testAns[i] === q.answerIndex ? 'border-green-100 bg-green-50/20' : 'border-red-100 bg-red-50/20'}`}>
                  <p className="text-sm font-bold leading-snug">{q.questionDe}</p>
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
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden pb-safe">
        {exitRequest && <ExitConfirmModal onConfirm={resetAll} onCancel={() => setExitRequest(false)} />}
        <Header title="Prüfung" onBack={() => setExitRequest(true)} right={<span className="font-black text-green-600">{score}</span>} />
        <div className="px-6 py-3 bg-white border-b flex items-center gap-4 shrink-0">
          <div className="flex-1 flex gap-0.5">
            {testQs.map((_, i) => (<div key={i} className={`h-1 flex-1 rounded-full ${i === testIdx ? 'bg-blue-600' : i < testIdx ? 'bg-blue-200' : 'bg-gray-100'}`} />))}
          </div>
          <span className="text-[10px] font-black text-gray-400">{testIdx + 1}/33</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 flex flex-col">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col justify-center overflow-y-auto mb-6">
              <h2 className="text-lg font-bold text-center leading-tight">{q.questionDe}</h2>
            </div>
            <div className="space-y-2.5 shrink-0">
              {q.optionsDe.map((opt, i) => {
                let s = 'border-gray-200 bg-white';
                if (isAns) {
                  if (i === q.answerIndex) s = 'border-green-600 bg-green-50 ring-2 ring-green-600/10';
                  else if (testAns[testIdx] === i) s = 'border-red-600 bg-red-50 ring-2 ring-red-600/10';
                  else s = 'border-gray-50 opacity-30';
                }
                return (
                  <button key={i} disabled={isAns} onClick={() => { if(!isAns) { const n = [...testAns]; n[testIdx] = i; setTestAns(n); if(i === q.answerIndex) setScore(s=>s+1); } }} className={`w-full text-left p-4 rounded-xl border transition-all ${s} flex items-center`}>
                    <div className="w-6 h-6 flex items-center justify-center rounded-full mr-3 border font-black text-[10px] shrink-0">{String.fromCharCode(65 + i)}</div>
                    <span className="text-sm font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>
            {isAns && (
              <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 overflow-y-auto max-h-32 shrink-0">
                <p className="text-[9px] font-black text-blue-400 uppercase mb-1 tracking-widest">Übersetzung</p>
                <p className="text-xs font-bold text-blue-900 leading-normal">{q.questionZh}</p>
              </div>
            )}
          </div>
        </main>
        <footer className="bg-white border-t border-gray-100 p-6 flex flex-col gap-4 shrink-0 shadow-lg">
          {testIdx === 32 ? (
            <button onClick={() => setResult({ score, total: 33, passed: score >= 17, userAnswers: testAns, questions: testQs })} disabled={!isAns} className="w-full h-14 bg-green-600 text-white rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-all">ERGEBNIS ANZEIGEN</button>
          ) : (
            <button onClick={() => setTestIdx(v => v + 1)} disabled={!isAns} className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-all">NÄCHSTE FRAGE</button>
          )}
          <button onClick={() => setExitRequest(true)} className="w-full h-10 text-red-500 font-bold text-xs uppercase tracking-[0.2em] active:bg-red-50 rounded-xl">Prüfung Abbrechen</button>
        </footer>
      </div>
    );
  }
  return null;
};

export default App;
