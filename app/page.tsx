"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  Droplet,
  Sparkles,
  Clock,
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle,
  MessageSquare,
  AlertTriangle,
  Leaf,
  Smile,
  Compass,
  Search,
  Send,
  History,
  Eye,
  Heart,
  FileText,
  ShieldAlert,
  Menu,
  ChevronRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// --- INTERFACES & CONNOTATIONS ---

interface ProgressLog {
  id: string;
  date: string;
  note: string;
  photo?: string;
}

interface PestCheck {
  id: string;
  date: string;
  issueName: string;
  severity: string; // "Baixa" | "Média" | "Crítica"
  remedy: string;
  symptoms: string[];
  preventiveAdvice?: string;
}

interface Plant {
  id: string;
  commonName: string;
  botanicalName: string;
  confidence: string;
  description: string;
  lightNeed: string;
  wateringFrequency: string;
  wateringIntervalDays: number;
  quickTips: string[];
  warning: string;
  registrationDate: string;
  photo: string; // Presetted URL or base64
  lastWateredDate: string; // ISO String
  progressLogs: ProgressLog[];
  pestChecks: PestCheck[];
}

interface ForumThread {
  id: string;
  question: string;
  plantContext?: string;
  author: string;
  date: string;
  expertName: string;
  expertRole: "seu_sebastiao" | "dona_flor";
  answer: string;
  likes: number;
  liked?: boolean;
}

// --- CONSTANTS & PRE-SEEDED DATA FOR A PERFECT FIRST EXPERIENSE ---

const SAMPLE_PLANTS_FOR_SCAN = [
  {
    id: "demo-jiboia",
    name: "Jiboia (Epipremnum aureum)",
    commonName: "Jiboia Amarela",
    botanicalName: "Epipremnum aureum",
    confidence: "98% (Identificação instantânea)",
    description: "Uma trepadeira super resistente de folhagem verde e amarelada em coração, perfeita para iniciar sua selva urbana brasileira.",
    lightNeed: "Luz difusa (perto de janelas boas mas livre de sol direto forte das 12h)",
    wateringFrequency: "Regar generosamente quando os primeiros 3cm de solo estiverem totalmente secos. Não gosta de pratinhos com água parada.",
    wateringIntervalDays: 6,
    quickTips: [
      "Limpe a poeira das folhas com pano úmido mensalmente para otimizar a fotossíntese.",
      "Evite solos compactados; misture fibra de coco para ficar bem soltinho.",
      "Se as folhas amolecerem muito, ela precisa urgentemente de água!"
    ],
    warning: "⚠️ Atenção: Tóxica para cães e gatos! Mantenha pendurada no alto.",
    photo: "https://picsum.photos/seed/jiboia/500/500",
  },
  {
    id: "demo-espada",
    name: "Espada de São Jorge (Sansevieria trifasciata)",
    commonName: "Espada de São Jorge",
    botanicalName: "Sansevieria trifasciata",
    confidence: "95% (Forte correlação estrutural)",
    description: "Planta escultural, purificadora de ar e praticamente indestrutível. Suporta luz fraca e longos períodos de seca.",
    lightNeed: "Sobrevive em sombras completas, mas ama claridade brilhante.",
    wateringFrequency: "Rega escassa. Espere o substrato secar por completo antes de regar novamente. Melhor errar para menos.",
    wateringIntervalDays: 14,
    quickTips: [
      "Nunca jogue água diretamente no miolo da roseta para não apodrecer.",
      "Use vasos de argila cozida para ajudar a drenar o excesso de umidade.",
      "Troque de vaso apenas quando as raízes começarem a quebrar o plástico."
    ],
    warning: "⚠️ Seguro moderadamente inflamável, mas tóxica por ingestão para pets.",
    photo: "https://picsum.photos/seed/espada/500/500",
  },
  {
    id: "demo-cacto",
    name: "Cacto Coração (Hoya kerrii)",
    commonName: "Flor de Cera Coração",
    botanicalName: "Hoya kerrii",
    confidence: "92% (Excelente formato anatômico)",
    description: "Uma trepadeira de folhas incrivelmente espessas e em formato perfeito de coração tridimensional.",
    lightNeed: "Muita luz indireta ou sol levinho da manhã por 2 horas.",
    wateringFrequency: "Riqueza em silêncio. Molhar quinzenalmente no verão e uma vez por mês no inverno.",
    wateringIntervalDays: 18,
    quickTips: [
      "Não enterre a canela da folha muito fundo na terra para evitar apodrecimento por umidade.",
      "Adube com fertilizante orgânico leve apenas na primavera/verão.",
      "Se a folha murchar ou enrugar, é sede leve acumulada."
    ],
    warning: "💚 100% Amigável e segura para bichinhos de estimação!",
    photo: "https://picsum.photos/seed/hoya/500/500",
  }
];

const PRE_SEEDED_PLANTS: Plant[] = [
  {
    id: "plant-1",
    commonName: "Jiboia Carioca",
    botanicalName: "Epipremnum aureum",
    confidence: "Histórico de Cadastro Falso",
    description: "Minha primeira plantinha que comprei na feira do bairro. Fica super charmosa caindo da estante da sala.",
    lightNeed: "Meia Sombra (perto da janela)",
    wateringFrequency: "Aproximadamente a cada 6 dias, testando a terra com o dedo.",
    wateringIntervalDays: 6,
    quickTips: [
      "Borrifar um pouco de água nas folhas nos dias mais secos e quentes do ano.",
      "Folhas amarelas moles são sinal de água demais na raiz. Manere!",
      "Limpe as frentes das folhas para o brilho voltar natural."
    ],
    warning: "⚠️ Tóxica para cães e gatos. Deixe no alto das prateleiras!",
    registrationDate: "2026-05-18T10:00:00.000Z",
    photo: "https://picsum.photos/seed/vibrantjiboia/500/500",
    lastWateredDate: "2026-05-19T14:00:00.000Z", // Regada ontem
    progressLogs: [
      {
        id: "log-1-1",
        date: "2026-05-18T10:15:00.000Z",
        note: "Chegou em casa! Coloquei no vaso decorativo verde de cerâmica e pendurei na sala de estar.",
        photo: "https://picsum.photos/seed/vibrantjiboia/300/300"
      }
    ],
    pestChecks: []
  },
  {
    id: "plant-2",
    commonName: "Zamioculca da Sorte",
    botanicalName: "Zamioculcas zamiifolia",
    confidence: "99% Inteligência Artificial",
    description: "Foliagem verde escura lustrosa super resistente que se dá incrivelmente bem em cantos com pouca circulação e sombra.",
    lightNeed: "Luz baixa ou sombra moderada. Perfeita para escritórios.",
    wateringFrequency: "Só regue de 12 em 12 dias. Ela armazena água nos batatas das raízes.",
    wateringIntervalDays: 12,
    quickTips: [
      "Não use produtos de dar brilho artificial; elas brilham naturalmente.",
      "Regue apenas se o vaso estiver extremamente leve de terra seca.",
      "Drenagem excelente é crucial. Nunca deixe acumular prato d'água embaixo."
    ],
    warning: "⚠️ Tóxica para pets! Coloque em mesas altas longe do acesso de gatinhos saltadores.",
    registrationDate: "2026-05-15T08:30:00.000Z",
    photo: "https://picsum.photos/seed/zami/500/500",
    lastWateredDate: "2026-05-10T12:00:00.000Z", // Já precisa regar! (12 dias atrás era dia 10, hoje é 20)
    progressLogs: [
      {
        id: "log-2-1",
        date: "2026-05-15T08:40:00.000Z",
        note: "Comprei no garden center. Ela já veio bem cheia e saudável. Solo arenoso.",
      },
      {
        id: "log-2-2",
        date: "2026-05-17T11:00:00.000Z",
        note: "Reguei um pouquinho até escorrer pelos furos. Deixei escorrer bem antes de voltar ao prato.",
      }
    ],
    pestChecks: []
  }
];

const PRE_SEEDED_FORUM_THREADS: ForumThread[] = [
  {
    id: "thread-1",
    question: "Minha Lavanda secou inteira do nada e as folhas estão cinzas. O que fiz de errado?",
    plantContext: "Lavanda (Alfazema)",
    author: "Bruna Silva",
    date: "A 2 dias atrás",
    expertName: "Seu Sebastião 👴",
    expertRole: "seu_sebastiao",
    answer: "Ah, Bruna minha filha... A lavanda é uma planta do Mediterrâneo, ela quer sol direto o dia todinho curtindo o vento da janela, sabe? E se você regar ela todo dia com a terra úmida cozinhando as raízes, ela murcha e seca como se estivesse com sede, mas na verdade as raicorinhas se afogaram. Pare as regas urgentes, leve ela para o lugar mais ensolarado de casa e só molhe quando a terra estiver seca parecendo deserto!",
    likes: 18,
    liked: false
  },
  {
    id: "thread-2",
    question: "Estou querendo montar uma Urban Jungle no meu apartamento de 40m². Quais plantinhas aguentam salas com ar condicionado ligado à noite?",
    plantContext: "Plantas de sombra e apartamento",
    author: "Thiago G.",
    date: "A 4 dias atrás",
    expertName: "Dona Flor 👩",
    expertRole: "dona_flor",
    answer: "Thiago! Super possível ter sua floresta! Para locais com ar condicionado, evite plantas delicadas que exigem umidade extrema no ar como as Calatheas ou Samambaias finas. Opte pela Zamioculca, Espada de São Jorge e as amadas Jiboias de copa grossa. Dica de ouro de blogueira: coloque vasos de argila perto de recipientes de água ou use umidificador de ar ligado no mínimo para contrabalançar o ressecamento do ar condicionado! Beijos e boa selva!",
    likes: 29,
    liked: true
  }
];

const SAMPLE_PESTS_FOR_SCREEN = [
  {
    id: "pest-cochonilha",
    name: "Algodão Branco (Cochonilha de Algodão)",
    issueName: "Cochonilha de Algodão",
    severity: "Média",
    symptoms: ["Pequenos tufos brancos semelhantes a algodão nos nós das folhas", "Folhas murchas e pegajosas", "Presença de formigas subindo pelo caule"],
    remedy: "Faça uma solução de 1 colher de sopa de sabão de coco ralado ou detergente neutro dissolvido em 1 litro de água morna. Deixe esfriar, junte 2 colheres de álcool comum e borrife bem por baixo das folhas todos os fins de tarde até sumir.",
    preventiveAdvice: "Cochonilhas adoram plantas estressadas com falta de luz ou vento abafado. Melhore a circulação de ar do cômodo."
  },
  {
    id: "pest-excesso",
    name: "Folhas Amarelas e Moles (Excesso de Umidade)",
    issueName: "Sufocamento de Raiz por Excesso de Rega",
    severity: "Crítica",
    symptoms: ["Folhas inferiores amarelando por completo simultaneamente", "Solo cheirando a terra mofada ou podre", "Hastes moles ao apertar na base"],
    remedy: "Suspenda o regador! Retire a planta do vaso, limpe com jeitinho a terra encharcada ao redor das raízes. Se tiver raiz preta e fedida, corte com tesoura limpa. Replante em terra nova super drenável com furos e não molhe por pelo menos 10 dias.",
    preventiveAdvice: "Use o teste do palito ou do dedo antes de regar: se sair terra úmida colada no palito, NÃO regue."
  }
];

// --- PURITY-COMPLIANT HELPER GENERATORS BEYOND COMPONENT SCOPE ---
function makeUniqueId(prefix: string): string {
  if (typeof window === "undefined") return `${prefix}-ssr`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getNowISO(): string {
  return new Date().toISOString();
}

export default function Home() {
  // --- STATE SYSTEM ---
  const [activeTab, setActiveTab] = useState<"garden" | "scan" | "health" | "forum">("garden");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Detail Modal State
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  // Scanning / Uploading States
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  
  // Health Spotter state
  const [healthImage, setHealthImage] = useState<string | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [healthResult, setHealthResult] = useState<any | null>(null);
  
  // Forum Post states
  const [forumQuestion, setForumQuestion] = useState("");
  const [forumPlantContext, setForumPlantContext] = useState("");
  const [forumRole, setForumRole] = useState<"seu_sebastiao" | "dona_flor">("seu_sebastiao");
  const [isForumSubmitLoading, setIsForumSubmitLoading] = useState(false);

  // New Journal Log Form inside Plant Detail
  const [logNote, setLogNote] = useState("");
  const [logPhoto, setLogPhoto] = useState<string | null>(null);

  // System alert / Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  // File Upload Reference for Hidden Input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const healthInputRef = useRef<HTMLInputElement>(null);
  const logPhotoInputRef = useRef<HTMLInputElement>(null);

  // --- INIT DATA & SYNC WITH LOCAL STORAGE ---
  useEffect(() => {
    const loadStateDeferred = () => {
      const storedPlants = localStorage.getItem("folhario_my_garden");
      const storedThreads = localStorage.getItem("folhario_forum_threads");
      
      if (storedPlants) {
        setPlants(JSON.parse(storedPlants));
      } else {
        setPlants(PRE_SEEDED_PLANTS);
        localStorage.setItem("folhario_my_garden", JSON.stringify(PRE_SEEDED_PLANTS));
      }

      if (storedThreads) {
        setForumThreads(JSON.parse(storedThreads));
      } else {
        setForumThreads(PRE_SEEDED_FORUM_THREADS);
        localStorage.setItem("folhario_forum_threads", JSON.stringify(PRE_SEEDED_FORUM_THREADS));
      }
    };

    const timer = setTimeout(loadStateDeferred, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveGardenToLocalStorage = (updatedPlants: Plant[]) => {
    setPlants(updatedPlants);
    localStorage.setItem("folhario_my_garden", JSON.stringify(updatedPlants));
  };

  const saveForumToLocalStorage = (updatedThreads: ForumThread[]) => {
    setForumThreads(updatedThreads);
    localStorage.setItem("folhario_forum_threads", JSON.stringify(updatedThreads));
  };

  // --- SHOW TIMED TOAST ALERT ---
  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // --- CALCULATE WATER REMINDER & STATE ---
  const getWateringStatus = (plant: Plant) => {
    const elapsedDays = Math.floor(
      (new Date(getNowISO()).getTime() - new Date(plant.lastWateredDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = plant.wateringIntervalDays - elapsedDays;
    
    let percent = Math.max(0, Math.min(100, Math.round(((plant.wateringIntervalDays - elapsedDays) / plant.wateringIntervalDays) * 100)));
    
    let text = "";
    let urgent = false;
    let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";

    if (daysRemaining <= 0) {
      text = daysRemaining === 0 ? "Regar HOJE!" : `Regar atrasado há ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? "dia" : "dias"}`;
      urgent = true;
      percent = 0;
      badgeColor = "bg-amber-100 text-amber-800 border-amber-300 animate-pulse";
    } else if (daysRemaining === 1) {
      text = "Regar amanhã";
      badgeColor = "bg-amber-50 text-amber-900 border-amber-200";
    } else {
      text = `Tudo certo (mais ${daysRemaining} dias)`;
    }

    return { daysRemaining, text, percent, urgent, badgeColor };
  };

  // --- ACTIONS: WATER THE PLANT! ---
  const handleWaterPlant = (plantId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation(); // Avoid opening the detail page
    const nowISO = getNowISO();
    const updated = plants.map((p) => {
      if (p.id === plantId) {
        // Adding automatic water log in diary
        const newLog: ProgressLog = {
          id: makeUniqueId("water-log"),
          date: nowISO,
          note: "💦 Regada hoje! Marcado via lembrete rápido.",
        };
        return {
          ...p,
          lastWateredDate: nowISO,
          progressLogs: [newLog, ...p.progressLogs],
        };
      }
      return p;
    });
    
    saveGardenToLocalStorage(updated);
    
    // Also update selected plant model if opened
    if (selectedPlant && selectedPlant.id === plantId) {
      const liveUpdate = updated.find((p) => p.id === plantId);
      if (liveUpdate) setSelectedPlant(liveUpdate);
    }
    
    triggerToast("Planta regada com carinho! Lembrete reiniciado. 🌱✨", "success");
  };

  // --- ACTION: DELETE A PLANT ---
  const handleDeletePlant = (plantId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm("Quer mesmo remover esta planta de 'Meu Jardim'? Suas notas e fotos do diário serão perdidas.")) {
      const updated = plants.filter((p) => p.id !== plantId);
      saveGardenToLocalStorage(updated);
      setSelectedPlant(null);
      triggerToast("Planta removida do Meu Jardim.", "info");
    }
  };

  // --- IMAGE HELPERS ---
  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ACTION: SEND TO IDENTIFICATION ENDPOINT ---
  const startPlantDetection_RealAPI = async (imgData: string) => {
    setIsScanLoading(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData }),
      });
      const data = await res.json();
      if (res.ok) {
        setScanResult(data);
        triggerToast("Planta identificada com sucesso!", "success");
      } else {
        triggerToast(data.error || "Ocorreu um erro ao consultar o servidor.", "error");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast("Falha de conexão com a IA do Folhário.", "error");
    } finally {
      setIsScanLoading(false);
    }
  };

  // --- ACTION: CONVERT QUICK SAMPLES INSTANTLY (UX FRIENDLY BYPASSING CAM DIFFICULTIES) ---
  const handleTryScanSample = (sample: typeof SAMPLE_PLANTS_FOR_SCAN[0]) => {
    setScanImage(sample.photo);
    setScanResult({
      commonName: sample.commonName,
      botanicalName: sample.botanicalName,
      confidence: sample.confidence,
      description: sample.description,
      lightNeed: sample.lightNeed,
      wateringFrequency: sample.wateringFrequency,
      wateringIntervalDays: sample.wateringIntervalDays,
      quickTips: sample.quickTips,
      warning: sample.warning
    });
    triggerToast(`Exemplo de ${sample.commonName} carregado com sucesso!`, "success");
  };

  // --- ACTION: SAVE SCAN TO MY GARDEN ---
  const handleSaveScannedResultToGarden = () => {
    if (!scanResult) return;
    
    const nowISO = getNowISO();
    const newPlant: Plant = {
      id: makeUniqueId("plant"),
      commonName: scanResult.commonName,
      botanicalName: scanResult.botanicalName,
      confidence: scanResult.confidence || "Identificação por IA",
      description: scanResult.description,
      lightNeed: scanResult.lightNeed,
      wateringFrequency: scanResult.wateringFrequency,
      wateringIntervalDays: scanResult.wateringIntervalDays || 7,
      quickTips: scanResult.quickTips || [],
      warning: scanResult.warning || "Livre para pets",
      registrationDate: nowISO,
      photo: scanImage || "https://picsum.photos/seed/folha/500/500",
      lastWateredDate: nowISO, // Regada agora no registro
      progressLogs: [
        {
          id: makeUniqueId("log-new"),
          date: nowISO,
          note: `🎉 Cadastrada no Meu Jardim! Identificada inicialmente como ${scanResult.commonName}.`
        }
      ],
      pestChecks: []
    };

    const updated = [newPlant, ...plants];
    saveGardenToLocalStorage(updated);
    
    // Reset scanner
    setScanImage(null);
    setScanResult(null);
    
    triggerToast(`${newPlant.commonName} foi adicionada ao seu Jardim! 🏡🍀`, "success");
    setActiveTab("garden");
  };

  // --- PEST SEARCH / DIAGNOSIS COGNITIVE ---
  const handleTryPestSample = (sample: typeof SAMPLE_PESTS_FOR_SCREEN[0]) => {
    setHealthImage("https://picsum.photos/seed/pestleaf/500/500");
    setHealthResult({
      issueFound: true,
      issueName: sample.issueName,
      severity: sample.severity,
      symptoms: sample.symptoms,
      remedy: sample.remedy,
      preventiveAdvice: sample.preventiveAdvice
    });
    triggerToast("Caso clínico simulado carregado!", "success");
  };

  const startPestAnalysis_RealAPI = async (imgData: string) => {
    setIsHealthLoading(true);
    setHealthResult(null);
    try {
      const res = await fetch("/api/analyse-pest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData }),
      });
      const data = await res.json();
      if (res.ok) {
        setHealthResult(data);
        triggerToast("Folha analisada. Veja as recomendações!", "success");
      } else {
        triggerToast(data.error || "Ocorreu um erro na análise da folha.", "error");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast("Erro ao se conectar ao laboratório de plantas.", "error");
    } finally {
      setIsHealthLoading(false);
    }
  };

  // Send diagnostic report to an existing plant in garden
  const handleLinkPestToPlant = (plantId: string) => {
    if (!healthResult) return;

    const nowISO = getNowISO();
    const newCheck: PestCheck = {
      id: makeUniqueId("pest-chk"),
      date: nowISO,
      issueName: healthResult.issueName,
      severity: healthResult.severity,
      remedy: healthResult.remedy,
      symptoms: healthResult.symptoms,
      preventiveAdvice: healthResult.preventiveAdvice
    };

    const updated = plants.map((p) => {
      if (p.id === plantId) {
        return {
          ...p,
          pestChecks: [newCheck, ...p.pestChecks],
          // Also append progress note indicating diagnosis
          progressLogs: [
            {
              id: makeUniqueId("log-pest"),
              date: nowISO,
              note: `🩺 Check-up Veterinário de Planta realizado! Diagnóstico: ${healthResult.issueName} (${healthResult.severity}). Remédio urgente: ${healthResult.remedy.substring(0, 100)}...`
            },
            ...p.progressLogs
          ]
        };
      }
      return p;
    });

    saveGardenToLocalStorage(updated);
    triggerToast(`Relatório vinculado ao histórico de cuidados!`, "success");
    setHealthImage(null);
    setHealthResult(null);
    setActiveTab("garden");
  };


  // --- ADD JOURNAL ENTRY (DIÁRIO / PROGRESS LOGS) ---
  const handleAddProgressLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlant || !logNote.trim()) return;

    const newLog: ProgressLog = {
      id: makeUniqueId("log-item"),
      date: getNowISO(),
      note: logNote.trim(),
      photo: logPhoto || undefined
    };

    const updatedPlants = plants.map((p) => {
      if (p.id === selectedPlant.id) {
        return {
          ...p,
          progressLogs: [newLog, ...p.progressLogs]
        };
      }
      return p;
    });

    saveGardenToLocalStorage(updatedPlants);
    
    // Update local opened model too
    const liveUpdate = updatedPlants.find((p) => p.id === selectedPlant.id);
    if (liveUpdate) setSelectedPlant(liveUpdate);

    // Reset fields
    setLogNote("");
    setLogPhoto(null);
    triggerToast("Registrado com sucesso no diário!", "success");
  };


  // --- ASK COMM COMMUNITY CHAT FORUM ---
  const handlePostForumQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumQuestion.trim()) return;

    setIsForumSubmitLoading(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: forumQuestion,
          plantContext: forumPlantContext,
          role: forumRole
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        const newThread: ForumThread = {
          id: makeUniqueId("thread"),
          question: forumQuestion.trim(),
          plantContext: forumPlantContext.trim() || undefined,
          author: "Você (Iniciante)",
          date: "Agora mesmo",
          expertName: forumRole === "seu_sebastiao" ? "Seu Sebastião 👴" : "Dona Flor 👩",
          expertRole: forumRole,
          answer: data.answer,
          likes: 0,
          liked: false
        };

        const updated = [newThread, ...forumThreads];
        saveForumToLocalStorage(updated);
        
        // Clear fields
        setForumQuestion("");
        setForumPlantContext("");
        triggerToast("Dúvida publicada e respondida pelo especialista! 💬", "success");
      } else {
        triggerToast(data.error || "Ocorreu um erro no fórum.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Erro ao contatar o especialista do fórum.", "error");
    } finally {
      setIsForumSubmitLoading(false);
    }
  };

  // --- LIKE THREAD ---
  const handleLikeThread = (threadId: string) => {
    const updated = forumThreads.map((t) => {
      if (t.id === threadId) {
        const likedState = !t.liked;
        return {
          ...t,
          likes: likedState ? t.likes + 1 : t.likes - 1,
          liked: likedState
        };
      }
      return t;
    });
    saveForumToLocalStorage(updated);
  };

  // --- INTERACTIVE SEARCH FILTER ---
  const filteredPlants = plants.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.commonName.toLowerCase().includes(query) ||
      p.botanicalName.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  return (
    <div id="pwa-root" className="min-h-screen bg-stone-100 flex flex-col antialiased">
      {/* Absolute Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast-alert"
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-full shadow-lg border text-sm font-medium ${
              toastType === "success"
                ? "bg-emerald-900 border-emerald-800 text-white"
                : toastType === "error"
                ? "bg-red-900 border-red-800 text-white"
                : "bg-blue-900 border-blue-800 text-white"
            }`}
          >
            <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container framed like a high-end mobile feed, centered on desktop */}
      <div
        id="pwa-frame"
        className="w-full max-w-xl mx-auto flex-1 bg-stone-50 flex flex-col shadow-xl border-x border-stone-200 overflow-hidden relative"
      >
        {/* APP SHELL HEADER */}
        <header id="app-header" className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white px-5 py-6 shrink-0 shadow-md">
          <div className="flex items-center justify-between">
            <div id="app-logo" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center border border-emerald-700">
                <Leaf className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight font-sans">Folhário</h1>
                <p className="text-xs text-emerald-200/80">Seu primeiro jardim orgânico</p>
              </div>
            </div>

            {/* Quick status badge */}
            <div className="text-right">
              <span className="text-[10px] font-mono select-none block bg-emerald-800/60 px-2 py-0.5 rounded border border-emerald-700/50 text-emerald-200">
                marco.machado@gmail.com
              </span>
              <span className="text-[9px] text-emerald-300/90 block mt-1">Acesso PWA Padrão</span>
            </div>
          </div>

          {/* Quick watering summary warning strip if any needed urgently */}
          {plants.some((p) => getWateringStatus(p).daysRemaining <= 0) && (
            <motion.div
              id="water-urgency-banner"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-lg p-2.5 text-xs flex items-center gap-2"
            >
              <Droplet className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="font-medium">
                Tem planta com sede! Faça um carinho regando as pendências no Jardim.
              </span>
            </motion.div>
          )}
        </header>

        {/* WORKSPACE AREA (SCROLLABLE BODY) */}
        <main id="app-main" className="flex-1 overflow-y-auto pb-24 h-0 bg-stone-50/70">
          <AnimatePresence mode="wait">
            {/* TAB 1: MEU JARDIM (MY GARDEN) */}
            {activeTab === "garden" && (
              <motion.div
                key="tab-garden"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.18 }}
                className="p-4 space-y-4"
              >
                {/* Search & Intro */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Buscar por nome da planta..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-stone-700 outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> MEU JARDIM ({filteredPlants.length})
                  </h2>

                  <button
                    id="add-first-plant-header"
                    onClick={() => setActiveTab("scan")}
                    className="text-xs bg-emerald-850 hover:bg-emerald-900 border border-emerald-800 text-emerald-800 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Escanear Nova
                  </button>
                </div>

                {/* Empty State */}
                {filteredPlants.length === 0 && (
                  <div id="garden-empty" className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                      🌵
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800">Seu Jardim está vazio!</h3>
                      <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                        Tire ou envie uma foto de qualquer folhinha na guia &apos;Identificar&apos; para identificá-la pela IA e começar a registrá-la.
                      </p>
                    </div>
                    <button
                      id="empty-action"
                      onClick={() => setActiveTab("scan")}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl py-2 px-4 text-sm font-semibold transition inline-flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" /> Escanear Primeira Planta
                    </button>
                  </div>
                )}

                {/* Grid list of plants */}
                <div id="garden-list" className="space-y-4">
                  {filteredPlants.map((plant) => {
                    const status = getWateringStatus(plant);
                    return (
                      <div
                        id={`plant-item-${plant.id}`}
                        key={plant.id}
                        onClick={() => setSelectedPlant(plant)}
                        className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 transition overflow-hidden shadow-sm flex flex-col cursor-pointer"
                      >
                        {/* Upper area */}
                        <div className="flex p-3.5 gap-3">
                          {/* Image Thumbnail */}
                          <div className="w-20 h-20 rounded-xl relative overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <Image
                              src={plant.photo}
                              alt={plant.commonName}
                              fill
                              unoptimized
                              referrerPolicy="no-referrer"
                              className="object-cover"
                            />
                          </div>

                          {/* Info area */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h3 className="font-bold text-stone-800 text-base truncate pr-1">
                                  {plant.commonName}
                                </h3>
                                <button
                                  id={`delete-btn-${plant.id}`}
                                  onClick={(e) => handleDeletePlant(plant.id, e)}
                                  className="text-stone-300 hover:text-red-650 p-1 rounded transition shrink-0"
                                  title="Remover planta"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="italic text-xs text-stone-400 font-mono truncate">
                                {plant.botanicalName}
                              </p>
                            </div>

                            {/* Status badge */}
                            <div className="mt-1 flex items-center justify-between">
                              <span
                                id="watering-badge"
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.badgeColor}`}
                              >
                                {status.text}
                              </span>
                              
                              <p className="text-[10px] text-stone-400 flex items-center gap-1">
                                <History className="w-3 h-3 text-stone-300" />
                                {plant.progressLogs.length} notas no diário
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Watering Progress Tracker */}
                        <div className="bg-stone-50 border-t border-stone-100 p-2.5 flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 mb-1">
                              <span className="flex items-center gap-1.5">
                                <Droplet className="w-3.5 h-3.5 text-blue-400" />
                                Nível estimado de umidade
                              </span>
                              <span>{status.percent}%</span>
                            </div>
                            {/* Bar scale */}
                            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                              <div
                                id="moisture-fill"
                                className={`h-full rounded-full transition-all duration-300 ${
                                  status.urgent ? "bg-amber-500" : "bg-emerald-600"
                                }`}
                                style={{ width: `${status.percent}%` }}
                              />
                            </div>
                          </div>

                          {/* Quick Water Action Button */}
                          <button
                            id={`water-quick-btn-${plant.id}`}
                            onClick={(e) => handleWaterPlant(plant.id, e)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 shrink-0"
                            title="Registrar rega agora"
                          >
                            <Droplet className="w-3.5 h-3.5 animate-pulse" />
                            Regar hoje
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 2: SCANNER CLIENT IDENTIFY */}
            {activeTab === "scan" && (
              <motion.div
                key="tab-scan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-stone-800">Scanner de Plantas Inteligente</h2>
                  <p className="text-xs text-stone-500">
                    Nossa inteligência artificial analisa o padrão das folhas para dar conselhos orgânicos em português, sem termos difíceis.
                  </p>
                </div>

                {/* Upload Window / Scanner preview */}
                <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner relative">
                  {scanImage ? (
                    <div id="image-scanned-preview" className="w-full space-y-4">
                      <div className="w-full h-56 rounded-xl relative overflow-hidden border border-stone-200">
                        <Image
                          src={scanImage}
                          alt="Previsão de upload"
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          id="re-select-file"
                          onClick={() => {
                            setScanImage(null);
                            setScanResult(null);
                          }}
                          className="text-xs bg-stone-100 hover:bg-stone-250 border border-stone-200 text-stone-600 font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                          Limpar foto
                        </button>
                        
                        {!scanResult && !isScanLoading && (
                          <button
                            id="run-analysis-btn"
                            onClick={() => startPlantDetection_RealAPI(scanImage)}
                            className="text-xs bg-emerald-800 hover:bg-emerald-900 border border-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg transition flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                            Começar Análise por IA
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Blank state
                    <div className="space-y-4 py-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-850">
                        <Camera className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-700 text-sm">Arraste ou clique para enviar foto</p>
                        <p className="text-[11px] text-stone-400 mt-1">Funciona com qualquer formato de imagem comum (JPG, PNG)</p>
                      </div>

                      <input
                        id="scan-file-uploader"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => handleImageSelect(e, (base64) => setScanImage(base64))}
                      />

                      <button
                        id="trigger-scan-uploader"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" /> Escolher do meu Computador/Celular
                      </button>
                    </div>
                  )}

                  {/* Breathing loading indicator */}
                  {isScanLoading && (
                    <div id="scanner-loading" className="absolute inset-0 bg-stone-900/95 text-white flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-400 animate-spin" />
                        <div className="absolute inset-4 rounded-full bg-emerald-800 flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-emerald-300 animate-bounce" />
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="font-bold text-sm text-emerald-300 animate-pulse">Consultando oráculo das folhas...</p>
                        <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                          Seu Sebastião está tirando os óculos para examinar os detalhes do caule no Brasil...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instant Trial presets - UX masterpiece */}
                {!scanImage && (
                  <div id="trial-presets" className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Sem plantas por perto para fotografar?
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Toque em um exemplo típico abaixo e comprove instantaneamente as informações orgânicas e o funcionamento do Jardim inteligente:
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {SAMPLE_PLANTS_FOR_SCAN.map((s) => (
                        <button
                          id={`trial-scan-${s.id}`}
                          key={s.id}
                          onClick={() => handleTryScanSample(s)}
                          className="bg-white border border-stone-200 hover:border-emerald-500 rounded-xl p-2.5 transition text-left flex flex-col items-center text-center space-y-1"
                        >
                          <span className="text-xl">🌿</span>
                          <span className="font-bold text-[10px] text-stone-700 truncate w-full">{s.commonName}</span>
                          <span className="text-[9px] text-emerald-800 font-medium">Testar</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SCANNED OUTPUT RESULT CARD */}
                {scanResult && (
                  <motion.div
                    id="scan-result-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between border-b border-emerald-200/50 pb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-sans font-extrabold text-stone-900 text-lg">
                            {scanResult.commonName}
                          </h3>
                          <span className="text-[9px] bg-emerald-800 text-emerald-100 rounded-full px-2 py-0.5 font-bold">
                            {scanResult.confidence}
                          </span>
                        </div>
                        <p className="italic text-xs text-stone-500 font-mono mt-0.5">
                          {scanResult.botanicalName}
                        </p>
                      </div>

                      <div className="text-stone-300">
                        🌵🌱
                      </div>
                    </div>

                    <div className="space-y-3 text-stone-700 text-xs leading-relaxed">
                      <div>
                        <span className="font-bold text-stone-800">📋 Descrição Simples:</span>
                        <p className="text-stone-600 mt-1 bg-white/70 border border-emerald-100 p-2.5 rounded-xl">
                          {scanResult.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/70 border border-emerald-100 rounded-xl p-2.5">
                          <span className="font-bold text-stone-850 block">☀️ Necessidade de Luz</span>
                          <p className="text-[11px] text-stone-600 mt-0.5">{scanResult.lightNeed}</p>
                        </div>

                        <div className="bg-white/70 border border-emerald-100 rounded-xl p-2.5">
                          <span className="font-bold text-stone-850 block">💧 Rega Recomendada</span>
                          <p className="text-[11px] text-stone-605 mt-0.5">{scanResult.wateringFrequency}</p>
                        </div>
                      </div>

                      <div className="bg-white/70 border border-emerald-100 rounded-xl p-2.5">
                        <span className="font-bold text-stone-850 block">🕒 Alerta de Intervalo</span>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          A IA programou um timer de <strong className="text-emerald-800">{scanResult.wateringIntervalDays} dias</strong> entre as regas.
                        </p>
                      </div>

                      <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-2.5">
                        <span className="font-bold text-red-900 block flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Restrições de Perigo/Toxidade
                        </span>
                        <p className="text-[11px] text-red-800 font-medium mt-0.5">{scanResult.warning}</p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-800">💡 3 Dicas Práticas de Ouro:</span>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
                          {scanResult.quickTips?.map((tip: string, index: number) => (
                            <li id={`scan-tip-li-${index}`} key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        id="save-scanned-to-garden-btn"
                        onClick={handleSaveScannedResultToGarden}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl py-3 font-bold transition flex items-center justify-center gap-2 text-sm shadow-md"
                      >
                        <Heart className="w-4 h-4 fill-white" /> Salvar no &quot;Meu Jardim&quot;
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* TAB 3: HEALTH / PEST CHECK */}
            {activeTab === "health" && (
              <motion.div
                key="tab-health"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-stone-800">Doutor de Planta 🩺🔬</h2>
                  <p className="text-xs text-stone-500">
                    Sua plantinha está com folhas amarelas, secas ou manchinhas? Tire uma foto da mancha para diagnosticar pragas comuns brasileiras e ver remédios biológicos caseiros.
                  </p>
                </div>

                {/* Upload or analysis box */}
                <div className="bg-white rounded-2xl border-2 border-dashed border-amber-200 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner relative">
                  {healthImage ? (
                    <div id="image-health-preview" className="w-full space-y-4">
                      <div className="w-full h-56 rounded-xl relative overflow-hidden border border-stone-200">
                        <Image
                          src={healthImage}
                          alt="Foto da folha doente"
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          id="clear-health-btn"
                          onClick={() => {
                            setHealthImage(null);
                            setHealthResult(null);
                          }}
                          className="text-xs bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                          Limpar foto
                        </button>
                        
                        {!healthResult && !isHealthLoading && (
                          <button
                            id="analyse-health-btn"
                            onClick={() => startPestAnalysis_RealAPI(healthImage)}
                            className="text-xs bg-amber-600 hover:bg-amber-700 border border-amber-500 text-white font-bold px-4 py-1.5 rounded-lg transition flex items-center gap-1.5"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                            Analisar Saúde do Solo/Folha
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Blank state
                    <div className="space-y-4 py-4">
                      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-700">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-700 text-sm">Carregar foto da mancha ou inseto</p>
                        <p className="text-[11px] text-stone-400 mt-1">Nossa IA tentará identificar se são pulgões, fungos, ácaros ou clima.</p>
                      </div>

                      <input
                        id="health-file-uploader"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={healthInputRef}
                        onChange={(e) => handleImageSelect(e, (base64) => setHealthImage(base64))}
                      />

                      <button
                        id="trigger-health-picker"
                        onClick={() => healthInputRef.current?.click()}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" /> Enviar Foto da Doença
                      </button>
                    </div>
                  )}

                  {/* Internal loading analysis for Health */}
                  {isHealthLoading && (
                    <div id="health-loading" className="absolute inset-0 bg-stone-900/95 text-white flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="relative w-16 h-16 animate-pulse">
                        <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-4 border-dashed border-amber-400 animate-spin" />
                        <div className="absolute inset-4 rounded-full bg-amber-800 flex items-center justify-center">
                          <Droplet className="w-5 h-5 text-amber-300 animate-bounce" />
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="font-bold text-sm text-amber-400 animate-pulse">Análise Clínica pelo Biolaboratório...</p>
                        <p className="text-[11px] text-stone-400 mt-1 max-w-xs mx-auto">
                          Verificando coloração da seiva e descartando podridão fúngica estrutural em Florianópolis...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instant trial pests for health evaluation */}
                {!healthImage && (
                  <div id="pests-presets" className="bg-stone-50 border border-stone-200/85 rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Simular Caso de Doença
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Não tem nenhuma praga viva em casa? Toque em um dos problemas comuns listados nos gardens brasileiros para testar o sistema de Receitas Orgânicas e check-ups:
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_PESTS_FOR_SCREEN.map((pest) => (
                        <button
                          id={`trial-pest-${pest.id}`}
                          key={pest.id}
                          onClick={() => handleTryPestSample(pest)}
                          className="bg-white border border-stone-200 hover:border-amber-500 rounded-xl p-3 transition text-left flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-stone-700 block line-clamp-1">{pest.name}</span>
                            <span className="text-[9px] text-stone-400 block mt-0.5">Gravidade: {pest.severity}</span>
                          </div>
                          <span className="text-[10px] text-amber-600 font-bold mt-2 flex items-center gap-0.5">
                            Visualizar <ChevronRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* HEALTH SPOTTER RESULT */}
                {healthResult && (
                  <motion.div
                    id="health-result-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-stone-900 text-base">
                            {healthResult.issueFound ? healthResult.issueName : "Nenhum problema grave visto"}
                          </h3>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                              healthResult.severity === "Baixa"
                                ? "bg-emerald-100 text-emerald-800"
                                : healthResult.severity === "Média"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-150 text-red-800 border border-red-300"
                            }`}
                          >
                            Gravidade: {healthResult.severity}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1">Análise botânica do consultório Folhário</p>
                      </div>
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <span className="font-bold text-stone-850">🔍 Sintomas visuais diagnosticados pela IA:</span>
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-605">
                          {healthResult.symptoms?.map((sh: string, ix: number) => (
                            <li id={`health-symp-li-${ix}`} key={ix}>{sh}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/90 border border-amber-100 rounded-xl p-3">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          🌿 RECEITA BIOLÓGICA (Remédio Caseiro):
                        </span>
                        <p className="text-stone-700 leading-relaxed mt-1 text-[11px]">
                          {healthResult.remedy}
                        </p>
                      </div>

                      {healthResult.preventiveAdvice && (
                        <div>
                          <span className="font-bold text-stone-850">🛡️ Proteção Futura:</span>
                          <p className="text-stone-605 text-[11px] mt-0.5">{healthResult.preventiveAdvice}</p>
                        </div>
                      )}
                    </div>

                    {/* vinculation tool so they can link checkup to a plant in garden */}
                    {plants.length > 0 && (
                      <div className="border-t border-amber-200/50 pt-3 space-y-2">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Vincular este laudo médico no prontuário de uma planta minha:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {plants.map((pl) => (
                            <button
                              id={`link-pest-${pl.id}`}
                              key={pl.id}
                              onClick={() => handleLinkPestToPlant(pl.id)}
                              className="text-[10px] bg-white hover:bg-amber-100 border border-amber-200 hover:border-amber-400 text-stone-700 font-medium px-2.5 py-1.5 truncate max-w-[150px] rounded-lg transition"
                            >
                              🩺 Vincular ao {pl.commonName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* TAB 4: FORUM DE AJUDA */}
            {activeTab === "forum" && (
              <motion.div
                key="tab-forum"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 space-y-4 font-sans"
              >
                <div>
                  <h2 className="text-lg font-bold text-stone-800">Fórum da Comunidade 💬🇧🇷</h2>
                  <p className="text-xs text-stone-500">
                    O maior ponto de encontro de principiantes ecológicos no Brasil. Poste suas dúvidas e nossos dois jardineiros especialistas respondem com amor e realismo imediatamente!
                  </p>
                </div>

                {/* Forums Form Question */}
                <form id="forum-submit-form" onSubmit={handlePostForumQuestion} className="bg-white border border-stone-200 rounded-2xl p-4 gap-3 flex flex-col shadow-sm">
                  <span className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
                    Fazer uma pergunta na roda literária de plantas:
                  </span>

                  <div className="space-y-2">
                    <textarea
                      id="forum-question-text"
                      rows={2}
                      placeholder="Ex: Minha dália está cheia de formiguinhas pequenas na garra. Como resolver de forma biológica?"
                      value={forumQuestion}
                      onChange={(e) => setForumQuestion(e.target.value)}
                      required
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-xl p-2.5 text-xs outline-none transition"
                    />
                    
                    <input
                      id="forum-plant-context"
                      type="text"
                      placeholder="Qual planta? (Opcional, Ex: Dália, Orquídea)"
                      value={forumPlantContext}
                      onChange={(e) => setForumPlantContext(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-xl px-2.5 py-2 text-xs outline-none transition"
                    />
                  </div>

                  {/* Character toggle selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-stone-400 font-bold">Quem deve responder o seu chamado?</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="select-seu-sebastiao"
                        type="button"
                        onClick={() => setForumRole("seu_sebastiao")}
                        className={`p-2 rounded-xl text-left border flex items-center gap-2.5 transition ${
                          forumRole === "seu_sebastiao"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <span className="text-xl">👴</span>
                        <div>
                          <strong className="text-[11px] block text-stone-850">Seu Sebastião</strong>
                          <span className="text-[9px] text-stone-400 block shrink-0">Orgânico e caseiro</span>
                        </div>
                      </button>

                      <button
                        id="select-dona-flor"
                        type="button"
                        onClick={() => setForumRole("dona_flor")}
                        className={`p-2 rounded-xl text-left border flex items-center gap-2.5 transition ${
                          forumRole === "dona_flor"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <span className="text-xl">👩</span>
                        <div>
                          <strong className="text-[11px] block text-stone-850">Dona Flor</strong>
                          <span className="text-[9px] text-stone-400 block shrink-0 font-light">Estética e luz</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    id="submit-question-btn"
                    type="submit"
                    disabled={isForumSubmitLoading}
                    className="bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl py-2.5 font-bold text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                  >
                    {isForumSubmitLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Aguardando conselho...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Perguntar ao Consultório
                      </>
                    )}
                  </button>
                </form>

                {/* List discussion threads */}
                <div id="forum-feed" className="space-y-4">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Conversas Recentes
                  </h3>

                  {forumThreads.map((thread) => (
                    <div
                      id={`thread-card-${thread.id}`}
                      key={thread.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3.5 shadow-sm"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-550 border border-stone-250">
                            👤
                          </div>
                          <div>
                            <span className="text-xs font-bold text-stone-800">{thread.author}</span>
                            <span className="text-[9px] text-stone-400 block">{thread.date}</span>
                          </div>
                        </div>

                        {thread.plantContext && (
                          <span className="text-[9px] bg-stone-100 border border-stone-200 rounded font-mono text-stone-605 px-1.5 py-0.5">
                            📌 {thread.plantContext}
                          </span>
                        )}
                      </div>

                      {/* Question */}
                      <p className="text-sm font-semibold text-stone-800 leading-snug">
                        &ldquo;{thread.question}&rdquo;
                      </p>

                      {/* Expert Answer */}
                      <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {thread.expertRole === "seu_sebastiao" ? "👴" : "👩"}
                          </span>
                          <div>
                            <strong className="text-xs font-bold text-emerald-950">{thread.expertName}</strong>
                            <span className="text-[9px] text-emerald-800 block">Especialista certificado</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-650 leading-relaxed pl-1">
                          {thread.answer}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center gap-4 text-stone-400 border-t border-stone-100 pt-2.5">
                        <button
                          id={`like-thread-${thread.id}`}
                          onClick={() => handleLikeThread(thread.id)}
                          className={`flex items-center gap-1.5 text-xs transition ${
                            thread.liked ? "text-emerald-800 font-bold text-base" : "hover:text-stone-600"
                          }`}
                        >
                          <Smile className={`w-4 h-4 ${thread.liked ? "fill-emerald-800/20 text-emerald-800" : ""}`} />
                          <span>Gostei ({thread.likes})</span>
                        </button>

                        <span className="text-[10px] text-stone-300">|</span>

                        <span className="text-[10px] text-stone-400 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Solução verificada por botânico
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* DIALOG DETAILS MODAL FOR PLANT (SLIDE UP OVERLAY) */}
        <AnimatePresence>
          {selectedPlant && (
            <motion.div
              id="plant-detail-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-0 top-0 z-40 bg-stone-900/40 backdrop-blur-xs flex flex-col justify-end"
              onClick={() => setSelectedPlant(null)}
            >
              {/* Slide up content */}
              <motion.div
                id="plant-detail-paper"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-white rounded-t-[32px] max-h-[85%] overflow-y-auto flex flex-col shadow-2xl relative border-t border-stone-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle */}
                <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto my-3 shrink-0" />

                {/* Back button option */}
                <div className="px-5 flex items-center justify-between border-b border-stone-100 pb-3">
                  <button
                    id="close-detail-modal"
                    onClick={() => setSelectedPlant(null)}
                    className="p-1 px-2.5 bg-neutral-105 hover:bg-neutral-200 text-stone-800 font-bold border border-stone-200 rounded-xl text-xs flex items-center gap-1 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Sair
                  </button>

                  <h3 className="font-extrabold text-stone-900 text-sm tracking-tight flex items-center gap-1 select-none">
                    <BookOpen className="w-4 h-4 text-emerald-800" /> Ficha Técnica do Jardim
                  </h3>
                </div>

                {/* Profile header plant */}
                <div className="p-5 flex gap-4 border-b border-stone-100 bg-stone-50/50">
                  <div className="w-24 h-24 rounded-2xl relative overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image
                      src={selectedPlant.photo}
                      alt={selectedPlant.commonName}
                      fill
                      unoptimized
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-xl truncate">
                        {selectedPlant.commonName}
                      </h4>
                      <p className="italic text-xs font-mono text-stone-400 mt-0.5 truncate">
                        {selectedPlant.botanicalName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        id="water-plant-detail"
                        onClick={() => handleWaterPlant(selectedPlant.id)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Droplet className="w-3.5 h-3.5 text-blue-300 animate-pulse" /> Reguei Hoje!
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content info grids */}
                <div className="p-5 space-y-6">
                  {/* Realtime watermark indicator */}
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">
                      🕰️ Próxima rega estimada:
                    </span>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-stone-700">
                        <Clock className="w-4 h-4 text-emerald-700" />
                        <div>
                          <strong className="block text-emerald-950 font-bold">
                            {getWateringStatus(selectedPlant).text}
                          </strong>
                          <span className="text-[10px] text-stone-400">
                            Última rega: {new Date(selectedPlant.lastWateredDate).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <span className="text-xl">💧</span>
                    </div>
                  </div>

                  {/* Botanical rules */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block border-b border-stone-100 pb-1">
                      🌿 Conselhos de Sobrevivência:
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-stone-50 border border-stone-150 rounded-xl p-3 space-y-1">
                        <strong className="text-stone-800 block">☀️ Sol e Luz:</strong>
                        <p className="text-stone-550 leading-relaxed text-[11px]">{selectedPlant.lightNeed}</p>
                      </div>

                      <div className="bg-stone-50 border border-stone-150 rounded-xl p-3 space-y-1">
                        <strong className="text-stone-800 block">💧 Quantidade de Água:</strong>
                        <p className="text-stone-550 leading-relaxed text-[11px]">{selectedPlant.wateringFrequency}</p>
                      </div>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-xs">
                      <strong className="text-red-900 block flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-650" /> Alerta de Toxicidade:
                      </strong>
                      <p className="text-red-800 text-[11px] mt-1 font-medium">{selectedPlant.warning}</p>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 text-xs">
                      <strong className="text-stone-800 block">💡 Regras Sem Jargão de Cuidados:</strong>
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-stone-600">
                        {selectedPlant.quickTips.map((tip, index) => (
                          <li id={`detail-tip-li-${index}`} key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* HEALTH HISTORY LOG IF RELEVANT */}
                  {selectedPlant.pestChecks.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block border-b border-stone-100 pb-1">
                        🩺 Prontuário Médico de Pragas ({selectedPlant.pestChecks.length}):
                      </span>

                      <div className="space-y-2">
                        {selectedPlant.pestChecks.map((pest) => (
                          <div
                            id={`pest-report-${pest.id}`}
                            key={pest.id}
                            className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-850 block">{pest.issueName}</span>
                              <span className="text-[9px] bg-amber-250 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                Gravidade: {pest.severity}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600">
                              <strong className="text-amber-900">Remédio Caseiro Aplicado:</strong> {pest.remedy}
                            </p>
                            <span className="text-[9px] text-stone-400 block text-right mt-1">
                              Registrado em: {new Date(pest.date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* JOURNAL JOURNAL ENGINE WRITING (LOG PROGRESS) */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block border-b border-stone-100 pb-1">
                      📸 Diário e Notas de Progresso ({selectedPlant.progressLogs.length}):
                    </span>

                    {/* Form to append new diary progress */}
                    <form id="diary-submit-form" onSubmit={handleAddProgressLog} className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-3">
                      <strong className="text-[11px] text-stone-500 block">Escreva o que mudou na planta hoje ou se ela brotou: ✏️</strong>
                      <textarea
                        id="diary-note-text"
                        rows={2}
                        placeholder="Ex: Nasceu uma folhinha nova bem verde no caule central! Adubeis com casca de banana secada..."
                        value={logNote}
                        onChange={(e) => setLogNote(e.target.value)}
                        required
                        className="w-full bg-white border border-stone-200 focus:border-emerald-500 rounded-xl p-2 text-xs outline-none transition"
                      />

                      {/* Optional Photo Attachment for log */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            id="diary-photo-uploader"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={logPhotoInputRef}
                            onChange={(e) => handleImageSelect(e, (base64) => setLogPhoto(base64))}
                          />
                          <button
                            id="trigger-diary-photo"
                            type="button"
                            onClick={() => logPhotoInputRef.current?.click()}
                            className="text-[11px] bg-white hover:bg-stone-150 border border-stone-200 hover:border-stone-300 text-stone-600 font-bold px-2.5 py-1.5 rounded-lg transition inline-flex items-center gap-1"
                          >
                            <Camera className="w-3 h-3 text-stone-405" />
                            {logPhoto ? "Trocar foto de progresso" : "Foto opcional"}
                          </button>

                          {logPhoto && (
                            <span className="text-[9px] bg-emerald-100 border border-emerald-250 text-emerald-800 rounded font-medium px-2 py-0.5">
                              Foto anexada!
                            </span>
                          )}
                        </div>

                        <button
                          id="submit-diary-btn"
                          type="submit"
                          className="bg-emerald-800 hover:bg-emerald-900 border border-emerald-750 text-white rounded-xl px-3.5 py-1.5 text-[11px] font-bold shadow-sm transition inline-flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3 h-3" /> Salvar Nota
                        </button>
                      </div>
                    </form>

                    {/* Timeline logs history list display */}
                    <div className="space-y-3.5 pt-1">
                      {selectedPlant.progressLogs.map((log) => (
                        <div
                          id={`progress-log-item-${log.id}`}
                          key={log.id}
                          className="relative pl-5 border-l-2 border-emerald-100 space-y-1.5 text-xs text-stone-700"
                        >
                          {/* Dot accent timeline */}
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-700 -left-[6px] top-1" />

                          <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium">
                            <span>{new Date(log.date).toLocaleDateString("pt-BR") + " às " + new Date(log.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                            <span className="italic text-emerald-855 text-[9px] font-bold">Nota Registrada</span>
                          </div>

                          <p className="leading-relaxed text-stone-650 bg-stone-50/60 p-2.5 rounded-xl border border-stone-100">
                            {log.note}
                          </p>

                          {log.photo && (
                            <div className="w-36 h-36 relative rounded-xl overflow-hidden border border-stone-200 mt-2">
                              <Image
                                src={log.photo}
                                alt="Foto do diário"
                                fill
                                unoptimized
                                referrerPolicy="no-referrer"
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-stone-105 sticky bottom-0 bg-white block">
                  <button
                    id="exit-details-modal-bottom"
                    onClick={() => setSelectedPlant(null)}
                    className="w-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    Fechar Prontuário de Cuidados
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PERSISTENT BOTTOM TAB NAVIGATION (PWA FEELING) */}
        <nav
          id="pwa-navigator"
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200/80 p-2.5 flex justify-between items-center z-30 shadow-md gap-1"
        >
          <button
            id="tab-garden-btn"
            onClick={() => setActiveTab("garden")}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl transition ${
              activeTab === "garden" ? "text-emerald-800 bg-emerald-50/80 font-bold" : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight select-none">Meu Jardim</span>
          </button>

          <button
            id="tab-scan-btn"
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl transition ${
              activeTab === "scan" ? "text-emerald-800 bg-emerald-50/80 font-bold" : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <Camera className="w-5 h-5 text-center" />
            <span className="text-[10px] mt-1 tracking-tight select-none">Identificar</span>
          </button>

          <button
            id="tab-health-btn"
            onClick={() => setActiveTab("health")}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl transition ${
              activeTab === "health" ? "text-emerald-800 bg-emerald-50/80 font-bold" : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-center" />
            <span className="text-[10px] mt-1 tracking-tight select-none">Doenças</span>
          </button>

          <button
            id="tab-forum-btn"
            onClick={() => setActiveTab("forum")}
            className={`flex-1 py-1.5 flex flex-col items-center justify-center rounded-xl transition ${
              activeTab === "forum" ? "text-emerald-800 bg-emerald-50/80 font-bold" : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <Users className="w-5 h-5 text-center" />
            <span className="text-[10px] mt-1 tracking-tight select-none">Fórum</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
