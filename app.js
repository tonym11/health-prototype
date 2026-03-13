const state = {
  screen: "home",
  previousScreen: "labs",
  activeLabFilter: "Key markers",
  chatDraft: "",
};

const profile = {
  name: "Anton Volk",
  program: "Longevity baseline",
  focus: "Metabolic resilience, recovery, inflammation",
  score: 79,
};

const snapshots = [
  { label: "Sleep", value: "7.8h", note: "steady" },
  { label: "Recovery", value: "82%", note: "up 4%" },
  { label: "Hydration", value: "2.4L", note: "on plan" },
];

const insights = [
  {
    title: "Metabolic balance",
    value: 72,
    note: "Your fasting glucose and triglycerides suggest stable energy handling this week.",
  },
  {
    title: "Inflammation watch",
    value: 43,
    note: "hs-CRP is slightly elevated after travel. Keep an eye on recovery and sleep.",
  },
];

const labs = [
  {
    id: "vitamin-d",
    name: "Vitamin D",
    category: "Key markers",
    value: "26 ng/mL",
    status: "watch",
    range: "Target 30-60",
    change: "+2 since Jan",
    summary: "A little below your target range, but trending upward.",
    coachNote: "Add consistent morning light and keep supplementation regular for 6 weeks.",
    trend: [
      { label: "Oct", value: 34 },
      { label: "Dec", value: 28 },
      { label: "Jan", value: 24 },
      { label: "Mar", value: 26 },
    ],
    details: [
      { label: "Optimal zone", value: "30-60", note: "ng/mL" },
      { label: "Current state", value: "Slightly low", note: "No acute risk" },
      { label: "Priority", value: "Medium", note: "Review in 8 weeks" },
      { label: "Confidence", value: "High", note: "3 data points" },
    ],
  },
  {
    id: "glucose",
    name: "Fasting Glucose",
    category: "Key markers",
    value: "92 mg/dL",
    status: "good",
    range: "Target 70-99",
    change: "-3 since Jan",
    summary: "Comfortably inside range with a gentle downward trend.",
    coachNote: "Current meal timing and evening walks appear to be working well.",
    trend: [
      { label: "Oct", value: 97 },
      { label: "Dec", value: 95 },
      { label: "Jan", value: 95 },
      { label: "Mar", value: 92 },
    ],
    details: [
      { label: "Optimal zone", value: "70-99", note: "mg/dL" },
      { label: "Current state", value: "Stable", note: "Good metabolic signal" },
      { label: "Priority", value: "Low", note: "Maintain routine" },
      { label: "Confidence", value: "High", note: "4 data points" },
    ],
  },
  {
    id: "hs-crp",
    name: "hs-CRP",
    category: "Inflammation",
    value: "2.1 mg/L",
    status: "watch",
    range: "Target < 1.0",
    change: "+0.6 since Jan",
    summary: "Mild elevation that may be related to recent stress load.",
    coachNote: "Prioritize sleep regularity and lower training intensity for 5 to 7 days.",
    trend: [
      { label: "Oct", value: 1.1 },
      { label: "Dec", value: 1.3 },
      { label: "Jan", value: 1.5 },
      { label: "Mar", value: 2.1 },
    ],
    details: [
      { label: "Optimal zone", value: "< 1.0", note: "mg/L" },
      { label: "Current state", value: "Elevated", note: "Monitor context" },
      { label: "Priority", value: "High", note: "Repeat next cycle" },
      { label: "Confidence", value: "Medium", note: "Recent travel confounder" },
    ],
  },
  {
    id: "apo-b",
    name: "ApoB",
    category: "Cardiometabolic",
    value: "79 mg/dL",
    status: "good",
    range: "Target < 90",
    change: "-4 since Jan",
    summary: "In a favorable range with gradual improvement over time.",
    coachNote: "Keep fiber intake and resistance training consistent.",
    trend: [
      { label: "Oct", value: 91 },
      { label: "Dec", value: 86 },
      { label: "Jan", value: 83 },
      { label: "Mar", value: 79 },
    ],
    details: [
      { label: "Optimal zone", value: "< 90", note: "mg/dL" },
      { label: "Current state", value: "Favorable", note: "Cardio risk reduced" },
      { label: "Priority", value: "Low", note: "Maintain plan" },
      { label: "Confidence", value: "High", note: "Longitudinal trend" },
    ],
  },
];

const chatMessages = [
  {
    role: "assistant",
    text: "Your latest labs suggest good glucose control, but Vitamin D and hs-CRP deserve attention. Would you like a weekly action plan?",
  },
  {
    role: "user",
    text: "What should I focus on first?",
  },
  {
    role: "assistant",
    text: "Start with recovery consistency: 7.5 to 8 hours of sleep, morning light exposure, and a lighter training block for the next week.",
  },
];

const chatSuggestions = [
  "Explain my inflammation markers",
  "Make a 7-day recovery plan",
  "What improved since last test?",
];

const profileItems = [
  ["Primary physician", "Not connected"],
  ["Coach mode", "Evidence-led"],
  ["Lab cadence", "Every 12 weeks"],
  ["Notifications", "Morning digest"],
];

function setScreen(screen, options = {}) {
  if (state.screen !== screen) {
    state.previousScreen = options.from ?? state.screen;
  }
  state.screen = screen;
  if (options.labFilter) {
    state.activeLabFilter = options.labFilter;
  }
  renderApp();
}

function openLabDetail(id) {
  state.selectedLab = labs.find((lab) => lab.id === id) ?? labs[0];
  setScreen("detail", { from: "labs" });
}

function statusClass(status) {
  return {
    good: "good",
    watch: "watch",
    high: "high",
  }[status] || "watch";
}

function bottomNav() {
  const items = [
    ["home", "Home"],
    ["labs", "Labs"],
    ["chat", "AI Chat"],
    ["profile", "Profile"],
  ];

  return `
    <nav class="bottom-nav" aria-label="Primary">
      <div class="bottom-nav-inner">
        ${items
          .map(
            ([id, label]) => `
              <button class="nav-button ${state.screen === id ? "is-active" : ""}" data-screen="${id}">
                <span class="nav-icon"></span>
                <span>${label}</span>
              </button>
            `
          )
          .join("")}
      </div>
    </nav>
  `;
}

function screenHeader({ eyebrow, title, subtitle, action = "" }) {
  return `
    <header class="screen-header">
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="screen-subtitle">${subtitle}</p>
      </div>
      ${action}
    </header>
  `;
}

function renderHome() {
  return `
    <section class="screen screen--home">
      ${screenHeader({
        eyebrow: "+Life health coach",
        title: "Daily health,<br>made legible.",
        subtitle: "A calm overview of your biomarkers, recovery rhythm, and AI-led next steps.",
        action: `<button class="avatar-chip" data-screen="profile">AV</button>`,
      })}

      <div class="panel hero-card">
        <div class="hero-grid">
          <div>
            <p class="eyebrow">This week</p>
            <h2>Your health signal is stable.</h2>
            <p class="screen-subtitle">Two markers to watch, one strong improvement, and a clear recovery recommendation.</p>
          </div>
          <div class="score-ring">
            <div class="score-ring-content">
              <strong>${profile.score}</strong>
              <span>Signal</span>
            </div>
          </div>
        </div>
      </div>

      <div class="metrics-strip">
        ${snapshots
          .map(
            (item) => `
              <article class="metric-card">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <div class="muted">${item.note}</div>
              </article>
            `
          )
          .join("")}
      </div>

      <div class="section-row">
        <h2 class="section-title">AI overview</h2>
        <button class="pill-button" data-screen="chat">Open coach</button>
      </div>

      <div class="card-stack">
        ${insights
          .map(
            (item) => `
              <article class="info-card panel">
                <div class="info-row">
                  <div>
                    <div class="label">${item.title}</div>
                    <h2>${item.value}/100</h2>
                  </div>
                  <div class="range-chip">Updated today</div>
                </div>
                <div class="progress-bar"><span style="width:${item.value}%;"></span></div>
                <div class="section-note">${item.note}</div>
              </article>
            `
          )
          .join("")}
      </div>

      <div class="section-row">
        <h2 class="section-title">Latest labs</h2>
        <button class="pill-button" data-screen="labs">See all</button>
      </div>

      <div class="card-stack">
        ${labs
          .slice(0, 3)
          .map(
            (lab) => `
              <button class="marker-button" data-detail="${lab.id}">
                <article class="lab-card panel">
                  <div>
                    <strong>${lab.name}</strong>
                    <div class="screen-subtitle">${lab.summary}</div>
                  </div>
                  <div>
                    <div class="status-chip ${statusClass(lab.status)}">${lab.value}</div>
                  </div>
                </article>
              </button>
            `
          )
          .join("")}
      </div>

      ${bottomNav()}
    </section>
  `;
}

function renderLabs() {
  const categories = ["Key markers", "Inflammation", "Cardiometabolic"];
  const visibleLabs = labs.filter((lab) => lab.category === state.activeLabFilter);

  return `
    <section class="screen screen--labs">
      ${screenHeader({
        eyebrow: "Health data",
        title: "Labs",
        subtitle: "A structured view of your core biomarkers, designed for quick comparison and follow-up.",
        action: `<button class="icon-button" data-screen="home" aria-label="Back to home">+</button>`,
      })}

      <div class="tab-row">
        ${categories
          .map(
            (category) => `
              <button class="tab-button ${state.activeLabFilter === category ? "is-active" : ""}" data-filter="${category}">
                ${category}
              </button>
            `
          )
          .join("")}
      </div>

      <div class="lab-list">
        ${visibleLabs
          .map(
            (lab) => `
              <button class="marker-button" data-detail="${lab.id}">
                <article class="lab-card panel">
                  <div>
                    <div class="label">${lab.category}</div>
                    <strong>${lab.name}</strong>
                    <div class="screen-subtitle">${lab.change} - ${lab.range}</div>
                  </div>
                  <div>
                    <div class="status-chip ${statusClass(lab.status)}">${lab.value}</div>
                  </div>
                </article>
              </button>
            `
          )
          .join("")}
      </div>

      ${bottomNav()}
    </section>
  `;
}

function renderDetail() {
  const lab = state.selectedLab ?? labs[0];
  const max = Math.max(...lab.trend.map((item) => item.value));

  return `
    <section class="screen screen--detail">
      <div class="back-row">
        <button class="back-button" data-screen="${state.previousScreen || "labs"}" aria-label="Go back"><-</button>
        <div>
          <p class="eyebrow">Biomarker detail</p>
          <h2>${lab.name}</h2>
        </div>
      </div>

      <article class="panel biomarker-hero">
        <div class="info-row">
          <div>
            <div class="label">Current value</div>
            <strong>${lab.value}</strong>
          </div>
          <div class="status-chip ${statusClass(lab.status)}">${lab.status}</div>
        </div>
        <p class="screen-subtitle">${lab.summary}</p>
        <div class="range-chip">${lab.range}</div>
      </article>

      <article class="panel trend-card">
        <div class="section-row">
          <h2 class="section-title">Trend</h2>
          <div class="muted">${lab.change}</div>
        </div>
        <div class="sparkline">
          ${lab.trend
            .map(
              (point) => `
                <div class="sparkline-bar" style="height:${Math.max(24, (point.value / max) * 100)}%;">
                  <span>${point.label}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </article>

      <div class="detail-grid">
        ${lab.details
          .map(
            (item) => `
              <article class="detail-stat panel">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <div class="muted">${item.note}</div>
              </article>
            `
          )
          .join("")}
      </div>

      <div class="section-row">
        <h2 class="section-title">AI note</h2>
        <button class="pill-button" data-screen="chat">Ask coach</button>
      </div>

      <article class="info-card panel">
        <div class="label">Interpretation</div>
        <div>${lab.coachNote}</div>
      </article>
    </section>
  `;
}

function renderChat() {
  return `
    <section class="screen screen--chat">
      ${screenHeader({
        eyebrow: "AI health intelligence",
        title: "Coach",
        subtitle: "An evidence-led guide layered on top of your labs and recovery context.",
        action: `<button class="icon-button" data-screen="home" aria-label="Back to home">...</button>`,
      })}

      <div class="chat-thread">
        ${chatMessages
          .map(
            (message) => `
              <article class="chat-message ${message.role}">
                ${message.text}
              </article>
            `
          )
          .join("")}
      </div>

      <div class="chat-suggestions">
        ${chatSuggestions
          .map(
            (text) => `
              <button class="pill-button suggestion-chip" data-suggestion="${text}">
                ${text}
              </button>
            `
          )
          .join("")}
      </div>

      <div class="composer">
        <input type="text" value="${state.chatDraft}" placeholder="Ask about sleep, inflammation, or next actions" readonly>
        <button type="button">Send</button>
      </div>

      ${bottomNav()}
    </section>
  `;
}

function renderProfile() {
  return `
    <section class="screen screen--profile">
      ${screenHeader({
        eyebrow: "+Life profile",
        title: "Profile",
        subtitle: "Program context, health priorities, and prototype settings for this first pass.",
        action: `<button class="icon-button" data-screen="home" aria-label="Back to home">...</button>`,
      })}

      <article class="panel profile-summary">
        <div class="profile-avatar">AV</div>
        <div>
          <h2>${profile.name}</h2>
          <div class="screen-subtitle">${profile.program}</div>
          <div class="muted">${profile.focus}</div>
        </div>
      </article>

      <div class="section-row">
        <h2 class="section-title">Preferences</h2>
        <div class="range-chip">Mock account</div>
      </div>

      <div class="profile-list">
        ${profileItems
          .map(
            ([label, value]) => `
              <article class="profile-item panel">
                <div>
                  <div class="label">${label}</div>
                  <div>${value}</div>
                </div>
                <div class="muted">></div>
              </article>
            `
          )
          .join("")}
      </div>

      <div class="section-row">
        <h2 class="section-title">Prototype scope</h2>
      </div>

      <article class="info-card panel">
        <div>No auth, no backend, no external APIs. This is a layout and navigation prototype powered entirely by mock health data.</div>
      </article>

      ${bottomNav()}
    </section>
  `;
}

function renderApp() {
  const app = document.querySelector("#app");

  app.innerHTML = {
    home: renderHome(),
    labs: renderLabs(),
    detail: renderDetail(),
    chat: renderChat(),
    profile: renderProfile(),
  }[state.screen];

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      setScreen(button.dataset.screen);
    });
  });

  document.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      openLabDetail(button.dataset.detail);
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLabFilter = button.dataset.filter;
      renderApp();
    });
  });

  document.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      state.chatDraft = button.dataset.suggestion;
      renderApp();
    });
  });
}

renderApp();
