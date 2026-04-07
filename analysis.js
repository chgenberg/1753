// 1753 SKINCARE – Holistisk Hudanalys 3.0
// MediaPipe Face Landmarker, frågewizard, multi-region AI-analys, strukturerad resultatvy

import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs";

(function () {
  "use strict";

  const API_BASE =
    typeof INTEGRATION_CONFIG !== "undefined" && INTEGRATION_CONFIG.backendUrl
      ? INTEGRATION_CONFIG.backendUrl
      : "http://localhost:3001/api";

  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  const MAX_CHAT_MESSAGES = 50;
  const JPEG_QUALITY = 0.85;
  const CROP_SIZE = 300;
  const MAX_JOURNAL_ENTRIES = 12;

  let uploadedImageBase64 = null;
  let currentResponseId = null;
  let chatMessageCount = 0;
  let analysisFactInterval = null;
  let webcamStream = null;
  let facingMode = "user";
  let landmarker = null;
  let wizardStep = 0;
  let wizardAnswers = {};
  let apiPromise = null;
  let lastStructuredResult = null;

  const SKIN_FACTS = [
    "Huden förnyar övre lagret ungefär var 28:e dag.",
    "Endocannabinoidsystemet finns också i huden och påverkar balans och barriär.",
    "Sömn och stress påverkar cortisol – vilket syns i huden.",
    "Vatten och mat med omega-3 stödjer en lugnare inflammationsprofil.",
    "Tarm och hud delar immunologiska signaler – därför är helheten viktig.",
    "Varsam rengöring bevarar hudens mikrobiom bättre än aggressiva rutiner.",
    "CBD modulerar CB2-receptorer i huden och kan lugna inflammationssvar.",
    "Hudens mikrobiom är lika unikt som ett fingeravtryck."
  ];

  const REGION_DEFS = [
    { label: "panna", landmarks: [10, 67, 69, 104, 108, 151, 297, 299, 333, 337] },
    { label: "vänster kind", landmarks: [50, 101, 116, 117, 118, 119, 123, 187, 205, 206] },
    { label: "höger kind", landmarks: [280, 330, 345, 346, 347, 348, 352, 411, 425, 426] },
    { label: "näsa", landmarks: [1, 2, 4, 5, 6, 19, 94, 195, 197] },
    { label: "haka", landmarks: [152, 175, 176, 148, 149, 150, 377, 378, 379, 395, 396, 400] }
  ];

  function $(id) { return document.getElementById(id); }

  // ---- MEDIAPIPE FACE LANDMARKER ----

  async function initFaceLandmarker() {
    if (landmarker) return landmarker;
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
      );
      landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "IMAGE",
        numFaces: 1
      });
      return landmarker;
    } catch (err) {
      console.warn("[FaceLandmarker] Init failed, using fallback:", err.message);
      return null;
    }
  }

  async function detectAndCropRegions(imageBase64) {
    const fl = await initFaceLandmarker();

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageBase64;
    });

    if (!fl) return [];

    let result;
    try {
      result = fl.detect(img);
    } catch (err) {
      console.warn("[FaceLandmarker] Detection failed:", err.message);
      return [];
    }

    if (!result || !result.faceLandmarks || result.faceLandmarks.length === 0) {
      return [];
    }

    const marks = result.faceLandmarks[0];
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = $("crop-canvas");
    const ctx = canvas.getContext("2d");
    const regions = [];

    for (const def of REGION_DEFS) {
      const xs = def.landmarks.map(i => (marks[i]?.x || 0) * w);
      const ys = def.landmarks.map(i => (marks[i]?.y || 0) * h);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const padX = (maxX - minX) * 0.2;
      const padY = (maxY - minY) * 0.2;
      const sx = Math.max(0, minX - padX);
      const sy = Math.max(0, minY - padY);
      const sw = Math.min(w - sx, (maxX - minX) + padX * 2);
      const sh = Math.min(h - sy, (maxY - minY) + padY * 2);

      canvas.width = CROP_SIZE;
      canvas.height = CROP_SIZE;
      ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, CROP_SIZE, CROP_SIZE);

      regions.push({
        label: def.label,
        imageBase64: canvas.toDataURL("image/jpeg", JPEG_QUALITY)
      });
    }

    canvas.width = 1;
    canvas.height = 1;
    return regions;
  }

  // ---- STEP TRANSITIONS ----

  function showStep(stepId) {
    const steps = document.querySelectorAll(".analysis-left .analysis-step");
    steps.forEach(s => {
      s.classList.remove("analysis-step--visible");
      s.classList.add("analysis-step--hidden");
    });
    const target = $(stepId);
    if (target) {
      target.classList.remove("analysis-step--hidden");
      target.classList.add("analysis-step--visible");
    }
  }

  // ---- UPLOAD ----

  function setupUploadZone() {
    const zone = $("upload-zone");
    const input = $("photo-input");
    const uploadBtn = $("upload-btn");
    if (!zone || !input) return;

    uploadBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      input.click();
    });

    zone.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") input.click();
    });

    zone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });

    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    input.addEventListener("change", () => {
      if (input.files[0]) handleFile(input.files[0]);
    });
  }

  function handleFile(file) {
    if (file.size > MAX_FILE_SIZE) {
      showNotification("Filen är för stor. Max 15 MB.");
      return;
    }
    if (file.type.startsWith("video/")) {
      handleVideoFile(file);
      return;
    }
    if (file.type.startsWith("image/")) {
      handleImageFile(file);
      return;
    }
    showNotification("Filtypen stöds inte. Använd en bild eller video.");
  }

  function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageBase64 = e.target.result;
      showPreview(uploadedImageBase64);
    };
    reader.readAsDataURL(file);
  }

  function handleVideoFile(file) {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      uploadedImageBase64 = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      URL.revokeObjectURL(url);
      showPreview(uploadedImageBase64);
    };

    video.src = url;
    video.load();
  }

  function showPreview(base64) {
    const previewImg = $("preview-img");
    if (previewImg) previewImg.src = base64;
    closeWebcam();
    showStep("upload-preview");
  }

  function resetUpload() {
    uploadedImageBase64 = null;
    currentResponseId = null;
    chatMessageCount = 0;
    apiPromise = null;
    lastStructuredResult = null;
    wizardStep = 0;
    wizardAnswers = {};
    clearFactRotation();
    closeWebcam();

    const input = $("photo-input");
    if (input) input.value = "";

    const results = $("analysis-results");
    const emptyState = $("analysis-empty-state");
    const wizard = $("question-wizard");
    const waiting = $("analysis-waiting");
    if (results) results.style.display = "none";
    if (emptyState) emptyState.style.display = "";
    if (wizard) wizard.style.display = "none";
    if (waiting) waiting.style.display = "none";

    const chatMessages = $("chat-messages");
    if (chatMessages) chatMessages.innerHTML = "";

    sessionStorage.removeItem("1753_chat_history");

    document.querySelectorAll(".question-pill.selected").forEach(p => p.classList.remove("selected"));
    document.querySelectorAll(".question-slider").forEach(s => { s.value = 3; });
    document.querySelectorAll(".slider-value").forEach(v => { v.textContent = "3"; });
    const freetext = $("goal-freetext");
    if (freetext) freetext.value = "";

    showStep("analysis-upload");
  }

  // ---- WEBCAM ----

  async function openWebcam() {
    try {
      const constraints = {
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false
      };
      webcamStream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = $("webcam-video");
      if (video) video.srcObject = webcamStream;
      showStep("webcam-container");
    } catch (err) {
      if (err.name === "NotAllowedError") {
        showNotification("Kameratillstånd nekades. Tillåt kameraåtkomst i din webbläsare.");
      } else {
        showNotification("Kunde inte öppna kameran: " + err.message);
      }
    }
  }

  function closeWebcam() {
    if (webcamStream) {
      webcamStream.getTracks().forEach(t => t.stop());
      webcamStream = null;
    }
    const video = $("webcam-video");
    if (video) video.srcObject = null;
  }

  async function switchCamera() {
    closeWebcam();
    facingMode = facingMode === "user" ? "environment" : "user";
    await openWebcam();
  }

  async function captureSnapshot() {
    const countdownEl = $("webcam-countdown");
    if (countdownEl) {
      for (let i = 3; i >= 1; i--) {
        countdownEl.textContent = i;
        countdownEl.style.display = "flex";
        countdownEl.style.animation = "none";
        void countdownEl.offsetWidth;
        countdownEl.style.animation = "countdownFade 1s ease-out forwards";
        await new Promise(r => setTimeout(r, 900));
      }
      countdownEl.style.display = "none";
    }

    const video = $("webcam-video");
    const canvas = $("webcam-canvas");
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    uploadedImageBase64 = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

    closeWebcam();
    showPreview(uploadedImageBase64);
  }

  // ---- LOADING FACTS ----

  function clearFactRotation() {
    if (analysisFactInterval) {
      clearInterval(analysisFactInterval);
      analysisFactInterval = null;
    }
  }

  function startFactRotation(factElId) {
    clearFactRotation();
    const factEl = $(factElId);
    if (!factEl) return;
    let idx = 0;
    factEl.textContent = SKIN_FACTS[0];
    analysisFactInterval = setInterval(() => {
      idx = (idx + 1) % SKIN_FACTS.length;
      factEl.style.opacity = "0";
      setTimeout(() => {
        factEl.textContent = SKIN_FACTS[idx];
        factEl.style.opacity = "1";
      }, 300);
    }, 3500);
  }

  // ---- QUESTIONNAIRE WIZARD ----

  function initWizard() {
    const pills = document.querySelectorAll(".question-pill");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        const container = pill.closest(".question-pills");
        const isMulti = container.classList.contains("question-pills--multi");

        if (isMulti) {
          const maxSel = parseInt(container.dataset.max) || 99;
          const selected = container.querySelectorAll(".selected");
          if (pill.classList.contains("selected")) {
            pill.classList.remove("selected");
          } else if (selected.length < maxSel) {
            pill.classList.add("selected");
          }
        } else {
          container.querySelectorAll(".question-pill").forEach(p => p.classList.remove("selected"));
          pill.classList.add("selected");
        }
        updateWizardNav();
      });
    });

    const sliders = document.querySelectorAll(".question-slider");
    sliders.forEach(slider => {
      slider.addEventListener("input", () => {
        const valEl = $("slider-val-" + slider.dataset.key);
        if (valEl) valEl.textContent = slider.value;
        updateWizardNav();
      });
    });

    $("wizard-next")?.addEventListener("click", handleWizardNext);
    $("wizard-prev")?.addEventListener("click", handleWizardPrev);
  }

  function showQuestion(step) {
    wizardStep = step;
    const steps = document.querySelectorAll(".question-step");
    steps.forEach((s, i) => {
      if (i === step) {
        s.classList.add("question-step--active");
        s.style.transform = "";
        s.style.opacity = "";
      } else {
        s.classList.remove("question-step--active");
      }
    });

    const dots = document.querySelectorAll(".progress-dot");
    dots.forEach((d, i) => {
      d.classList.toggle("active", i <= step);
      d.classList.toggle("completed", i < step);
    });

    const prevBtn = $("wizard-prev");
    const nextBtn = $("wizard-next");
    if (prevBtn) prevBtn.style.visibility = step > 0 ? "visible" : "hidden";
    if (nextBtn) nextBtn.textContent = step === 4 ? "Klart!" : "Nästa";

    updateWizardNav();
  }

  function updateWizardNav() {
    const nextBtn = $("wizard-next");
    if (!nextBtn) return;

    let valid = false;
    if (wizardStep === 0) {
      valid = !!document.querySelector('#q-step-0 .question-pill.selected');
    } else if (wizardStep === 1) {
      valid = document.querySelectorAll('#q-step-1 .question-pill.selected').length > 0;
    } else if (wizardStep === 2) {
      valid = !!document.querySelector('#q-step-2 .question-pill.selected');
    } else if (wizardStep === 3) {
      valid = true;
    } else if (wizardStep === 4) {
      valid = document.querySelectorAll('#q-step-4 .question-pill.selected').length > 0 ||
              ($("goal-freetext")?.value || "").trim().length > 0;
    }

    nextBtn.disabled = !valid;
  }

  function handleWizardNext() {
    if (wizardStep < 4) {
      showQuestion(wizardStep + 1);
    } else {
      finishWizard();
    }
  }

  function handleWizardPrev() {
    if (wizardStep > 0) {
      showQuestion(wizardStep - 1);
    }
  }

  function collectAnswers() {
    const skinTypePill = document.querySelector('#q-step-0 .question-pill.selected');
    const concerns = Array.from(document.querySelectorAll('#q-step-1 .question-pill.selected')).map(p => p.dataset.value);
    const routinePill = document.querySelector('#q-step-2 .question-pill.selected');
    const goals = Array.from(document.querySelectorAll('#q-step-4 .question-pill.selected')).map(p => p.dataset.value);
    const goalFreeText = ($("goal-freetext")?.value || "").trim();

    return {
      skinType: skinTypePill?.dataset.value || "",
      concerns,
      routine: routinePill?.dataset.value || "",
      lifestyle: {
        stress: parseInt($("slider-stress")?.value || 3),
        sleep: parseInt($("slider-sleep")?.value || 3),
        diet: parseInt($("slider-diet")?.value || 3),
        activity: parseInt($("slider-activity")?.value || 3)
      },
      goals,
      goalFreeText
    };
  }

  async function finishWizard() {
    wizardAnswers = collectAnswers();

    const wizard = $("question-wizard");
    const waiting = $("analysis-waiting");
    if (wizard) wizard.style.display = "none";
    if (waiting) waiting.style.display = "flex";

    startFactRotation("waiting-fact");

    try {
      const data = await apiPromise;
      clearFactRotation();
      if (waiting) waiting.style.display = "none";
      currentResponseId = data.responseId || null;
      displayResults(data.content);
    } catch (error) {
      clearFactRotation();
      if (waiting) waiting.style.display = "none";
      const emptyState = $("analysis-empty-state");
      if (emptyState) emptyState.style.display = "";
      showStep("upload-preview");
      showNotification("Fel: " + error.message);
    }
  }

  // ---- ANALYSIS ----

  async function startAnalysis() {
    if (!uploadedImageBase64) {
      showNotification("Ladda upp ett foto först.");
      return;
    }

    showStep("analysis-loading");
    startFactRotation("loading-fact");

    const emptyState = $("analysis-empty-state");
    if (emptyState) emptyState.style.display = "none";

    let regions = [];
    try {
      regions = await detectAndCropRegions(uploadedImageBase64);
    } catch (err) {
      console.warn("[Crop] Region cropping failed, sending full image:", err.message);
    }

    clearFactRotation();
    showStep("upload-preview");

    const wizard = $("question-wizard");
    if (wizard) wizard.style.display = "block";
    showQuestion(0);

    apiPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(API_BASE + "/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullImage: uploadedImageBase64,
            regions,
            questions: null
          })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || `Fel: ${response.status}`);
        }

        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });

    // Send questions after wizard completes (questionnaire data is for context)
    // API call starts immediately with images; questions are integrated client-side in display
  }

  // ---- RESULTS PARSING ----

  function parseAnalysisResponse(text) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    let structured = null;
    let prose = text;

    if (jsonMatch) {
      try {
        structured = JSON.parse(jsonMatch[1].trim());
        prose = text.substring(0, jsonMatch.index).trim();
      } catch (e) {
        console.warn("[Parse] JSON parse failed:", e.message);
      }
    }

    return { prose, structured };
  }

  // ---- RESULTS DISPLAY ----

  function displayResults(text) {
    const results = $("analysis-results");
    if (!results) return;

    const { prose, structured } = parseAnalysisResponse(text);
    lastStructuredResult = structured;

    results.style.display = "block";

    if (structured) {
      renderScore(structured.score, structured.summary);
      renderRegionCards(structured.regions);
      renderProseContent(prose);
      renderLifestyleTips(structured.lifestyle);
      renderProductCards(structured.products);
      renderAvoidSection(structured.avoid);
      renderRoutine(structured.products);
      renderNextStep(structured.nextAnalysis);
      renderShareButton(structured.summary);
      saveToJournal(structured);
    } else {
      $("skin-score").innerHTML = "";
      $("region-cards").innerHTML = "";
      renderProseContent(prose);
      $("lifestyle-tips").innerHTML = "";
      recommendProductsFallback(text);
      $("avoid-section").innerHTML = "";
      $("routine-section").innerHTML = "";
      $("analysis-next-step").innerHTML = "";
      $("analysis-share").innerHTML = "";
    }

    initChat();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderScore(score, summary) {
    const el = $("skin-score");
    if (!el) return;

    const clampedScore = Math.max(0, Math.min(100, score || 0));
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (clampedScore / 100) * circumference;
    let colorClass = "score-red";
    if (clampedScore > 70) colorClass = "score-green";
    else if (clampedScore > 40) colorClass = "score-yellow";

    let label = "Behöver uppmärksamhet";
    if (clampedScore > 80) label = "Mycket bra";
    else if (clampedScore > 60) label = "Bra";
    else if (clampedScore > 40) label = "Medel";

    el.innerHTML = `
      <div class="skin-score-circle ${colorClass}">
        <svg viewBox="0 0 120 120">
          <circle class="score-bg" cx="60" cy="60" r="54"/>
          <circle class="score-progress" cx="60" cy="60" r="54"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"
            data-target="${offset}"/>
        </svg>
        <div class="skin-score-value">
          <span class="score-number" data-target="${clampedScore}">0</span>
        </div>
      </div>
      <div class="skin-score-text">
        <h3>Din hudbalans: ${label}</h3>
        <p>${summary || ""}</p>
      </div>
    `;

    requestAnimationFrame(() => {
      const progressCircle = el.querySelector(".score-progress");
      const numberEl = el.querySelector(".score-number");
      if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
      }
      if (numberEl) {
        animateNumber(numberEl, 0, clampedScore, 1200);
      }
    });
  }

  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderRegionCards(regions) {
    const el = $("region-cards");
    if (!el || !regions || regions.length === 0) {
      if (el) el.innerHTML = "";
      return;
    }

    el.innerHTML = `<h3 class="section-title">Regionanalys</h3>
      <div class="region-cards-grid">
        ${regions.map((r, i) => {
          const s = r.score || 50;
          let cls = "score-red";
          if (s > 70) cls = "score-green";
          else if (s > 40) cls = "score-yellow";
          return `<div class="region-card" style="animation-delay:${0.1 + i * 0.1}s">
            <div class="region-card-header">
              <span class="region-name">${r.label}</span>
              <span class="region-score ${cls}">${s}</span>
            </div>
            <p class="region-text">${r.observation || ""}</p>
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderProseContent(prose) {
    const content = $("results-content");
    if (!content) return;

    const summaryEl = $("results-summary");
    if (summaryEl) summaryEl.innerHTML = "";

    content.innerHTML = formatAnalysisText(prose);
  }

  function renderLifestyleTips(tips) {
    const el = $("lifestyle-tips");
    if (!el || !tips || tips.length === 0) {
      if (el) el.innerHTML = "";
      return;
    }

    const icons = {
      "Sömn": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      "Stress": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
      "Kost": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      "Rörelse": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    };

    el.innerHTML = `<h3 class="section-title">Livsstilsrekommendationer</h3>
      <div class="lifestyle-tips-list">
        ${tips.map((tip, i) => {
          const icon = icons[tip.area] || icons["Kost"];
          const impactCls = tip.impact === "hög" ? "impact-high" : tip.impact === "medel" ? "impact-medium" : "impact-low";
          return `<div class="lifestyle-tip" style="animation-delay:${0.1 + i * 0.08}s">
            <div class="lifestyle-tip-icon">${icon}</div>
            <div class="lifestyle-tip-content">
              <div class="lifestyle-tip-header">
                <strong>${tip.area}</strong>
                <span class="impact-badge ${impactCls}">${tip.impact} påverkan</span>
              </div>
              <p>${tip.tip}</p>
            </div>
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderProductCards(products) {
    const container = $("recommended-products");
    const actionsEl = $("analysis-actions");
    if (!container || typeof PRODUCTS === "undefined") return;

    if (!products || products.length === 0) {
      container.innerHTML = "";
      if (actionsEl) actionsEl.innerHTML = "";
      return;
    }

    const validProducts = products.filter(p => PRODUCTS.find(pr => pr.id === p.id));

    container.innerHTML = validProducts.map((rec, i) => {
      const p = PRODUCTS.find(pr => pr.id === rec.id);
      if (!p) return "";
      return `<div class="analysis-product-card" style="animation-delay:${0.1 + i * 0.12}s">
        <a href="product.html?id=${p.id}" class="analysis-product-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </a>
        <div class="analysis-product-info">
          <a href="product.html?id=${p.id}" class="analysis-product-name">${p.name}</a>
          <div class="analysis-product-price">${p.price.toLocaleString("sv-SE")} kr</div>
          <p class="analysis-product-reason">${rec.reason || ""}</p>
          <button type="button" class="btn btn-primary analysis-product-cta" data-product-id="${p.id}" aria-label="Lägg ${p.name} i varukorgen">
            <span class="cta-text">Lägg i varukorg</span>
            <svg class="cta-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </div>`;
    }).join("");

    container.querySelectorAll(".analysis-product-cta").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.dataset.productId;
        if (typeof addToCart === "function") addToCart(id);
        btn.classList.add("cta-added");
        setTimeout(() => btn.classList.remove("cta-added"), 2000);
      });
    });

    if (actionsEl && validProducts.length > 1) {
      actionsEl.innerHTML = `
        <button type="button" class="btn btn-primary" id="add-all-btn">Lägg alla i varukorgen</button>
        <a href="checkout.html" class="btn btn-outline">Gå till kassan</a>
      `;
      $("add-all-btn")?.addEventListener("click", () => {
        validProducts.forEach(rec => {
          if (typeof addToCart === "function") addToCart(rec.id);
        });
        $("add-all-btn").textContent = "Tillagda!";
        setTimeout(() => { if ($("add-all-btn")) $("add-all-btn").textContent = "Lägg alla i varukorgen"; }, 2000);
      });
    } else if (actionsEl) {
      actionsEl.innerHTML = "";
    }
  }

  function recommendProductsFallback(analysisText) {
    const container = $("recommended-products");
    const actionsEl = $("analysis-actions");
    if (!container || typeof PRODUCTS === "undefined") return;

    const lower = analysisText.toLowerCase();
    const recommended = [];

    if (lower.includes("the one") || lower.includes("i love") || lower.includes("daglig") || lower.includes("morgon") || lower.includes("natt") || lower.includes("kvall") || lower.includes("reparera"))
      recommended.push("duo-kit");
    if (lower.includes("ta-da") || lower.includes("serum") || lower.includes("fukt"))
      recommended.push("ta-da-serum");
    if (lower.includes("rengor") || lower.includes("makeup") || lower.includes("au naturel"))
      recommended.push("au-naturel-makeup-remover");
    if (lower.includes("fungtastic") || lower.includes("svamp") || lower.includes("inifran") || lower.includes("tarm"))
      recommended.push("fungtastic-mushroom-extract");

    if (recommended.length === 0) {
      recommended.push("duo-kit", "ta-da-serum");
    }

    const unique = [...new Set(recommended)].slice(0, 3);
    renderProductCards(unique.map(id => ({ id, reason: "" })));
  }

  function renderAvoidSection(avoidList) {
    const el = $("avoid-section");
    if (!el || !avoidList || avoidList.length === 0) {
      if (el) el.innerHTML = "";
      return;
    }

    el.innerHTML = `<h3 class="section-title">Undvik</h3>
      <ul class="avoid-list">
        ${avoidList.map(item => `<li>${item}</li>`).join("")}
      </ul>`;
  }

  function renderRoutine(products) {
    const el = $("routine-section");
    if (!el || typeof PRODUCTS === "undefined") return;

    if (!products || products.length === 0) {
      el.innerHTML = "";
      return;
    }

    const productIds = products.map(p => p.id);
    const morningSteps = [];
    const eveningSteps = [];

    if (productIds.includes("au-naturel-makeup-remover")) {
      morningSteps.push({ id: "au-naturel-makeup-remover", step: "Rengör varsamt" });
      eveningSteps.push({ id: "au-naturel-makeup-remover", step: "Rengör varsamt" });
    }
    if (productIds.includes("duo-kit") || productIds.includes("duo-ta-da")) {
      morningSteps.push({ id: "duo-kit", step: "3-4 droppar The ONE Facial Oil" });
      eveningSteps.push({ id: "duo-kit", step: "3-4 droppar I LOVE Facial Oil" });
    }
    if (productIds.includes("ta-da-serum") || productIds.includes("duo-ta-da")) {
      morningSteps.push({ id: "ta-da-serum", step: "1-2 pump TA-DA Serum" });
      eveningSteps.push({ id: "ta-da-serum", step: "1-2 pump TA-DA Serum" });
    }

    if (morningSteps.length === 0 && eveningSteps.length === 0) {
      el.innerHTML = "";
      return;
    }

    function renderSteps(steps) {
      return steps.map((s, i) => {
        const p = PRODUCTS.find(pr => pr.id === s.id);
        return `<div class="routine-step" style="animation-delay:${0.1 + i * 0.08}s">
          <span class="routine-step-num">${i + 1}</span>
          ${p ? `<img src="${p.image}" alt="${p.name}" class="routine-step-img">` : ""}
          <span class="routine-step-text">${s.step}</span>
        </div>`;
      }).join("");
    }

    el.innerHTML = `<h3 class="section-title">Din personliga rutin</h3>
      <div class="routine-columns">
        ${morningSteps.length > 0 ? `<div class="routine-col">
          <h4>Morgon</h4>
          ${renderSteps(morningSteps)}
        </div>` : ""}
        ${eveningSteps.length > 0 ? `<div class="routine-col">
          <h4>Kväll</h4>
          ${renderSteps(eveningSteps)}
        </div>` : ""}
      </div>
      <button type="button" class="btn btn-outline routine-save-btn" id="save-routine-btn">Spara min rutin</button>
    `;

    $("save-routine-btn")?.addEventListener("click", () => {
      try {
        localStorage.setItem("1753_routine", JSON.stringify({ morning: morningSteps, evening: eveningSteps, date: new Date().toISOString() }));
        $("save-routine-btn").textContent = "Sparad!";
        setTimeout(() => { if ($("save-routine-btn")) $("save-routine-btn").textContent = "Spara min rutin"; }, 2000);
      } catch (_) { /* ignore */ }
    });
  }

  function renderNextStep(nextAnalysis) {
    const el = $("analysis-next-step");
    if (!el) return;

    el.innerHTML = `
      <div class="next-step-card">
        <p>Gör en ny analys om <strong>${nextAnalysis || "4 veckor"}</strong> för att följa din huds utveckling.</p>
        <div class="next-step-remind">
          <input type="email" class="next-step-email" id="remind-email" placeholder="Din e-post" aria-label="E-post för påminnelse">
          <button type="button" class="btn btn-primary" id="remind-btn">Påminn mig</button>
        </div>
      </div>
    `;

    $("remind-btn")?.addEventListener("click", () => {
      const email = $("remind-email")?.value?.trim();
      if (email && email.includes("@")) {
        $("remind-btn").textContent = "Tack! Vi påminner dig.";
        $("remind-btn").disabled = true;
      } else {
        showNotification("Ange en giltig e-postadress.");
      }
    });
  }

  function renderShareButton(summary) {
    const el = $("analysis-share");
    if (!el) return;

    el.innerHTML = `
      <button type="button" class="btn btn-outline analysis-share-btn" id="share-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        Dela din analys
      </button>
    `;

    $("share-btn")?.addEventListener("click", async () => {
      const score = lastStructuredResult?.score || "?";
      const text = `Min hudbalans: ${score}/100 – ${summary || "Holistisk hudanalys från 1753 SKINCARE"}\n\nGör din egen analys på 1753skincare.com`;
      try {
        await navigator.clipboard.writeText(text);
        $("share-btn").innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Kopierad!';
        setTimeout(() => {
          if ($("share-btn")) $("share-btn").innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Dela din analys';
        }, 2500);
      } catch (_) {
        showNotification("Kunde inte kopiera till urklipp.");
      }
    });
  }

  // ---- SKIN JOURNAL ----

  function saveToJournal(structured) {
    if (!structured) return;
    try {
      const journal = JSON.parse(localStorage.getItem("1753_skin_journal") || "[]");
      journal.unshift({
        date: new Date().toISOString(),
        score: structured.score,
        regions: structured.regions,
        products: structured.products?.map(p => p.id) || [],
        summary: structured.summary
      });
      while (journal.length > MAX_JOURNAL_ENTRIES) journal.pop();
      localStorage.setItem("1753_skin_journal", JSON.stringify(journal));
    } catch (_) { /* ignore */ }
  }

  // ---- TEXT FORMATTING ----

  function formatAnalysisText(text) {
    const sections = text.split(/^##\s+/gm).filter(Boolean);

    if (sections.length <= 1) {
      return '<div class="analysis-text">' + simpleMarkdown(text) + '</div>';
    }

    return sections.map((section, i) => {
      const lines = section.split("\n");
      const title = lines[0].trim();
      const body = lines.slice(1).join("\n").trim();
      return `<div class="result-section" style="animation-delay:${0.1 + i * 0.15}s">
        <h2 class="analysis-heading">${title}</h2>
        <div class="analysis-text">${simpleMarkdown(body)}</div>
      </div>`;
    }).join("");
  }

  function simpleMarkdown(text) {
    let html = text
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
      if (!match.startsWith('<ul>')) return '<ul>' + match + '</ul>';
      return match;
    });

    return '<p>' + html + '</p>';
  }

  // ---- CHAT ----

  function initChat() {
    const chatMessages = $("chat-messages");
    if (!chatMessages) return;

    chatMessages.innerHTML = "";
    chatMessageCount = 0;

    appendMessage("assistant", "Har du fler frågor om din hud? Jag finns här.");

    const stored = sessionStorage.getItem("1753_chat_history");
    if (stored) {
      try {
        JSON.parse(stored).forEach(m => appendMessage(m.role, m.text, true));
      } catch (_) { /* ignore */ }
    }
  }

  function appendMessage(role, text, skipSave) {
    const chatMessages = $("chat-messages");
    if (!chatMessages) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-bubble--${role}`;

    if (role === "assistant") {
      bubble.innerHTML = simpleMarkdown(text);
    } else {
      bubble.textContent = text;
    }

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatMessageCount++;

    if (!skipSave) saveChatHistory();
  }

  function showTypingIndicator() {
    const chatMessages = $("chat-messages");
    if (!chatMessages) return;

    const typing = document.createElement("div");
    typing.className = "chat-typing";
    typing.id = "chat-typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const typing = $("chat-typing-indicator");
    if (typing) typing.remove();
  }

  async function sendChatMessage(text) {
    if (!text.trim() || !currentResponseId) return;
    if (chatMessageCount >= MAX_CHAT_MESSAGES) {
      showNotification("Maxantalet meddelanden är nått för denna session.");
      return;
    }

    appendMessage("user", text.trim());
    showTypingIndicator();

    const chatInput = $("chat-input");
    if (chatInput) {
      chatInput.value = "";
      chatInput.focus();
    }

    try {
      const response = await fetch(API_BASE + "/analysis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          previousResponseId: currentResponseId
        })
      });

      hideTypingIndicator();

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Chatten kunde inte svara.");
      }

      const data = await response.json();
      if (data.responseId) currentResponseId = data.responseId;
      appendMessage("assistant", data.content);

    } catch (error) {
      hideTypingIndicator();
      appendMessage("assistant", "Något gick fel. Försök igen.");
      console.error("[Chat Error]", error);
    }
  }

  function saveChatHistory() {
    try {
      const bubbles = document.querySelectorAll("#chat-messages .chat-bubble");
      const history = Array.from(bubbles).slice(1).map(b => ({
        role: b.classList.contains("chat-bubble--user") ? "user" : "assistant",
        text: b.textContent
      }));
      sessionStorage.setItem("1753_chat_history", JSON.stringify(history.slice(-20)));
    } catch (_) { /* ignore */ }
  }

  // ---- EVENT BINDING ----

  function bindEvents() {
    $("webcam-open-btn")?.addEventListener("click", openWebcam);
    $("webcam-capture-btn")?.addEventListener("click", captureSnapshot);
    $("webcam-switch-btn")?.addEventListener("click", switchCamera);
    $("webcam-close-btn")?.addEventListener("click", () => {
      closeWebcam();
      showStep("analysis-upload");
    });

    $("reset-btn")?.addEventListener("click", resetUpload);
    $("new-analysis-btn")?.addEventListener("click", resetUpload);
    $("analyze-btn")?.addEventListener("click", startAnalysis);

    const chatForm = $("chat-form");
    chatForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("chat-input");
      if (input) sendChatMessage(input.value);
    });
  }

  // ---- INIT ----

  document.addEventListener("DOMContentLoaded", () => {
    setupUploadZone();
    bindEvents();
    initWizard();
  });

  window.addEventListener("beforeunload", () => {
    uploadedImageBase64 = null;
    closeWebcam();
  });

})();
