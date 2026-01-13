
import { QuestionData } from '../types';

const rawCsvData = [
  [1, "In Deutschland dürfen Menschen offen etwas gegen die Regierung sagen; weil ...", "hier Religionsfreiheit gilt.", "die Menschen Steuern zahlen.", "die Menschen das Wahlrecht haben.", "hier Meinungsfreiheit gilt.", "hier Meinungsfreiheit gilt."],
  [1, "在德國，人們可以公開發表反對政府的言論，因為...", "這裡實行宗教信仰自由。", "人們繳納稅款。", "人們擁有選舉權。", "這裡實行言論自由。", "這裡實行言論自由。"],
  [2, "In Deutschland können Eltern bis zum 14. Lebensjahr ihres Kindes entscheiden; ob es ...", "Geschichtsunterricht erhält.", "an religiösen Feiertagen schulfrei hat.", "Politikunterricht erhält.", "am Religionsunterricht nimmt.", "am Religionsunterricht nimmt."],
  [2, "在德國，父母在孩子滿 14 歲之前可以決定孩子是否...", "接受歷史課教育。", "在宗教節日放假。", "接受政治課教育。", "參加宗教課程。", "參加宗教課程。"],
  [3, "Deutschland ist ein Rechtsstaat. Was ist damit gemeint?", "Alle Einwohner und der Staat müssen sich an die Gesetze halten.", "Der Staat muss sich nicht an die Gesetze halten.", "Nur Deutsche müssen die Gesetze befolgen.", "Die Gerichte machen die Gesetze.", "Alle Einwohner und der Staat müssen sich an die Gesetze halten."],
  [3, "德國是一個法治國家 (Rechtsstaat)。這是什麼意思？", "所有居民和國家都必須遵守法律。", "國家不需要遵守法律。", "只有德國人必須遵守法律。", "法院制定法律。", "所有居民和國家都必須遵守法律。"],
  [4, "Welches Recht gehört zu den Grundrechten in Deutschland?", "Waffenbesitz", "Faustrecht", "Meinungsfreiheit", "Selbstjustiz", "Meinungsfreiheit"],
  [4, "哪項權利屬於德國的基本權利？", "持有武器", "強權即公理", "言論自由", "私刑 (自行執法)", "言論自由"],
  [5, "Wahlen in Deutschland sind frei. Was bedeutet das?", "Man darf Geld annehmen.", "Der Wähler darf weder beeinflusst noch zu einer bestimmten Stimmabgabe gezwungen werden.", "Nur Personen ohne Gefängnisstrafe dürfen wählen.", "Alle müssen wählen.", "Der Wähler darf weder beeinflusst noch zu einer bestimmten Stimmabgabe gezwungen werden."],
  [5, "德國的選舉是自由的。這意味著什麼？", "可以接受金錢投票。", "選民在投票時不得受影響，也不得被迫投給特定對象。", "只有從未入獄的人才能投票。", "所有人都必須投票。", "選民在投票時不得受影響，也不得被迫投給特定對象。"],
  [6, "Wie heißt die deutsche Verfassung?", "Volksgesetz", "Bundesgesetz", "Deutsches Gesetz", "Grundgesetz", "Grundgesetz"],
  [6, "德國的憲法叫什麼？", "人民法", "聯邦法", "德國法", "基本法", "基本法"],
  [7, "Welches Recht wird nach der deutschen Verfassung garantiert?", "Glaubens- und Gewissensfreiheit", "Unterhaltungsfreiheit", "Arbeitsfreiheit", "Wohnungsfreiheit", "Glaubens- und Gewissensfreiheit"],
  [7, "哪項權利受到德國憲法保障？", "信仰和良知自由", "娛樂自由", "工作自由", "住房自由", "信仰和良知自由"],
  [8, "Was steht nicht im Grundgesetz von Deutschland?", "Die Würde des Menschen ist unantastbar.", "Alle sollen gleich viel Geld haben.", "Jeder Mensch hat das Recht auf Leben.", "Niemand darf wegen seines Geschlechtes benachteiligt werden.", "Alle sollen gleich viel Geld haben."],
  [8, "哪一項**不**在德國基本法中？", "人性尊嚴不可侵犯。", "所有人都應擁有相同數量的金錢。", "人人有權享有生命。", "任何人不得因性別而受歧視。", "所有人都應擁有相同數量的金錢。"],
  [9, "Welches Grundrecht gilt in Deutschland nur für Ausländer?", "Schutz der Familie", "Menschenwürde", "Asyl", "Meinungsfreiheit", "Asyl"],
  [9, "哪項基本權利在德國僅適用於外國人？", "保護家庭", "人性尊嚴", "庇護 (Asyl)", "言論自由", "庇護 (Asyl)"],
  [10, "Was ist mit dem deutschen Grundgesetz vereinbar?", "Die Prügelstrafe", "Die Folter", "Die Todesstrafe", "Die Geldstrafe", "Die Geldstrafe"],
  [10, "哪一項符合德國基本法？", "體罰", "酷刑", "死刑", "罰款 (Geldstrafe)", "罰款 (Geldstrafe)"]
];

const mockThemes = [
  { de: "Was ist die Hauptstadt von Deutschland?", zh: "德國的首都是哪裡？", d: ["Berlin", "Bonn", "München", "Hamburg"], z: ["柏林", "波昂", "慕尼黑", "漢堡"] },
  { de: "Wer wählt den Bundeskanzler?", zh: "誰選舉聯邦總理？", d: ["Der Bundestag", "Das Volk", "Der Bundesrat", "Der Bundespräsident"], z: ["聯邦議院", "人民", "聯邦參議院", "聯邦總統"] },
  { de: "Wie viele Bundesländer hat Deutschland?", zh: "德國有多少個聯邦州？", d: ["16", "10", "12", "14"], z: ["16", "10", "12", "14"] },
  { de: "Welches Tier ist im Bundeswappen?", zh: "國徽上是什麼動物？", d: ["Ein Adler", "Ein Bär", "Ein Löwe", "Ein Pferd"], z: ["一隻老鷹", "一隻熊", "一隻獅子", "一隻馬"] },
  { de: "Wann feiert man den Tag der Deutschen Einheit?", zh: "德國統一日是哪一天？", d: ["3. Oktober", "1. Mai", "17. Juni", "9. November"], z: ["10月3日", "5月1日", "6月17日", "11月9日"] },
  { de: "Wer ist das Staatsoberhaupt von Deutschland?", zh: "德國的國家元首是誰？", d: ["Der Bundespräsident", "Der Bundeskanzler", "Der Papst", "Der Kaiser"], z: ["聯邦總統", "聯邦總理", "教宗", "皇帝"] },
  { de: "Welches Organ gehört zur Judikative?", zh: "哪個機構屬於司法機關？", d: ["Die Gerichte", "Die Polizei", "Die Regierung", "Das Parlament"], z: ["法院", "警察", "政府", "議會"] },
  { de: "Was bedeutet Religionsfreiheit?", zh: "宗教自由意味著什麼？", d: ["Jeder darf seine Religion frei wählen.", "Alle müssen in die Kirche.", "Der Staat bestimmt die Religion.", "Keine Religion ist erlaubt."], z: ["每個人都可以自由選擇宗教。", "所有人都必須去教堂。", "國家決定宗教。", "不允許任何宗教。"] }
];

const processQuestions = (): QuestionData[] => {
  const result: QuestionData[] = [];
  
  // Real Data
  for (let i = 0; i < rawCsvData.length; i += 2) {
    const d = rawCsvData[i];
    const z = rawCsvData[i + 1];
    if (!d || !z) break;
    const opts = [d[2] as string, d[3] as string, d[4] as string, d[5] as string];
    const correct = d[6] as string;
    result.push({
      id: d[0] as number,
      questionDe: d[1] as string,
      questionZh: z[1] as string,
      optionsDe: opts,
      optionsZh: [z[2] as string, z[3] as string, z[4] as string, z[5] as string],
      answerIndex: opts.indexOf(correct) === -1 ? 0 : opts.indexOf(correct)
    });
  }
  
  // Mock Data to 317
  const lastId = result[result.length - 1]?.id || 0;
  for (let j = lastId + 1; j <= 317; j++) {
    const theme = mockThemes[j % mockThemes.length];
    const ansIdx = (j * 17) % 4; // Varying answer distribution
    
    const optionsDe = [...theme.d];
    const optionsZh = [...theme.z];
    
    // Swap original correct (at 0) to random target index
    [optionsDe[0], optionsDe[ansIdx]] = [optionsDe[ansIdx], optionsDe[0]];
    [optionsZh[0], optionsZh[ansIdx]] = [optionsZh[ansIdx], optionsZh[0]];

    result.push({
      id: j,
      questionDe: `[Frage ${j}] ${theme.de}`,
      questionZh: `[問題 ${j}] ${theme.zh}`,
      optionsDe,
      optionsZh,
      answerIndex: ansIdx
    });
  }
  
  return result;
};

export const allQuestions = processQuestions();
