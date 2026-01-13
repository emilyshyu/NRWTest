
import { QuestionData } from '../types';

const rawCsvData = [
  [1, "In Deutschland dürfen Menschen offen etwas gegen die Regierung sagen; weil ...", "hier Religionsfreiheit gilt.", "die Menschen Steuern zahlen.", "die Menschen das Wahlrecht haben.", "hier Meinungsfreiheit gilt.", "hier Meinungsfreiheit gilt."],
  [1, "在德國，人們可以公開發表反對政府的言論，因為...", "這裡實行宗教信仰自由。", "人們繳納稅款。", "人們擁有選舉權。", "這裡實行言論自由。", "這裡實行言論自由。"],
  [2, "In Deutschland können Eltern bis zum 14. Lebensjahr ihres Kindes entscheiden; ob es ...", "Geschichtsunterricht erhält.", "an religiösen Feiertagen schulfrei hat.", "Politikunterricht erhält.", "am Religionsunterricht teilnimmt.", "am Religionsunterricht teilnimmt."],
  [2, "在德國，父母在孩子滿 14 歲之前可以決定孩子是否...", "接受歷史課教育。", "在宗教節日放假。", "接受政治課教育。", "參加宗教課程。", "參加宗教課程。"],
  [3, "Deutschland ist ein Rechtsstaat. Was ist damit gemeint?", "Alle Einwohner / Einwohnerinnen und der Staat müssen sich an die Gesetze halten.", "Der Staat muss sich nicht an die Gesetze halten.", "Nur Deutsche müssen die Gesetze befolgen.", "Die Gerichte machen die Gesetze.", "Alle Einwohner / Einwohnerinnen und der Staat müssen sich an die Gesetze halten."],
  [3, "德國是一個法治國家 (Rechtsstaat)。這是什麼意思？", "所有居民和國家都必須遵守法律。", "國家不需要遵守法律。", "只有德國人必須遵守法律。", "法院制定法律。", "所有居民和國家都必須遵守法律。"],
  [4, "Welches Recht gehört zu den Grundrechten in Deutschland?", "Waffenbesitz", "Faustrecht", "Meinungsfreiheit", "Selbstjustiz", "Meinungsfreiheit"],
  [4, "哪項權利屬於德國的基本權利？", "持有武器", "拳頭即公理 (強權即公理)", "言論自由", "私刑 (自行執法)", "言論自由"],
  [5, "Wahlen in Deutschland sind frei. Was bedeutet das?", "Man darf Geld annehmen; wenn man dafür einen bestimmten Kandidaten / eine bestimmte Kandidatin wählt.", "Der Wähler darf bei der Wahl weder beeinflusst noch zu einer bestimmten Stimmabgabe gezwungen werden.", "Nur Personen; die noch nie im Gefängnis waren; dürfen wählen.", "Alle wahlberechtigten Personen müssen wählen.", "Der Wähler darf bei der Wahl weder beeinflusst noch zu einer bestimmten Stimmabgabe gezwungen werden."],
  [5, "德國的選舉是自由的。這意味著什麼？", "如果選某個特定候選人，可以接受金錢。", "選民在投票時不得受影響，也不得被迫投給特定對象。", "只有從未入獄的人才能投票。", "所有有投票權的人都必須投票。", "選民在投票時不得受影響，也不得被迫投給特定對象。"],
  [6, "Wie heißt die deutsche Verfassung?", "Volksgesetz", "Bundesgesetz", "Deutsches Gesetz", "Grundgesetz", "Grundgesetz"],
  [6, "德國的憲法叫什麼？", "人民法 (Volksgesetz)", "聯邦法 (Bundesgesetz)", "德國法 (Deutsches Gesetz)", "基本法 (Grundgesetz)", "基本法 (Grundgesetz)"],
  [7, "Welches Recht gehört zu den Grundrechten; die nach der deutschen Verfassung garantiert werden?", "Glaubens- und Gewissensfreiheit", "Unterhaltungsfreiheit", "Arbeitsfreiheit", "Wohnungsfreiheit", "Glaubens- und Gewissensfreiheit"],
  [7, "哪項權利屬於德國憲法保障的基本權利？", "信仰和良知自由", "娛樂自由", "工作自由", "住房自由", "信仰和良知自由"],
  [8, "Was steht nicht im Grundgesetz von Deutschland?", "Die Würde des Menschen ist unantastbar.", "Alle sollen gleich viel Geld haben.", "Jeder Mensch hat das Recht auf Leben und körperliche Unversehrtheit.", "Niemand darf wegen seines Geschlechtes benachteiligt werden.", "Alle sollen gleich viel Geld haben."],
  [8, "哪一項不在德國基本法中？", "人性尊嚴不可侵犯。", "所有人都應擁有相同數量的金錢。", "人人有權享有生命和身體完整。", "任何人不得因性別而受歧視。", "所有人都應擁有相同數量的金錢。"],
  [9, "Welches Grundrecht gilt in Deutschland nur für Ausländer / Ausländerinnen? Das Grundrecht auf ...", "Schutz der Familie", "Menschenwürde", "Asyl", "Meinungsfreiheit", "Asyl"],
  [9, "哪項基本權利在德國僅適用於外國人？", "保護家庭", "人性尊嚴", "庇護 (Asyl)", "言論自由", "庇護 (Asyl)"],
  [10, "Was ist mit dem deutschen Grundgesetz vereinbar?", "Die Prügelstrafe", "Die Folter", "Die Todesstrafe", "Die Geldstrafe", "Die Geldstrafe"],
  [10, "哪一項符合德國基本法？", "體罰", "酷刑", "死刑", "罰款 (Geldstrafe)", "罰款 (Geldstrafe)"],
  [11, "Wie wird die Verfassung der Bundesrepublik Deutschland genannt?", "Grundgesetz", "Bundesverfassung", "Gesetzbuch", "Verfassungsvertrag", "Grundgesetz"],
  [11, "德意志聯邦共和國的憲法被稱為什麼？", "基本法", "聯邦憲法", "法典", "憲法條約", "基本法"],
  [12, "Eine Partei im Deutschen Bundestag want die Pressefreiheit abschaffen. Ist das möglich?", "Ja; wenn mehr als die Hälfte der Abgeordneten im Bundestag dafür sind.", "Ja; aber dazu müssen zwei Drittel der Abgeordneten im Bundestag dafür sein.", "Nein; denn die Pressefreiheit ist ein Grundrecht und kann nicht abgeschafft werden.", "Nein; denn nur der Bundesrat kann die Pressefreiheit abschaffen.", "Nein; denn die Pressefreiheit ist ein Grundrecht und kann nicht abgeschafft werden."],
  [12, "德國聯邦議院中的一個政黨想要廢除新聞自由。這可能嗎？", "是的，如果超過一半的議員贊成。", "是的，但必須有三分之二的議員贊成。", "不，因為新聞自由是基本權利，不能被廢除。", "不，因為只有聯邦參議院才能廢除新聞自由。", "不，因為新聞自由是基本權利，不能被廢除。"]
];

const mockTemplates = [
  { de: "Wer wählt den Bundeskanzler?", zh: "誰選舉聯邦總理？", d_opts: ["Der Bundestag", "Das Volk", "Der Bundesrat", "Der Bundespräsident"], z_opts: ["聯邦議院", "人民", "聯邦參議院", "聯邦總統"] },
  { de: "Was ist die Hauptstadt von Deutschland?", zh: "德國的首都是哪裡？", d_opts: ["Berlin", "Bonn", "München", "Hamburg"], z_opts: ["柏林", "波昂", "慕尼黑", "漢堡"] },
  { de: "Welches Organ gehört zur Judikative?", zh: "哪個機構屬於司法機關？", d_opts: ["Die Gerichte", "Die Polizei", "Die Regierung", "Das Parlament"], z_opts: ["法院", "警察", "政府", "議會"] },
  { de: "Wie viele Bundesländer hat Deutschland?", zh: "德國有多少個聯邦州？", d_opts: ["16", "10", "12", "14"], z_opts: ["16", "10", "12", "14"] },
  { de: "Wann feiert man den Tag der Deutschen Einheit?", zh: "德國統一日是哪一天？", d_opts: ["3. Oktober", "1. Mai", "17. Juni", "9. November"], z_opts: ["10月3日", "5月1日", "6月17日", "11月9日"] },
  { de: "Wer ist das Staatsoberhaupt von Deutschland?", zh: "德國的國家元首是誰？", d_opts: ["Der Bundespräsident", "Der Bundeskanzler", "Der König", "Der Papst"], z_opts: ["聯邦總統", "聯邦總理", "國王", "教宗"] },
  { de: "Welches Recht ist ein Grundrecht?", zh: "哪項權利是基本權利？", d_opts: ["Religionsfreiheit", "Waffenbesitz", "Steuerfreiheit", "Fahrverbot"], z_opts: ["宗教自由", "持有武器", "免稅權", "禁駕權"] },
  { de: "Was bedeutet Volkssouveränität?", zh: "主權在民意味著什麼？", d_opts: ["Alle Staatsgewalt geht vom Volke aus.", "Der König bestimmt.", "Nur Reiche wählen.", "Die Kirche regiert."], z_opts: ["一切權力來自人民", "國王決定", "僅富人投票", "教會執政"] },
  { de: "Wer schreibt die Gesetze in Deutschland?", zh: "在德國誰制定法律？", d_opts: ["Das Parlament", "Die Polizei", "Die Armee", "Die Zeitungen"], z_opts: ["議會", "警察", "軍隊", "報社"] },
  { de: "Was ist ein Merkmal eines Rechtsstaats?", zh: "法治國家的特徵是什麼？", d_opts: ["Der Staat muss sich an Gesetze halten.", "Die Polizei darf alles.", "Es gibt keine Anwälte.", "Nur Beamte haben Rechte."], z_opts: ["國家必須遵守法律", "警察可以做任何事", "沒有律師", "僅官員有權利"] },
  { de: "Welches Tier ist im Bundeswappen?", zh: "國徽上是什麼動物？", d_opts: ["Ein Adler", "Ein Bär", "Ein Löwe", "Ein Pferd"], z_opts: ["一隻老鷹", "一隻熊", "一隻獅子", "一隻馬"] },
  { de: "Was bedeutet Föderalismus?", zh: "聯邦制意味著什麼？", d_opts: ["Aufteilung in Bundesländer", "Ein Einheitsstaat", "Eine Diktatur", "Keine Regierung"], z_opts: ["劃分為多個聯邦州", "單一制國家", "獨裁統治", "沒有政府"] }
];

const processQuestions = (): QuestionData[] => {
  const result: QuestionData[] = [];
  for (let i = 0; i < rawCsvData.length; i += 2) {
    const deRow = rawCsvData[i];
    const zhRow = rawCsvData[i + 1];
    if (!deRow || !zhRow) break;
    const optionsDe = [deRow[2] as string, deRow[3] as string, deRow[4] as string, deRow[5] as string];
    const answerDe = deRow[6] as string;
    const answerIndex = optionsDe.indexOf(answerDe);
    result.push({
      id: deRow[0] as number,
      questionDe: deRow[1] as string,
      questionZh: zhRow[1] as string,
      optionsDe,
      optionsZh: [zhRow[2] as string, zhRow[3] as string, zhRow[4] as string, zhRow[5] as string],
      answerIndex: answerIndex === -1 ? 0 : answerIndex
    });
  }
  
  const lastRealId = result[result.length - 1]?.id || 0;
  for (let j = lastRealId + 1; j <= 317; j++) {
    const template = mockTemplates[j % mockTemplates.length];
    const ansIdx = (j * 13) % 4; // Use a prime to vary answer distribution better
    const optionsDe = [...template.d_opts];
    const optionsZh = [...template.z_opts];
    [optionsDe[0], optionsDe[ansIdx]] = [optionsDe[ansIdx], optionsDe[0]];
    [optionsZh[0], optionsZh[ansIdx]] = [optionsZh[ansIdx], optionsZh[0]];

    result.push({
      id: j,
      questionDe: `[Frage ${j}] ${template.de}`,
      questionZh: `[問題 ${j}] ${template.zh}`,
      optionsDe,
      optionsZh,
      answerIndex: ansIdx
    });
  }
  return result;
};

export const allQuestions = processQuestions();
