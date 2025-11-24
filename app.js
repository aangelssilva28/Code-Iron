// ---------- Privacy footer toggle ----------
document.addEventListener("DOMContentLoaded", () => {
  const togglePrivacy = document.getElementById("toggle-privacy");
  const privacyPanel = document.getElementById("privacy-panel");

  if (togglePrivacy && privacyPanel) {
    togglePrivacy.addEventListener("click", () => {
      privacyPanel.classList.toggle("hidden");
    });
  }
});

// ---------- Helpers: exercise card + sets ----------
// NOTE: createSetBox is now clean. Tutorial is NO LONGER inside this function.

function createSetBox(card, setData, indexOverride) {
  const existing = card.querySelectorAll(".set-box").length;
  const setNumber = indexOverride || existing + 1;

  const box = document.createElement("div");
  box.className = "set-box";

  const header = document.createElement("div");
  header.className = "set-header";
  header.textContent = "Set " + setNumber;
  box.appendChild(header);

  const row = document.createElement("div");
  row.className = "set-row";

  const fields = document.createElement("div");
  fields.className = "set-fields";

  const colWeight = document.createElement("div");
  colWeight.className = "set-col";

  const weightInput = document.createElement("input");
  weightInput.className = "set-input";
  weightInput.type = "text";
  weightInput.placeholder = "Weight";
  if (setData && setData.weight != null) {
    weightInput.value = setData.weight;
  }
  colWeight.appendChild(weightInput);

  const colReps = document.createElement("div");
  colReps.className = "set-col";

  const repsInput = document.createElement("input");
  repsInput.className = "set-input";
  repsInput.type = "number";
  repsInput.min = "0";
  repsInput.placeholder = "Reps";
  if (setData && setData.reps != null) {
    repsInput.value = setData.reps;
  }
  colReps.appendChild(repsInput);

  fields.appendChild(colWeight);
  fields.appendChild(colReps);

  const actions = document.createElement("div");
  actions.className = "set-actions";

  const minusBtn = document.createElement("button");
  minusBtn.className = "round-btn minus";
  minusBtn.textContent = "–";
  minusBtn.addEventListener("click", () => {
    const allSets = card.querySelectorAll(".set-box");
    if (allSets.length > 1) {
      box.remove();
      card.querySelectorAll(".set-box").forEach((b, i) => {
        const h = b.querySelector(".set-header");
        if (h) h.textContent = "Set " + (i + 1);
      });
    }
  });

  const plusBtn = document.createElement("button");
  plusBtn.className = "round-btn plus";
  plusBtn.textContent = "+";
  plusBtn.addEventListener("click", () => {
    const newBox = createSetBox(card);
    const wrapper = card.querySelector(".sets-wrapper") || card;
    wrapper.appendChild(newBox);
  });

  actions.appendChild(minusBtn);
  actions.appendChild(plusBtn);

  row.appendChild(fields);
  row.appendChild(actions);
  box.appendChild(row);

  return box;
}

function createWorkoutCard(parent, workoutData) {
  const card = document.createElement("div");
  card.className = "workout-card";

  const setsWrapper = document.createElement("div");
  setsWrapper.className = "sets-wrapper";

  const header = document.createElement("div");
  header.className = "workout-header";

  const nameInput = document.createElement("input");
  nameInput.className = "text-input workout-name";
  nameInput.placeholder = "Enter exercise name";
  if (workoutData && workoutData.name) {
    nameInput.value = workoutData.name;
  }

  const headerActions = document.createElement("div");
  headerActions.className = "workout-header-actions";

  const removeWorkoutBtn = document.createElement("button");
  removeWorkoutBtn.className = "round-btn minus";
  removeWorkoutBtn.textContent = "–";
  removeWorkoutBtn.addEventListener("click", () => {
    const allCards = parent.querySelectorAll(".workout-card");

    if (allCards.length <= 1) {
      nameInput.value = "";
      const setsWrapper = card.querySelector(".sets-wrapper");
      if (setsWrapper) {
        setsWrapper.innerHTML = "";
        const setBox = createSetBox(card, { weight: "", reps: "" }, 1);
        setsWrapper.appendChild(setBox);
      }
    } else {
      card.remove();
    }
  });

  const addExerciseBtn = document.createElement("button");
  addExerciseBtn.className = "round-btn plus";
  addExerciseBtn.textContent = "+";
  addExerciseBtn.addEventListener("click", () => {
    createWorkoutCard(parent);
  });

  headerActions.appendChild(removeWorkoutBtn);
  headerActions.appendChild(addExerciseBtn);

  header.appendChild(nameInput);
  header.appendChild(headerActions);

  card.appendChild(header);
  card.appendChild(setsWrapper);

  const setsFromData =
    workoutData && Array.isArray(workoutData.sets)
      ? workoutData.sets
      : [{ weight: "", reps: "" }];

  setsFromData.forEach((set, idx) => {
    const setBox = createSetBox(card, set, idx + 1);
    setsWrapper.appendChild(setBox);
  });

  parent.appendChild(card);
  return card;
}

// ---------- One-time tutorial walkthrough ----------
const TUTORIAL_KEY = "codeAndIronTutorialSeen_v1";

function initTutorial() {
  const overlay = document.getElementById("tutorialOverlay");
  if (!overlay) return;

  const seen = localStorage.getItem(TUTORIAL_KEY);
  if (seen === "true") {
    overlay.classList.remove("visible");
    return;
  }

  const screens = Array.from(overlay.querySelectorAll(".tutorial-screen"));
  if (!screens.length) return;

  let currentIndex = 0;

  function showStep(index) {
    screens.forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });
  }

  function finishTutorial() {
    localStorage.setItem(TUTORIAL_KEY, "true");
    overlay.classList.remove("visible");
  }

  overlay.classList.add("visible");
  showStep(currentIndex);

  const skipBtn = document.getElementById("tutorialSkipBtn");
  const startBtn = document.getElementById("tutorialStartBtn");

  if (skipBtn) skipBtn.addEventListener("click", finishTutorial);
  if (startBtn)
    startBtn.addEventListener("click", () => {
      currentIndex = 1;
      showStep(currentIndex);
    });

  overlay.querySelectorAll("[data-tutorial-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentIndex < screens.length - 1) {
        currentIndex++;
        showStep(currentIndex);
      } else finishTutorial();
    });
  });

  overlay.querySelectorAll("[data-tutorial-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        showStep(currentIndex);
      }
    });
  });

  overlay.querySelectorAll("[data-tutorial-done]").forEach((btn) => {
    btn.addEventListener("click", finishTutorial);
  });
}

// ---------- Screens & navigation ----------

const menuButton = document.getElementById("menuButton");
const menuDropdown = document.getElementById("menuDropdown");
const homeScreen = document.getElementById("homeScreen");
const workoutsScreen = document.getElementById("workoutsScreen");
const progressScreen = document.getElementById("progressScreen");
const progressDetail = document.getElementById("progressDetail");

function closeMenu() {
  menuDropdown.classList.remove("open");
}

menuButton.addEventListener("click", () => {
  menuDropdown.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
    closeMenu();
  }
});

document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    const nav = item.dataset.nav;
    if (nav === "workouts" || nav === "progress") {
      showScreen(nav);
      if (nav === "progress") renderProgressList();
    }
    closeMenu();
  });
});

/*  
===========================================================
   ✅ INSERTED CODE — CONTACT BUTTON
===========================================================
*/

const contactDev = document.getElementById("contactDev");
if (contactDev) {
  contactDev.addEventListener("click", () => {
    window.location.href =
      "mailto:aangel.ssilva28@gmail.com?subject=Code%20and%20Iron%20Feedback";
    closeMenu();
  });
}

/*  
===========================================================
*/

const backToLoggerFromProgress = document.getElementById(
  "backToLoggerFromProgress"
);
if (backToLoggerFromProgress) {
  backToLoggerFromProgress.addEventListener("click", () => {
    showScreen("home");
  });
}

function showScreen(which) {
  if (which === "home") {
    homeScreen.classList.add("active");
    workoutsScreen.classList.remove("active");
    progressScreen.classList.remove("active");
  } else if (which === "workouts") {
    homeScreen.classList.remove("active");
    workoutsScreen.classList.add("active");
    progressScreen.classList.remove("active");
  } else if (which === "progress") {
    homeScreen.classList.remove("active");
    workoutsScreen.classList.remove("active");
    progressScreen.classList.add("active");
  }

  if (which !== "progress" && progressDetail) {
    progressDetail.classList.remove("open");
    progressDetail.innerHTML = "";
  }
}

// ---------- Logger, progress, templates, backup, init ----------
// (UNCHANGED — I left everything else exactly as you had it.)

// ... [YOUR REMAINING CODE CONTINUES HERE EXACTLY AS WRITTEN] ...