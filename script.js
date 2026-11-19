import { wordList, planets, updateNotes } from "./assets.js";

let gameState = "standby"; 
let score = 0;
let missCount = 0;
let timeLeft = 60;
let timerId = null;
let countIntervalId = null;

let currentWordObj = null;
let typedIndex = 0;
let activeRomas = [];

// ハイスコアと最高到達レベルをローカルストレージから読み込む
let highscore = Number(localStorage.getItem("typing_planet_highscore")) || 0;
let highscoreLevel = localStorage.getItem("typing_planet_highlevel") || "Lv.1 小さな隕石";

// 解放されたレベルのリスト（データがなければ初期状態として「Lv.1」のみ）
let unlockedLevels = JSON.parse(localStorage.getItem("typing_planet_unlocked_levels")) || [1];

const containerEl = document.getElementById("game-container");
const jpEl = document.getElementById("japanese-word");
const romaEl = document.getElementById("romaji-word");
const scoreEl = document.getElementById("score");
const missEl = document.getElementById("miss");
const timerEl = document.getElementById("timer");
const highscoreValEl = document.getElementById("highscore-val");
const highscoreLevelEl = document.getElementById("highscore-level");

const actionBtn = document.getElementById("action-btn");
const resetBtn = document.getElementById("reset-btn");
const titleListBtn = document.getElementById("title-list-btn");
const titleModal = document.getElementById("title-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const titleListContainer = document.getElementById("title-list-container");
const feverOverlay = document.getElementById("fever-overlay");

const updateInfoBtn = document.getElementById("update-info-btn");
const updateModal = document.getElementById("update-modal");
const closeUpdateModalBtn = document.getElementById("close-update-modal-btn");
const updateListContainer = document.getElementById("update-list-container");

const planetIconEl = document.getElementById("planet-icon");
const planetNameEl = document.getElementById("planet-name");
const gaugeBarEl = document.getElementById("gauge-bar");

// ハイスコアとレベルの表示を更新
function updateHighscoreDisplay() {
  highscoreValEl.innerText = highscore;
  if (highscoreLevelEl) {
    highscoreLevelEl.innerText = highscoreLevel;
  }
}

function showTitleScreen() {
  gameState = "standby";
  if (timerId) clearInterval(timerId);
  if (countIntervalId) clearInterval(countIntervalId);
  
  score = 0;
  missCount = 0;
  timeLeft = 60;

  scoreEl.innerText = "スコア: 0";
  missEl.innerText = "ミス: 0";
  timerEl.innerText = "制限時間: 60秒";
  
  updateHighscoreDisplay();
  updatePlanetDisplay();

  jpEl.innerText = "スペースキーかボタンで開始";
  romaEl.innerText = "";
  actionBtn.style.display = "inline-block";
  actionBtn.innerText = "ゲームスタート";
}

function triggerCountdown() {
  if (gameState !== "standby") return;
  gameState = "countdown";
  actionBtn.style.display = "none";
  
  score = 0;
  missCount = 0;
  timeLeft = 60;
  scoreEl.innerText = "スコア: 0";
  missEl.innerText = "ミス: 0";
  timerEl.innerText = "制限時間: 60秒";
  updatePlanetDisplay();

  let count = 3;
  jpEl.innerText = count;
  romaEl.innerText = "まもなくスタート...";

  countIntervalId = setInterval(() => {
    count--;
    if (count > 0) {
      jpEl.innerText = count;
    } else if (count === 0) {
      jpEl.innerText = "スタート！";
      romaEl.innerText = "";
    } else {
      clearInterval(countIntervalId);
      startActualGame();
    }
  }, 1000);
}

function startActualGame() {
  gameState = "playing";
  nextWord();

  timerId = setInterval(() => {
    timeLeft--;
    timerEl.innerText = "制限時間: " + timeLeft + "秒";
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function nextWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  currentWordObj = wordList[randomIndex];
  activeRomas = [...currentWordObj.romas];
  typedIndex = 0;
  updateDisplay();
}

function updateDisplay() {
  jpEl.innerText = currentWordObj.jp;
  const displayRoma = activeRomas[0];
  const typedPart = displayRoma.substring(0, typedIndex);
  const untypedPart = displayRoma.substring(typedIndex);
  romaEl.innerHTML = `<span class="typed">${typedPart}</span><span class="untyped">${untypedPart}</span>`;
}

function updatePlanetDisplay() {
  let currentPlanet = planets[0];
  let nextThreshold = planets[1].threshold;

  for (let i = planets.length - 1; i >= 0; i--) {
    if (score >= planets[i].threshold) {
      currentPlanet = planets[i];
      nextThreshold = planets[i + 1] ? planets[i + 1].threshold : planets[i].threshold + 300;
      break;
    }
  }

  planetIconEl.innerText = currentPlanet.icon;
  planetNameEl.innerText = currentPlanet.name;

  let prevThreshold = currentPlanet.threshold;
  let progress = ((score - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
  if (progress > 100) progress = 100;
  if (progress < 0) progress = 0;
  gaugeBarEl.style.width = progress + "%";
}

function bouncePlanet() {
  planetIconEl.classList.add("bounce");
  setTimeout(() => planetIconEl.classList.remove("bounce"), 200);
}

actionBtn.onclick = () => {
  if (gameState === "standby") {
    triggerCountdown();
  } else if (gameState === "result") {
    showTitleScreen();
  }
};

// ハイスコアリセットボタンの処理
resetBtn.onclick = () => {
  if (confirm("ハイスコアと到達レベルの記録をリセットしますか？")) {
    highscore = 0;
    highscoreLevel = "Lv.1 小さな隕石";
    unlockedLevels = [1];

    localStorage.removeItem("typing_planet_highscore");
    localStorage.removeItem("typing_planet_highlevel");
    localStorage.removeItem("typing_planet_unlocked_levels");

    updateHighscoreDisplay();
  }
};

// 称号一覧（図鑑）ボタンを押したとき
titleListBtn.onclick = () => {
  titleListContainer.innerHTML = ""; 
  
  planets.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("title-card");

    if (unlockedLevels.includes(p.level)) {
      card.classList.add("unlocked");
      card.innerHTML = `<span>${p.icon} ${p.name}</span><span>🔓 解禁済</span>`;
    } else {
      card.innerHTML = `<span>🔒 ？？？？？ (Lv.${p.level})</span><span>🔒 未解放</span>`;
    }
    titleListContainer.appendChild(card);
  });

  titleModal.classList.remove("hidden");
};

// 図鑑の閉じるボタンを押したとき
closeModalBtn.onclick = () => {
  titleModal.classList.add("hidden");
};

// アップデート情報ボタンを押したとき
updateInfoBtn.onclick = () => {
  updateListContainer.innerHTML = "";

  updateNotes.forEach(note => {
    const card = document.createElement("div");
    card.classList.add("update-card");
    card.innerHTML = `
      <div class="update-header">${note.version} (${note.date})</div>
      <div class="update-text">${note.text}</div>
    `;
    updateListContainer.appendChild(card);
  });

  updateModal.classList.remove("hidden");
};

// アップデート情報の閉じるボタンを押したとき
closeUpdateModalBtn.onclick = () => {
  updateModal.classList.add("hidden");
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    if (!titleModal.classList.contains("hidden")) {
      titleModal.classList.add("hidden");
      return;
    }
    if (!updateModal.classList.contains("hidden")) {
      updateModal.classList.add("hidden");
      return;
    }
    e.preventDefault();
    showTitleScreen();
    return;
  }

  if (gameState === "standby") {
    if (e.code === "Space") {
      e.preventDefault();
      triggerCountdown();
    }
    return;
  }

  if (gameState === "result") {
    if (e.code === "Space") {
      e.preventDefault();
      showTitleScreen();
    }
    return;
  }

  if (gameState !== "playing") return;

  if (e.key.length !== 1) return;
  const pressedKey = e.key.toLowerCase();

  const nextCandidates = activeRomas.filter(roma => roma[typedIndex] === pressedKey);

  if (nextCandidates.length > 0) {
    activeRomas = nextCandidates;
    typedIndex++;
    score += 10;
    scoreEl.innerText = "スコア: " + score;
    
    updatePlanetDisplay();
    bouncePlanet();

    const completed = activeRomas.some(roma => typedIndex >= roma.length);
    if (completed) {
      score += 50; 
      scoreEl.innerText = "スコア: " + score;
      updatePlanetDisplay();
      nextWord();
    } else {
      updateDisplay();
    }
  } else {
    missCount++;
    missEl.innerText = "ミス: " + missCount;
    score = Math.max(0, score - 5);
    scoreEl.innerText = "スコア: " + score;
    updatePlanetDisplay();

    containerEl.classList.add("miss-flash");
    setTimeout(() => containerEl.classList.remove("miss-flash"), 100);
  }
});

function endGame() {
  gameState = "result";
  if (timerId) clearInterval(timerId);

  let finalPlanet = planets[0];
  for (let i = planets.length - 1; i >= 0; i--) {
    if (score >= planets[i].threshold) {
      finalPlanet = planets[i];
      break;
    }
  }

  let isNewRecord = false;
  if (score > highscore) {
    highscore = score;
    highscoreLevel = `${finalPlanet.name} ${finalPlanet.icon}`;
    
    localStorage.setItem("typing_planet_highscore", highscore);
    localStorage.setItem("typing_planet_highlevel", highscoreLevel);
    isNewRecord = true;

    // パチンコ風確定演出
    feverOverlay.classList.remove("hidden");
    setTimeout(() => {
      feverOverlay.classList.add("hidden");
    }, 3000);
  }

  // 今回のプレイで到達したレベルがまだ未登録なら、個別に追加して保存
  if (!unlockedLevels.includes(finalPlanet.level)) {
    unlockedLevels.push(finalPlanet.level);
    unlockedLevels.sort((a, b) => a - b);
    localStorage.setItem("typing_planet_unlocked_levels", JSON.stringify(unlockedLevels));
  }

  let resultHtml = `ゲーム終了！<br>最終スコア: ${score}点`;
  if (isNewRecord) {
    resultHtml += ` <span style="color: #f39c12; font-size: 24px;">🎉 確定！新記録！ 🎉</span>`;
  }

  jpEl.innerHTML = resultHtml;
  romaEl.innerHTML = `<span style="font-size:22px; color:#f1c40f;">到達した姿: ${finalPlanet.name} ${finalPlanet.icon}</span><br><span style="font-size:16px; color:#bdc3c7;">ミス回数: ${missCount}回</span>`;
  
  updateHighscoreDisplay();
  actionBtn.style.display = "inline-block";
  actionBtn.innerText = "タイトルに戻る";
}

showTitleScreen();