import { useState, useEffect, useCallback, useRef } from "react";

// ─── MENU DATA (parsed from Wing Stop xlsx) ───────────────────────────────────
const MENU_DATA = {
  flavours: [
    { id: "f1", name: "Lemon Pepper", type: "Dry Rub", heat: "mild", descriptor: "Zesty, salty, best seller" },
    { id: "f2", name: "Cajun", type: "Dry Rub", heat: "mild-medium", descriptor: "Smoky, slightly spicy" },
    { id: "f3", name: "Garlic Parmesan", type: "Wet", heat: "none", descriptor: "Creamy, no heat" },
    { id: "f4", name: "Hawaiian", type: "Wet", heat: "none", descriptor: "Sweet, no spice" },
    { id: "f5", name: "Hickory Smoked BBQ", type: "Wet", heat: "none", descriptor: "Classic BBQ flavour" },
    { id: "f6", name: "Spicy Korean Q", type: "Wet", heat: "medium", descriptor: "Sweet and spicy, sticky" },
    { id: "f7", name: "Louisiana Rub", type: "Dry Rub", heat: "medium", descriptor: "Dry rub, buttery spice" },
    { id: "f8", name: "Mango Habanero", type: "Wet", heat: "hot", descriptor: "Sweet but spicy kick" },
    { id: "f9", name: "Original Hot", type: "Wet", heat: "hot", descriptor: "Classic buffalo heat" },
    { id: "f10", name: "Atomic", type: "Wet", heat: "extreme", descriptor: "Very hot — warn customers" },
  ],
  categories: [
    {
      id: "combos", name: "Flavour Combos", items: [
        { id: "c1", name: "The Tender Fix (For 1)", content: "3 tenders, regular seasoned fries, a dip and a bottled drink", price: "£10.95" },
        { id: "c2", name: "The Flavour Fix Boneless (For 1)", content: "8 boneless, 3 tenders, regular seasoned fries", price: "£14.50" },
        { id: "c3", name: "The Flavour Fix Wings (For 1)", content: "8 wings, 3 tenders, regular seasoned fries", price: "£14.50" },
        { id: "c4", name: "The Flavour Craver (For 2)", content: "12 wings, 12 boneless, 3 tenders, large fries & 2 dips", price: "£27.50" },
        { id: "c5", name: "The Crowd Pleaser (For 5+)", content: "50 wings, 50 boneless, 3 large fries & 6 dips", price: "£100.00" },
      ]
    },
    {
      id: "wings", name: "Wings", items: [
        { id: "w1", name: "8 Wings", content: "Cooked to order in any of our 10 signature flavours", price: "£8.50" },
        { id: "w2", name: "10 Wings", content: "Cooked to order in any of our 10 signature flavours", price: "£9.95" },
        { id: "w3", name: "12 Wings", content: "Cooked to order in any of our 10 signature flavours", price: "£11.50" },
      ]
    },
    {
      id: "boneless", name: "Boneless", items: [
        { id: "b1", name: "8 Boneless", content: "Cooked to order in any of our 10 signature flavours", price: "£8.50" },
        { id: "b2", name: "10 Boneless", content: "Cooked to order in any of our 10 signature flavours", price: "£9.95" },
        { id: "b3", name: "12 Boneless", content: "Cooked to order in any of our 10 signature flavours", price: "£11.50" },
      ]
    },
    {
      id: "tenders", name: "Tenders", items: [
        { id: "t1", name: "3 Tenders", content: "Cooked to order in any of our 10 signature flavours", price: "£5.95" },
        { id: "t2", name: "5 Tenders", content: "Cooked to order in any of our 10 signature flavours", price: "£8.25" },
      ]
    },
    {
      id: "burgers", name: "Burgers", items: [
        { id: "bu1", name: "The Big Flavour Burger", content: "Crispy chicken tenders, cooked to order in any of our 10 signature flavours, crunchy slaw, pickles, house ranch in a toasted brioche bun", price: "£6.75" },
      ]
    },
    {
      id: "loaded_fries", name: "Loaded Fries", items: [
        { id: "lf1", name: "Buffalo Ranch Fries", content: "Large house fries served with house ranch and original hot sauce", price: "£4.95" },
        { id: "lf2", name: "Cheese Fries", content: "Large house fries smothered with aged cheddar cheese", price: "£4.95" },
        { id: "lf3", name: "Voodoo Fries", content: "Cajun fries with cheese sauce and ranch", price: "£4.95" },
      ]
    },
    {
      id: "sides", name: "Seasoned Sides", items: [
        { id: "s1", name: "Regular Seasoned Fries", content: "", price: "£2.95" },
        { id: "s2", name: "Large Seasoned Fries", content: "", price: "£3.95" },
        { id: "s3", name: "Regular Cajun Fries", content: "", price: "£2.95" },
        { id: "s4", name: "Large Cajun Fries", content: "", price: "£3.95" },
        { id: "s5", name: "Coleslaw", content: "", price: "£1.50" },
        { id: "s6", name: "Corn", content: "", price: "£1.50" },
      ]
    },
    {
      id: "dips", name: "Dips", items: [
        { id: "d1", name: "House Ranch", content: "Signature house recipe", price: "£0.50" },
        { id: "d2", name: "Bleu Cheese", content: "Classic blue cheese dip", price: "£0.50" },
        { id: "d3", name: "BBQ Sauce", content: "Classic BBQ", price: "£0.50" },
        { id: "d4", name: "Honey Mustard", content: "Sweet honey mustard", price: "£0.50" },
      ]
    },
    {
      id: "shakes", name: "Shakes", items: [
        { id: "sh1", name: "Mango Shake", content: "", price: "£5.00" },
        { id: "sh2", name: "Vanilla Shake", content: "", price: "£5.00" },
        { id: "sh3", name: "Strawberry Shake", content: "", price: "£5.00" },
        { id: "sh4", name: "Chocolate Shake", content: "", price: "£5.00" },
        { id: "sh5", name: "Salted Caramel Shake", content: "", price: "£5.00" },
        { id: "sh6", name: "Oreo Shake", content: "", price: "£5.25" },
        { id: "sh7", name: "Biscoff Shake", content: "", price: "£5.25" },
      ]
    },
    {
      id: "drinks", name: "Drinks", items: [
        { id: "dr1", name: "Water", content: "", price: "£2.75" },
        { id: "dr2", name: "Sprite", content: "", price: "£2.75" },
        { id: "dr3", name: "Regular Coke", content: "", price: "£2.75" },
        { id: "dr4", name: "Fanta Orange", content: "", price: "£2.75" },
        { id: "dr5", name: "Diet Coke", content: "", price: "£2.75" },
        { id: "dr6", name: "Coke Zero", content: "", price: "£2.75" },
        { id: "dr7", name: "IRN-BRU", content: "", price: "£2.75" },
      ]
    },
  ]
};

// ─── TIERS ────────────────────────────────────────────────────────────────────
const TIERS = [
  { id: "starter", label: "Starter", minAccuracy: 0, minSessions: 0, color: "#94a3b8" },
  { id: "trainee", label: "Trainee", minAccuracy: 50, minSessions: 3, color: "#60a5fa" },
  { id: "competent", label: "Competent", minAccuracy: 65, minSessions: 8, color: "#34d399" },
  { id: "shift_lead", label: "Shift Lead", minAccuracy: 80, minSessions: 15, color: "#f59e0b" },
  { id: "master", label: "Master", minAccuracy: 92, minSessions: 30, color: "#f97316" },
];

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { id: "u1", name: "Jordan Mills", role: "staff", storeId: "s1", pin: "1111" },
  { id: "u2", name: "Priya Shah", role: "staff", storeId: "s1", pin: "2222" },
  { id: "u3", name: "Marcus Cole", role: "staff", storeId: "s2", pin: "3333" },
  { id: "u4", name: "Sophie Grant", role: "manager", storeId: "s1", pin: "4444" },
  { id: "u5", name: "Dev Patel", role: "manager", storeId: "s2", pin: "5555" },
  { id: "u6", name: "Admin User", role: "admin", storeId: null, pin: "0000" },
];

const STORES = [
  { id: "s1", name: "Leicester City Centre" },
  { id: "s2", name: "Nottingham High Street" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getTier(accuracy, sessions) {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (accuracy >= t.minAccuracy && sessions >= t.minSessions) tier = t;
  }
  return tier;
}

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
const STORAGE_KEY = "mms_data_v2";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { }
}

function initData() {
  const existing = loadData();
  if (existing) return existing;
  // seed demo performance data
  const sessions = {};
  const categoryStats = {};
  DEMO_USERS.filter(u => u.role === "staff").forEach(u => {
    sessions[u.id] = [];
    categoryStats[u.id] = {};
    MENU_DATA.categories.forEach(cat => {
      const acc = Math.floor(Math.random() * 50) + 40;
      const count = Math.floor(Math.random() * 20) + 2;
      categoryStats[u.id][cat.id] = { accuracy: acc, attempts: count };
    });
    // add some overall sessions
    for (let i = 0; i < Math.floor(Math.random() * 20) + 2; i++) {
      sessions[u.id].push({
        date: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
        score: Math.floor(Math.random() * 6) + 4,
        total: 10,
        accuracy: Math.floor(Math.random() * 50) + 40,
        category: MENU_DATA.categories[Math.floor(Math.random() * MENU_DATA.categories.length)].id,
      });
    }
  });
  const data = { sessions, categoryStats };
  saveData(data);
  return data;
}

// ─── QUESTION GENERATOR ───────────────────────────────────────────────────────
function generateQuestion(focusCategory, userCategoryStats) {
  const allFlavours = MENU_DATA.flavours;

  // weighted: pick from weakest categories more often
  let chosenCat;
  if (focusCategory) {
    chosenCat = MENU_DATA.categories.find(c => c.id === focusCategory);
  } else {
    chosenCat = MENU_DATA.categories[Math.floor(Math.random() * MENU_DATA.categories.length)];
  }

  const questionTypes = ["price", "content", "flavour_heat", "flavour_type", "flavour_descriptor", "combo_content"];
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

  if (type === "flavour_heat" || type === "flavour_type" || type === "flavour_descriptor") {
    const flavour = allFlavours[Math.floor(Math.random() * allFlavours.length)];
    if (type === "flavour_heat") {
      const correct = flavour.heat;
      const distractors = [...new Set(allFlavours.map(f => f.heat))].filter(h => h !== correct);
      const options = shuffle([correct, ...shuffle(distractors).slice(0, 3)]);
      return {
        question: `What is the heat level of "${flavour.name}"?`,
        options,
        correct,
        category: "flavours",
        explanation: `${flavour.name} is ${flavour.heat} heat — ${flavour.descriptor}`
      };
    }
    if (type === "flavour_type") {
      const correct = flavour.type;
      const distractors = [...new Set(allFlavours.map(f => f.type))].filter(t => t !== correct);
      const options = shuffle([correct, ...shuffle(distractors).slice(0, 3)]);
      return {
        question: `Is "${flavour.name}" a Dry Rub or Wet sauce?`,
        options,
        correct,
        category: "flavours",
        explanation: `${flavour.name} is a ${flavour.type} — ${flavour.descriptor}`
      };
    }
    // flavour_descriptor
    const correct = flavour.descriptor;
    const distractors = shuffle(allFlavours.filter(f => f.id !== flavour.id).map(f => f.descriptor));
    const options = shuffle([correct, ...distractors.slice(0, 3)]);
    return {
      question: `How would you describe "${flavour.name}" to a customer?`,
      options,
      correct,
      category: "flavours",
      explanation: `${flavour.name}: ${flavour.descriptor}`
    };
  }

  // Item-based questions
  const catWithItems = MENU_DATA.categories.filter(c => c.items && c.items.length > 0);
  const cat = catWithItems[Math.floor(Math.random() * catWithItems.length)];
  const item = cat.items[Math.floor(Math.random() * cat.items.length)];

  if (type === "price" && item.price) {
    const distractorPrices = ["£2.50", "£3.50", "£4.50", "£5.50", "£6.50", "£7.50", "£8.00", "£9.00", "£10.00", "£12.00", "£15.00", "£20.00"].filter(p => p !== item.price);
    const options = shuffle([item.price, ...shuffle(distractorPrices).slice(0, 3)]);
    return {
      question: `What is the price of "${item.name}"?`,
      options,
      correct: item.price,
      category: cat.id,
      explanation: `${item.name} is ${item.price}`
    };
  }

  if (type === "combo_content" && item.content) {
    const distractors = shuffle(cat.items.filter(i => i.id !== item.id && i.content).map(i => i.content));
    const otherItems = catWithItems.flatMap(c => c.items).filter(i => i.id !== item.id && i.content);
    const allDistractors = shuffle([...distractors, ...otherItems.map(i => i.content)]).slice(0, 3);
    if (allDistractors.length < 3) {
      // fallback to price question
      const distractorPrices = ["£2.50", "£4.00", "£6.00", "£9.00"].filter(p => p !== item.price);
      const options = shuffle([item.price, ...distractorPrices.slice(0, 3)]);
      return {
        question: `What does "${item.name}" cost?`,
        options,
        correct: item.price,
        category: cat.id,
        explanation: `${item.name} is ${item.price}`
      };
    }
    const options = shuffle([item.content, ...allDistractors]);
    return {
      question: `What is included in "${item.name}"?`,
      options: options.slice(0, 4),
      correct: item.content,
      category: cat.id,
      explanation: `${item.name}: ${item.content}`
    };
  }

  // fallback — simple price
  const distractorPrices = ["£2.50", "£3.75", "£5.00", "£7.00", "£9.50", "£11.00", "£13.00"].filter(p => p !== item.price);
  const options = shuffle([item.price, ...shuffle(distractorPrices).slice(0, 3)]);
  return {
    question: `What does "${item.name}" cost?`,
    options,
    correct: item.price,
    category: cat.id,
    explanation: `${item.name} is ${item.price}`
  };
}

// ─── AI COACH ─────────────────────────────────────────────────────────────────
async function askAICoach(prompt, sessionContext) {
  const systemPrompt = `You are the Wing Stop Menu Mastery Coach — a concise, professional training assistant for restaurant staff. 
You help staff learn the Wing Stop menu: flavours, prices, combos, sides, drinks.
Menu highlights: 10 signature flavours (Lemon Pepper, Cajun, Garlic Parmesan, Hawaiian, Hickory Smoked BBQ, Spicy Korean Q, Louisiana Rub, Mango Habanero, Original Hot, Atomic).
Keep responses SHORT (2-4 sentences max) and practical. Focus on memorable tips.
${sessionContext ? `Current trainee context: ${sessionContext}` : ""}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  return data.content?.map(b => b.text || "").join("") || "Unable to get coach response.";
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MenuMasterySystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("login"); // login | dashboard | train | manager | admin | menu_ref | ai_coach
  const [appData, setAppData] = useState(() => initData());

  // Training state
  const [trainingState, setTrainingState] = useState(null); // null | active
  const [currentQ, setCurrentQ] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);
  const [sessionDone, setSessionDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [focusCat, setFocusCat] = useState(null);
  const TOTAL_QUESTIONS = 10;

  // AI Coach
  const [coachMessages, setCoachMessages] = useState([]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);

  const updateData = useCallback((updater) => {
    setAppData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  function login(userId) {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (!user) return;
    setCurrentUser(user);
    if (user.role === "admin") setView("admin");
    else if (user.role === "manager") setView("manager");
    else setView("dashboard");
  }

  function logout() {
    setCurrentUser(null);
    setView("login");
    setTrainingState(null);
    setSessionDone(false);
    setCoachMessages([]);
  }

  function startTraining(catId = null) {
    setFocusCat(catId);
    setQIndex(0);
    setSessionResults([]);
    setStreak(0);
    setSelected(null);
    setSessionDone(false);
    setCurrentQ(generateQuestion(catId, appData.categoryStats[currentUser?.id]));
    setView("train");
  }

  function handleAnswer(option) {
    if (selected !== null) return;
    setSelected(option);
    const isCorrect = option === currentQ.correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    const newResults = [...sessionResults, { ...currentQ, chosen: option, correct: isCorrect }];
    setSessionResults(newResults);

    if (qIndex + 1 >= TOTAL_QUESTIONS) {
      // session complete
      setTimeout(() => {
        const accuracy = Math.round((newResults.filter(r => r.correct).length / TOTAL_QUESTIONS) * 100);
        const session = {
          date: new Date().toISOString(),
          score: newResults.filter(r => r.correct).length,
          total: TOTAL_QUESTIONS,
          accuracy,
          category: focusCat || "mixed",
        };
        updateData(prev => {
          const uid = currentUser.id;
          const sessions = { ...prev.sessions, [uid]: [...(prev.sessions[uid] || []), session] };
          // update category stats
          const catStats = { ...prev.categoryStats };
          catStats[uid] = { ...(catStats[uid] || {}) };
          newResults.forEach(r => {
            const cid = r.category;
            if (!catStats[uid][cid]) catStats[uid][cid] = { accuracy: 0, attempts: 0 };
            const old = catStats[uid][cid];
            const newAcc = Math.round((old.accuracy * old.attempts + (r.correct ? 100 : 0)) / (old.attempts + 1));
            catStats[uid][cid] = { accuracy: newAcc, attempts: old.attempts + 1 };
          });
          return { ...prev, sessions, categoryStats: catStats };
        });
        setSessionDone(true);
      }, 800);
    } else {
      setTimeout(() => {
        setQIndex(i => i + 1);
        setSelected(null);
        setCurrentQ(generateQuestion(focusCat, appData.categoryStats[currentUser?.id]));
      }, 1200);
    }
  }

  const userSessions = currentUser ? (appData.sessions[currentUser.id] || []) : [];
  const totalSessions = userSessions.length;
  const overallAccuracy = totalSessions > 0
    ? Math.round(userSessions.reduce((s, sess) => s + sess.accuracy, 0) / totalSessions)
    : 0;
  const currentTier = getTier(overallAccuracy, totalSessions);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #e8501a; border-radius: 2px; }
        .btn-primary { background: #e8501a; color: #fff; border: none; border-radius: 6px; padding: 10px 20px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; transition: all .15s; letter-spacing: .5px; }
        .btn-primary:hover { background: #c73f0d; transform: translateY(-1px); }
        .btn-secondary { background: transparent; color: #e8501a; border: 1.5px solid #e8501a; border-radius: 6px; padding: 9px 18px; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer; transition: all .15s; }
        .btn-secondary:hover { background: #e8501a22; }
        .btn-ghost { background: transparent; color: #999; border: 1px solid #2a2a2a; border-radius: 6px; padding: 8px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all .15s; }
        .btn-ghost:hover { border-color: #555; color: #ddd; }
        .card { background: #161616; border: 1px solid #222; border-radius: 12px; padding: 24px; }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; font-family: 'Syne', sans-serif; letter-spacing: .5px; }
        .fade-in { animation: fadeIn .3s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .6; } }
        input { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 6px; color: #eee; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border .15s; }
        input:focus { border-color: #e8501a; }
        textarea { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 6px; color: #eee; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; resize: none; transition: border .15s; }
        textarea:focus { border-color: #e8501a; }
        select { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 6px; color: #eee; padding: 9px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; cursor: pointer; }
        .nav-link { background: transparent; border: none; color: #888; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 8px 12px; border-radius: 6px; transition: all .15s; text-align: left; }
        .nav-link:hover { color: #eee; background: #1e1e1e; }
        .nav-link.active { color: #e8501a; background: #e8501a11; }
        .progress-bar-outer { background: #222; border-radius: 99px; height: 6px; overflow: hidden; }
        .progress-bar-inner { height: 100%; border-radius: 99px; transition: width .5s ease; }
        .correct-flash { animation: correctFlash .4s ease; }
        @keyframes correctFlash { 0%,100% { background: #161616; } 50% { background: #14532d44; } }
        .wrong-flash { animation: wrongFlash .4s ease; }
        @keyframes wrongFlash { 0%,100% { background: #161616; } 50% { background: #7f1d1d44; } }
        .heat-none { background: #1e3a2f; color: #4ade80; }
        .heat-mild { background: #1e2d3d; color: #60a5fa; }
        .heat-mild-medium { background: #2d2515; color: #fbbf24; }
        .heat-medium { background: #2d1e0a; color: #f97316; }
        .heat-hot { background: #2d0f0f; color: #f87171; }
        .heat-extreme { background: #1a0000; color: #ff4444; }
      `}</style>

      {view === "login" && <LoginView onLogin={login} />}

      {currentUser && view !== "login" && (
        <div style={styles.layout}>
          <Sidebar user={currentUser} view={view} setView={setView} onLogout={logout} tier={currentTier} />
          <main style={styles.main}>
            {view === "dashboard" && (
              <DashboardView
                user={currentUser}
                sessions={userSessions}
                accuracy={overallAccuracy}
                tier={currentTier}
                categoryStats={appData.categoryStats[currentUser.id] || {}}
                onStartTraining={startTraining}
                setView={setView}
              />
            )}
            {view === "train" && currentQ && (
              <TrainingView
                question={currentQ}
                qIndex={qIndex}
                total={TOTAL_QUESTIONS}
                selected={selected}
                streak={streak}
                onAnswer={handleAnswer}
                sessionDone={sessionDone}
                sessionResults={sessionResults}
                onRetry={() => startTraining(focusCat)}
                onDone={() => setView("dashboard")}
                accuracy={overallAccuracy}
                sessions={userSessions.length}
              />
            )}
            {view === "menu_ref" && <MenuReferenceView />}
            {view === "ai_coach" && (
              <AICoachView
                messages={coachMessages}
                setMessages={setCoachMessages}
                input={coachInput}
                setInput={setCoachInput}
                loading={coachLoading}
                setLoading={setCoachLoading}
                user={currentUser}
                accuracy={overallAccuracy}
                categoryStats={appData.categoryStats[currentUser.id] || {}}
              />
            )}
            {view === "manager" && (
              <ManagerDashboard
                currentUser={currentUser}
                users={DEMO_USERS}
                stores={STORES}
                sessions={appData.sessions}
                categoryStats={appData.categoryStats}
              />
            )}
            {view === "admin" && (
              <AdminDashboard
                users={DEMO_USERS}
                stores={STORES}
                sessions={appData.sessions}
                categoryStats={appData.categoryStats}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (!selected) return;
    if (selected.pin !== pin) { setError("Incorrect PIN"); return; }
    onLogin(selected.id);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="fade-in" style={{ width: 420, padding: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 42, height: 42, background: "#e8501a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 20 }}>🍗</span>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: -0.5 }}>Menu Mastery</span>
          </div>
          <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Wing Stop Training Platform</p>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#888", letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>Select Account</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEMO_USERS.map(u => (
              <button key={u.id} onClick={() => { setSelected(u); setPin(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${selected?.id === u.id ? "#e8501a" : "#222"}`, background: selected?.id === u.id ? "#e8501a11" : "transparent", cursor: "pointer", transition: "all .15s" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: selected?.id === u.id ? "#e8501a" : "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: selected?.id === u.id ? "#fff" : "#888" }}>{getInitials(u.name)}</span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, color: "#eee" }}>{u.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", textTransform: "capitalize" }}>{u.role}{u.storeId ? ` · ${STORES.find(s => s.id === u.storeId)?.name}` : ""}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span className="tag" style={{ background: u.role === "admin" ? "#2d1e3d" : u.role === "manager" ? "#1e2d1e" : "#1e1e2d", color: u.role === "admin" ? "#c084fc" : u.role === "manager" ? "#4ade80" : "#60a5fa" }}>{u.role}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="card fade-in">
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#888", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>Enter PIN for {selected.name}</p>
            <input type="password" maxLength={4} value={pin} onChange={e => { setPin(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="4-digit PIN" style={{ width: "100%", marginBottom: 12, letterSpacing: 6, fontSize: 18, textAlign: "center" }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555", marginBottom: 12, textAlign: "center" }}>Demo PINs: Staff 1111/2222/3333 · Manager 4444/5555 · Admin 0000</p>
            {error && <p style={{ color: "#f87171", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginBottom: 10, textAlign: "center" }}>{error}</p>}
            <button className="btn-primary" onClick={handleLogin} style={{ width: "100%" }}>Sign In →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, view, setView, onLogout, tier }) {
  const navItems = [
    ...(user.role === "staff" ? [
      { id: "dashboard", label: "Dashboard", icon: "⬛" },
      { id: "train", label: "Start Training", icon: "🎯" },
      { id: "menu_ref", label: "Menu Reference", icon: "📋" },
      { id: "ai_coach", label: "AI Coach", icon: "🤖" },
    ] : []),
    ...(user.role === "manager" ? [
      { id: "manager", label: "Store Dashboard", icon: "📊" },
      { id: "menu_ref", label: "Menu Reference", icon: "📋" },
    ] : []),
    ...(user.role === "admin" ? [
      { id: "admin", label: "Admin Overview", icon: "🏢" },
      { id: "manager", label: "Store View", icon: "📊" },
      { id: "menu_ref", label: "Menu Reference", icon: "📋" },
    ] : []),
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, background: "#e8501a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>🍗</span>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "#fff", letterSpacing: -0.3 }}>Menu Mastery</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e1e1e", border: `2px solid ${tier.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: tier.color }}>{getInitials(user.name)}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: "#eee" }}>{user.name}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: tier.color, fontWeight: 600 }}>{tier.label}</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: "12px 8px", flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} className={`nav-link ${view === item.id ? "active" : ""}`}
            onClick={() => setView(item.id === "train" ? "dashboard" : item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 13 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: "12px 8px", borderTop: "1px solid #1a1a1a" }}>
        <button className="nav-link" onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
          <span>↩</span><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ user, sessions, accuracy, tier, categoryStats, onStartTraining, setView }) {
  const recentSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const weakCategories = Object.entries(categoryStats)
    .filter(([, s]) => s.attempts > 0)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 3);

  const nextTierIndex = TIERS.indexOf(tier) + 1;
  const nextTier = TIERS[nextTierIndex];

  return (
    <div className="fade-in" style={{ padding: "32px 32px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={styles.h1}>Welcome back, {user.name.split(" ")[0]}</h1>
        <p style={styles.subtitle}>Your training performance overview</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Overall Accuracy", value: `${accuracy}%`, sub: "all sessions", accent: "#e8501a" },
          { label: "Sessions Completed", value: sessions.length, sub: "total", accent: "#60a5fa" },
          { label: "Current Tier", value: tier.label, sub: "progression", accent: tier.color },
          { label: "Best Streak", value: sessions.length > 0 ? `${Math.max(...sessions.map(s => s.score))}/${sessions[0]?.total || 10}` : "—", sub: "highest score", accent: "#34d399" },
        ].map((kpi, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: kpi.accent, marginBottom: 4 }}>{kpi.value}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12, color: "#eee", marginBottom: 2 }}>{kpi.label}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Tier Progress */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={styles.cardLabel}>Progression</span>
            <span className="tag" style={{ background: tier.color + "22", color: tier.color }}>{tier.label}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {TIERS.map((t, i) => {
              const idx = TIERS.indexOf(tier);
              return (
                <div key={t.id} style={{ flex: 1, height: 6, borderRadius: 99, background: i <= idx ? t.color : "#222" }} />
              );
            })}
          </div>
          {nextTier ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666" }}>
              Reach <span style={{ color: nextTier.color }}>{nextTier.label}</span>: {nextTier.minAccuracy}% accuracy + {nextTier.minSessions} sessions
            </p>
          ) : (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#34d399" }}>🏆 You've reached the highest tier!</p>
          )}
        </div>

        {/* Weak Areas */}
        <div className="card">
          <span style={styles.cardLabel}>Areas to Improve</span>
          {weakCategories.length === 0 ? (
            <p style={{ color: "#555", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 12 }}>Complete more sessions to see insights</p>
          ) : (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {weakCategories.map(([catId, stats]) => {
                const cat = MENU_DATA.categories.find(c => c.id === catId);
                return (
                  <div key={catId}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc" }}>{cat?.name || catId}</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: stats.accuracy < 60 ? "#f87171" : "#fbbf24" }}>{stats.accuracy}%</span>
                    </div>
                    <div className="progress-bar-outer">
                      <div className="progress-bar-inner" style={{ width: `${stats.accuracy}%`, background: stats.accuracy < 60 ? "#ef4444" : "#f59e0b" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Training Actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <span style={styles.cardLabel}>Start Training Session</span>
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => onStartTraining(null)}>Mixed Quiz →</button>
          {weakCategories.slice(0, 3).map(([catId]) => {
            const cat = MENU_DATA.categories.find(c => c.id === catId);
            return (
              <button key={catId} className="btn-secondary" onClick={() => onStartTraining(catId)}>Focus: {cat?.name}</button>
            );
          })}
          <button className="btn-ghost" onClick={() => setView("menu_ref")}>Browse Menu</button>
          <button className="btn-ghost" onClick={() => setView("ai_coach")}>Ask AI Coach</button>
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="card">
          <span style={styles.cardLabel}>Recent Sessions</span>
          <div style={{ marginTop: 14 }}>
            {recentSessions.map((s, i) => {
              const cat = MENU_DATA.categories.find(c => c.id === s.category);
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < recentSessions.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc" }}>{cat?.name || "Mixed"} Quiz</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555" }}>{new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: s.accuracy >= 80 ? "#34d399" : s.accuracy >= 60 ? "#fbbf24" : "#f87171" }}>{s.accuracy}%</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555" }}>{s.score}/{s.total}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TRAINING VIEW ────────────────────────────────────────────────────────────
function TrainingView({ question, qIndex, total, selected, streak, onAnswer, sessionDone, sessionResults, onRetry, onDone, accuracy, sessions }) {
  if (sessionDone) {
    const correct = sessionResults.filter(r => r.correct).length;
    const pct = Math.round((correct / total) * 100);
    const newTier = getTier(Math.round((accuracy * sessions + pct) / (sessions + 1)), sessions + 1);
    return (
      <div className="fade-in" style={{ padding: 32, maxWidth: 560, margin: "0 auto" }}>
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 56, color: pct >= 80 ? "#34d399" : pct >= 60 ? "#fbbf24" : "#f87171", marginBottom: 8 }}>{pct}%</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#eee", marginBottom: 6 }}>{correct}/{total} Correct</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#666", marginBottom: 28 }}>
            {pct >= 90 ? "Outstanding — shift-ready performance" : pct >= 70 ? "Good effort — keep building consistency" : "Keep practising — focus on weak areas"}
          </div>

          <div style={{ background: "#1e1e1e", borderRadius: 10, padding: 16, marginBottom: 24, textAlign: "left" }}>
            <div style={styles.cardLabel}>Question Review</div>
            {sessionResults.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < sessionResults.length - 1 ? "1px solid #2a2a2a" : "none" }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{r.correct ? "✅" : "❌"}</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ccc" }}>{r.question}</div>
                  {!r.correct && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#f87171", marginTop: 2 }}>Correct: {r.correct_answer || r.correct}</div>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn-primary" onClick={onRetry}>Try Again</button>
            <button className="btn-secondary" onClick={onDone}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: 32, maxWidth: 580, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#888" }}>Question {qIndex + 1} of {total}</span>
          {streak >= 3 && <span className="tag" style={{ background: "#7c2d12", color: "#fb923c" }}>🔥 {streak} streak</span>}
        </div>
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${((qIndex) / total) * 100}%`, background: "#e8501a" }} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <span className="tag" style={{ background: "#1e1e2d", color: "#818cf8", marginBottom: 16, display: "inline-block" }}>
          {MENU_DATA.categories.find(c => c.id === question.category)?.name || question.category}
        </span>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", lineHeight: 1.4 }}>{question.question}</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {question.options.map((opt, i) => {
          let borderColor = "#222";
          let bg = "#161616";
          let textColor = "#ccc";
          if (selected !== null) {
            if (opt === question.correct) { borderColor = "#22c55e"; bg = "#14532d22"; textColor = "#4ade80"; }
            else if (opt === selected && opt !== question.correct) { borderColor = "#ef4444"; bg = "#7f1d1d22"; textColor = "#f87171"; }
          }
          return (
            <button key={i} onClick={() => onAnswer(opt)} disabled={selected !== null}
              style={{ textAlign: "left", padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${borderColor}`, background: bg, cursor: selected !== null ? "default" : "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${borderColor === "#222" ? "#333" : borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, color: textColor, flexShrink: 0 }}>
                {["A", "B", "C", "D"][i]}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: textColor, lineHeight: 1.4 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fade-in card" style={{ borderColor: selected === question.correct ? "#22c55e44" : "#ef444444" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: selected === question.correct ? "#4ade80" : "#f87171" }}>
            {selected === question.correct ? "✅ Correct! " : "❌ Incorrect. "}
            <span style={{ color: "#888" }}>{question.explanation}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── MENU REFERENCE ───────────────────────────────────────────────────────────
function MenuReferenceView() {
  const [activeCat, setActiveCat] = useState("flavours");
  const heatColors = { none: "heat-none", mild: "heat-mild", "mild-medium": "heat-mild-medium", medium: "heat-medium", hot: "heat-hot", extreme: "heat-extreme" };

  return (
    <div className="fade-in" style={{ padding: 32 }}>
      <h1 style={styles.h1}>Menu Reference</h1>
      <p style={styles.subtitle}>Complete Wing Stop menu — use for study</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => setActiveCat("flavours")} className={activeCat === "flavours" ? "btn-primary" : "btn-ghost"} style={{ fontSize: 12, padding: "7px 14px" }}>Flavours</button>
        {MENU_DATA.categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={activeCat === cat.id ? "btn-primary" : "btn-ghost"} style={{ fontSize: 12, padding: "7px 14px" }}>{cat.name}</button>
        ))}
      </div>

      {activeCat === "flavours" && (
        <div className="card">
          <div style={styles.cardLabel}>10 Signature Flavours</div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {MENU_DATA.flavours.map(f => (
              <div key={f.id} style={{ background: "#1e1e1e", borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#eee", marginBottom: 4 }}>{f.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888" }}>{f.descriptor}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 10 }}>
                  <span className={`tag ${heatColors[f.heat] || "heat-none"}`}>{f.heat}</span>
                  <span className="tag" style={{ background: "#1e1e1e", color: "#666", border: "1px solid #2a2a2a", fontSize: 10 }}>{f.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCat !== "flavours" && (() => {
        const cat = MENU_DATA.categories.find(c => c.id === activeCat);
        return (
          <div className="card">
            <div style={styles.cardLabel}>{cat?.name}</div>
            <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Description</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {cat?.items.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#eee", fontSize: 13 }}>{item.name}</span></td>
                    <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666" }}>{item.content}</span></td>
                    <td style={{ ...styles.td, textAlign: "right" }}><span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#e8501a" }}>{item.price}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}
    </div>
  );
}

// ─── AI COACH ─────────────────────────────────────────────────────────────────
function AICoachView({ messages, setMessages, input, setInput, loading, setLoading, user, accuracy, categoryStats }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const weakCat = Object.entries(categoryStats).sort((a, b) => a[1].accuracy - b[1].accuracy)[0];
  const weakCatName = weakCat ? MENU_DATA.categories.find(c => c.id === weakCat[0])?.name : null;

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const context = `Trainee ${user.name}, overall accuracy ${accuracy}%, weakest category: ${weakCatName || "unknown"}`;
    try {
      const reply = await askAICoach(input, context);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Couldn't connect to coach. Please try again." }]);
    }
    setLoading(false);
  }

  const starters = [
    "How do I remember all 10 flavours?",
    `Help me with ${weakCatName || "combo pricing"}`,
    "What's the difference between our dry rubs?",
    "Explain Atomic vs Original Hot",
  ];

  return (
    <div className="fade-in" style={{ padding: 32, display: "flex", flexDirection: "column", height: "calc(100vh - 40px)" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={styles.h1}>AI Training Coach</h1>
        <p style={styles.subtitle}>Ask anything about the Wing Stop menu</p>
      </div>

      {messages.length === 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {starters.map((s, i) => (
            <button key={i} className="btn-ghost" onClick={() => { setInput(s); }} style={{ fontSize: 12 }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, marginBottom: 16, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%", padding: "12px 16px", borderRadius: m.role === "user" ? "12px 12px 0 12px" : "0 12px 12px 12px",
              background: m.role === "user" ? "#e8501a" : "#1e1e1e",
              border: m.role === "assistant" ? "1px solid #2a2a2a" : "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: m.role === "user" ? "#fff" : "#ccc", lineHeight: 1.6
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ padding: "12px 16px", borderRadius: "0 12px 12px 12px", background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => <div key={i} className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8501a", animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask your coach a question…"
          rows={2}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={send} disabled={loading} style={{ alignSelf: "flex-end", padding: "10px 18px" }}>Send</button>
      </div>
    </div>
  );
}

// ─── MANAGER DASHBOARD ────────────────────────────────────────────────────────
function ManagerDashboard({ currentUser, users, stores, sessions, categoryStats }) {
  const storeId = currentUser.role === "manager" ? currentUser.storeId : stores[0]?.id;
  const [selectedStore, setSelectedStore] = useState(storeId);
  const storeUsers = users.filter(u => u.storeId === selectedStore && u.role === "staff");

  function getUserStats(uid) {
    const s = sessions[uid] || [];
    const acc = s.length > 0 ? Math.round(s.reduce((x, ss) => x + ss.accuracy, 0) / s.length) : 0;
    const tier = getTier(acc, s.length);
    return { sessions: s.length, accuracy: acc, tier };
  }

  // Store-wide weak categories
  const catTotals = {};
  storeUsers.forEach(u => {
    const cs = categoryStats[u.id] || {};
    Object.entries(cs).forEach(([cid, v]) => {
      if (!catTotals[cid]) catTotals[cid] = { sum: 0, count: 0 };
      catTotals[cid].sum += v.accuracy;
      catTotals[cid].count += 1;
    });
  });
  const storeWeakCats = Object.entries(catTotals)
    .map(([cid, v]) => ({ cid, avg: Math.round(v.sum / v.count) }))
    .sort((a, b) => a.avg - b.avg).slice(0, 5);

  const readyCount = storeUsers.filter(u => getUserStats(u.id).accuracy >= 70).length;

  return (
    <div className="fade-in" style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={styles.h1}>Store Dashboard</h1>
          <p style={styles.subtitle}>Team performance overview</p>
        </div>
        {currentUser.role === "admin" && (
          <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
            {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Staff Members", value: storeUsers.length, color: "#60a5fa" },
          { label: "Shift Ready", value: readyCount, color: "#34d399" },
          { label: "Needs Training", value: storeUsers.length - readyCount, color: "#f87171" },
          { label: "Store Avg Accuracy", value: storeUsers.length > 0 ? `${Math.round(storeUsers.reduce((s, u) => s + getUserStats(u.id).accuracy, 0) / storeUsers.length)}%` : "—", color: "#f59e0b" },
        ].map((k, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12, color: "#aaa" }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Staff Table */}
        <div className="card">
          <div style={styles.cardLabel}>Staff Performance</div>
          <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Tier</th>
                <th style={styles.th}>Accuracy</th>
                <th style={styles.th}>Sessions</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {storeUsers.map(u => {
                const s = getUserStats(u.id);
                const ready = s.accuracy >= 70;
                return (
                  <tr key={u.id}>
                    <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#eee", fontSize: 13 }}>{u.name}</span></td>
                    <td style={styles.td}><span className="tag" style={{ background: s.tier.color + "22", color: s.tier.color, fontSize: 10 }}>{s.tier.label}</span></td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar-outer" style={{ width: 60 }}>
                          <div className="progress-bar-inner" style={{ width: `${s.accuracy}%`, background: s.accuracy >= 80 ? "#22c55e" : s.accuracy >= 60 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: "#ccc" }}>{s.accuracy}%</span>
                      </div>
                    </td>
                    <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{s.sessions}</span></td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <span className="tag" style={{ background: ready ? "#14532d" : "#450a0a", color: ready ? "#4ade80" : "#f87171" }}>{ready ? "Ready" : "Training"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Store Weak Categories */}
        <div className="card">
          <div style={styles.cardLabel}>Store Weak Areas</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
            {storeWeakCats.map(({ cid, avg }) => {
              const cat = MENU_DATA.categories.find(c => c.id === cid);
              return (
                <div key={cid}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ccc" }}>{cat?.name || cid}</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: avg < 60 ? "#f87171" : "#fbbf24" }}>{avg}%</span>
                  </div>
                  <div className="progress-bar-outer">
                    <div className="progress-bar-inner" style={{ width: `${avg}%`, background: avg < 60 ? "#ef4444" : "#f59e0b" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ users, stores, sessions, categoryStats }) {
  function getStoreStats(storeId) {
    const storeUsers = users.filter(u => u.storeId === storeId && u.role === "staff");
    const allSessions = storeUsers.flatMap(u => sessions[u.id] || []);
    const avg = allSessions.length > 0 ? Math.round(allSessions.reduce((s, ss) => s + ss.accuracy, 0) / allSessions.length) : 0;
    const ready = storeUsers.filter(u => {
      const s = sessions[u.id] || [];
      const acc = s.length > 0 ? Math.round(s.reduce((x, ss) => x + ss.accuracy, 0) / s.length) : 0;
      return acc >= 70;
    }).length;
    return { userCount: storeUsers.length, sessions: allSessions.length, avg, ready };
  }

  const totalStaff = users.filter(u => u.role === "staff").length;
  const totalSessions = Object.values(sessions).reduce((s, arr) => s + arr.length, 0);
  const globalAvg = (() => {
    const all = Object.values(sessions).flat();
    return all.length ? Math.round(all.reduce((s, ss) => s + ss.accuracy, 0) / all.length) : 0;
  })();

  return (
    <div className="fade-in" style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={styles.h1}>Admin Overview</h1>
        <p style={styles.subtitle}>Organisation-wide training performance</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Stores", value: stores.length, color: "#818cf8" },
          { label: "Total Staff", value: totalStaff, color: "#60a5fa" },
          { label: "Training Sessions", value: totalSessions, color: "#34d399" },
          { label: "Global Avg Accuracy", value: `${globalAvg}%`, color: "#f59e0b" },
        ].map((k, i) => (
          <div key={i} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12, color: "#aaa" }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={styles.cardLabel}>Store Comparison</div>
        <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={styles.th}>Store</th>
              <th style={styles.th}>Staff</th>
              <th style={styles.th}>Sessions</th>
              <th style={styles.th}>Avg Accuracy</th>
              <th style={styles.th}>Shift Ready</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => {
              const s = getStoreStats(store.id);
              const perf = s.avg >= 75 ? "Strong" : s.avg >= 60 ? "Developing" : "Needs Support";
              const perfColor = s.avg >= 75 ? "#4ade80" : s.avg >= 60 ? "#fbbf24" : "#f87171";
              return (
                <tr key={store.id}>
                  <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#eee" }}>{store.name}</span></td>
                  <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{s.userCount}</span></td>
                  <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{s.sessions}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar-outer" style={{ width: 80 }}>
                        <div className="progress-bar-inner" style={{ width: `${s.avg}%`, background: s.avg >= 75 ? "#22c55e" : s.avg >= 60 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#ccc" }}>{s.avg}%</span>
                    </div>
                  </td>
                  <td style={styles.td}><span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#34d399" }}>{s.ready}/{s.userCount}</span></td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span className="tag" style={{ background: perfColor + "22", color: perfColor }}>{perf}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div style={styles.cardLabel}>User Directory</div>
        <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Store</th>
              <th style={styles.th}>Sessions</th>
              <th style={styles.th}>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.role !== "admin").map(u => {
              const s = sessions[u.id] || [];
              const acc = s.length > 0 ? Math.round(s.reduce((x, ss) => x + ss.accuracy, 0) / s.length) : 0;
              return (
                <tr key={u.id}>
                  <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#eee", fontSize: 13 }}>{u.name}</span></td>
                  <td style={styles.td}><span className="tag" style={{ background: u.role === "manager" ? "#1e2d1e" : "#1e1e2d", color: u.role === "manager" ? "#4ade80" : "#60a5fa", fontSize: 10 }}>{u.role}</span></td>
                  <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#888" }}>{STORES.find(st => st.id === u.storeId)?.name || "—"}</span></td>
                  <td style={styles.td}><span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{s.length}</span></td>
                  <td style={styles.td}>{u.role === "staff" ? <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: acc >= 70 ? "#4ade80" : "#f87171" }}>{acc}%</span> : <span style={{ color: "#555" }}>—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  app: { background: "#0a0a0a", minHeight: "100vh", color: "#eee", fontFamily: "'DM Sans', sans-serif" },
  layout: { display: "flex", height: "100vh", overflow: "hidden" },
  sidebar: { width: 220, flexShrink: 0, background: "#0f0f0f", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", height: "100vh" },
  main: { flex: 1, overflowY: "auto" },
  h1: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", letterSpacing: -0.5, marginBottom: 6 },
  subtitle: { fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555" },
  cardLabel: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase" },
  th: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, color: "#555", letterSpacing: 0.5, textTransform: "uppercase", padding: "0 0 10px", textAlign: "left", borderBottom: "1px solid #1a1a1a" },
  td: { padding: "11px 0", borderBottom: "1px solid #141414", verticalAlign: "middle", paddingRight: 16 },
};
