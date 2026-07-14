const scenes = {
  intro: document.getElementById("introScene"),
  eclipse: document.getElementById("eclipseScene"),
  lake: document.getElementById("lakeScene"),
  sunrise: document.getElementById("sunriseScene"),
  final: document.getElementById("finalScene")
};


const beginButton =
  document.getElementById("beginButton");

const introOpening =
  document.getElementById("introOpening");

const introSubtitle =
  document.getElementById("introSubtitle");

const eclipseText =
  document.getElementById("eclipseText");

const lake =
  document.getElementById("lake");

const rippleLayer =
  document.getElementById("rippleLayer");

const lakeSubtitle =
  document.getElementById("lakeSubtitle");

const lakeSecretStar =
  document.getElementById("lakeSecretStar");

const fallingStar =
  document.getElementById("fallingStar");

const secretWaterRipple =
  document.getElementById("secretWaterRipple");

const secretLakeMessage =
  document.getElementById("secretLakeMessage");

const sunriseText =
  document.getElementById("sunriseText");

const voiceStatus =
  document.getElementById("voiceStatus");

const voiceButton =
  document.getElementById("voiceButton");

const finalSecretStar =
  document.getElementById("finalSecretStar");

const finalSecretOverlay =
  document.getElementById("finalSecretOverlay");

const closeSecretButton =
  document.getElementById("closeSecretButton");

const nightAudio =
  document.getElementById("nightAudio");

const morningAudio =
  document.getElementById("morningAudio");

const voiceAudio =
  document.getElementById("voiceAudio");


nightAudio.volume = 0.26;
morningAudio.volume = 0;
voiceAudio.volume = 1;


let experienceStarted = false;

let lakeClickCount = 0;
let rippleMessageIndex = 0;

let secretStarFound = false;
let secretSequenceActive = false;

let sunriseStarted = false;
let voiceStarted = false;


const eclipseMessages = [
  "There were days we did not know where we were going.",
  "Days we misunderstood each other.",
  "Days everything felt heavier than it should have.",
  "Days I was scared we might lose ourselves.",
  "But somehow...",
  "we stayed.",
  "And in the dark, I learned what never disappeared."
];


const rippleMessages = [
  "Thank you for staying.",
  "Thank you for never giving up on us.",
  "Thank you for seeing me when I could not see myself.",
  "You make me feel safe in ways I cannot explain.",
  "Your voice became one of my favorite kinds of peace.",
  "You make ordinary moments feel worth remembering.",
  "You calm my overthinking with only a few words.",
  "You make me feel seen.",
  "I am so proud of the person you are becoming.",
  "Home slowly became a person.",
  "And somehow, that person became you."
];


function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}


function showScene(scene) {
  Object.values(scenes).forEach((item) => {
    item.classList.remove(
      "active",
      "preparing",
      "blending"
    );
  });

  scene.classList.add("active");
}


function fadeText(
  element,
  text,
  delay = 300
) {
  element.style.opacity = "0";

  window.setTimeout(() => {
    element.textContent = text;
    element.style.opacity = "1";
  }, delay);
}


async function tryPlay(audio) {
  try {
    await audio.play();
    return true;
  } catch (error) {
    console.warn(
      "Audio could not play:",
      error
    );

    return false;
  }
}


function fadeAudio(
  audio,
  targetVolume,
  duration = 2500
) {
  const beginningVolume =
    audio.volume;

  const difference =
    targetVolume - beginningVolume;

  const totalSteps = 50;

  let currentStep = 0;


  const interval =
    window.setInterval(() => {

      currentStep += 1;

      const newVolume =
        beginningVolume +
        difference *
        (currentStep / totalSteps);

      audio.volume = Math.max(
        0,
        Math.min(1, newVolume)
      );


      if (
        currentStep >= totalSteps
      ) {
        window.clearInterval(
          interval
        );

        audio.volume =
          targetVolume;
      }

    }, duration / totalSteps);
}


function createStars(
  containerId,
  amount
) {
  const container =
    document.getElementById(
      containerId
    );

  if (!container) return;

  container.innerHTML = "";


  for (
    let i = 0;
    i < amount;
    i += 1
  ) {
    const star =
      document.createElement("span");

    star.className = "star";

    star.style.left =
      `${Math.random() * 100}%`;

    star.style.top =
      `${Math.random() * 100}%`;

    star.style.animationDelay =
      `${Math.random() * 4}s`;

    star.style.animationDuration =
      `${2.2 + Math.random() * 4}s`;

    star.style.opacity =
      `${0.18 + Math.random() * 0.6}`;

    const size =
      1 + Math.random() * 1.6;

    star.style.width =
      `${size}px`;

    star.style.height =
      `${size}px`;

    container.appendChild(star);
  }
}


/* INTRO */

function animateIntroText() {
  window.setTimeout(() => {
    fadeText(
      introOpening,
      "This was one of them."
    );
  }, 2600);

  window.setTimeout(() => {
    fadeText(
      introSubtitle,
      "Stay long enough to see the light return."
    );
  }, 4600);
}


async function beginExperience() {
  if (experienceStarted) return;

  experienceStarted = true;

  beginButton.disabled = true;
  beginButton.style.opacity = "0.4";

  await tryPlay(nightAudio);

  showScene(scenes.eclipse);

  runEclipse();
}


/* ECLIPSE */

async function runEclipse() {
  const eclipseScene =
    scenes.eclipse;

  eclipseText.textContent = "";
  eclipseText.style.opacity = "1";

  await wait(700);

  eclipseScene.classList.add(
    "totality"
  );


  for (
    let index = 0;
    index < eclipseMessages.length;
    index += 1
  ) {
    fadeText(
      eclipseText,
      eclipseMessages[index],
      350
    );


    if (
      eclipseMessages[index] ===
      "But somehow..."
    ) {
      await wait(3900);

    } else if (
      eclipseMessages[index] ===
      "we stayed."
    ) {
      await wait(4300);

    } else {
      await wait(3500);
    }
  }


  await wait(2600);

  beginLakeScene();
}


/* LAKE */

function beginLakeScene() {
  showScene(scenes.lake);

  lakeClickCount = 0;
  rippleMessageIndex = 0;
  sunriseStarted = false;

  lakeSubtitle.textContent =
    "Touch the lake.";
}


function createRipple(
  clientX,
  clientY
) {
  if (
    secretSequenceActive ||
    sunriseStarted
  ) {
    return;
  }


  const rectangle =
    lake.getBoundingClientRect();

  const x =
    clientX - rectangle.left;

  const y =
    clientY - rectangle.top;


  if (
    x < 0 ||
    x > rectangle.width ||
    y < 0 ||
    y > rectangle.height
  ) {
    return;
  }


  const ripple =
    document.createElement("span");

  ripple.className = "ripple";

  ripple.style.left =
    `${x}px`;

  ripple.style.top =
    `${y}px`;


  const message =
    document.createElement("span");

  message.className =
    "ripple-message";


  const safeMessageX =
    Math.max(
      rectangle.width * 0.18,
      Math.min(
        rectangle.width * 0.82,
        x
      )
    );


  const safeMessageY =
    Math.max(
      85,
      Math.min(
        rectangle.height - 70,
        y - 25
      )
    );


  message.style.left =
    `${safeMessageX}px`;

  message.style.top =
    `${safeMessageY}px`;

  message.textContent =
    rippleMessages[
      rippleMessageIndex %
      rippleMessages.length
    ];


  rippleLayer.appendChild(
    ripple
  );

  rippleLayer.appendChild(
    message
  );


  rippleMessageIndex += 1;
  lakeClickCount += 1;


  window.setTimeout(() => {
    ripple.remove();
    message.remove();
  }, 5200);


  if (
    lakeClickCount >= 8 &&
    !sunriseStarted
  ) {
    sunriseStarted = true;

    lakeSubtitle.textContent =
      "The night is beginning to change.";

    window.setTimeout(() => {
      startSunrise();
    }, 5600);
  }
}


function handleLakeClick(event) {
  createRipple(
    event.clientX,
    event.clientY
  );
}


function handleLakeTouch(event) {
  event.preventDefault();

  const touch =
    event.touches[0];

  if (!touch) return;

  createRipple(
    touch.clientX,
    touch.clientY
  );
}


/* LAKE SECRET STAR */

async function activateSecretStar(
  event
) {
  event.preventDefault();
  event.stopPropagation();


  if (
    secretStarFound ||
    secretSequenceActive ||
    sunriseStarted
  ) {
    return;
  }


  secretStarFound = true;
  secretSequenceActive = true;


  const lakeScene =
    scenes.lake;


  lakeScene.classList.add(
    "secret-active"
  );


  lakeSecretStar.style.pointerEvents =
    "none";


  fadeAudio(
    nightAudio,
    0.08,
    1700
  );


  await wait(1200);


  fallingStar.classList.add(
    "active"
  );


  await wait(2350);


  secretWaterRipple.classList.add(
    "active"
  );


  await wait(800);


  secretLakeMessage.classList.add(
    "visible"
  );


  await wait(12500);


  secretLakeMessage.classList.remove(
    "visible"
  );


  await wait(1800);


  lakeScene.classList.remove(
    "secret-active"
  );


  fallingStar.classList.remove(
    "active"
  );


  secretWaterRipple.classList.remove(
    "active"
  );


  fadeAudio(
    nightAudio,
    0.26,
    2000
  );


  await wait(1800);


  secretSequenceActive = false;
}


/* SMOOTH SUNRISE */

async function startSunrise() {
  const lakeScene =
    scenes.lake;

  const sunriseScene =
    scenes.sunrise;


  sunriseScene.classList.remove(
    "active",
    "preparing",
    "blending",
    "first-light",
    "dawn",
    "morning"
  );


  sunriseText.textContent =
    "The night never lasts forever.";

  sunriseText.style.opacity = "0";


  /*
    Put sunrise invisibly above lake.
  */

  sunriseScene.classList.add(
    "preparing"
  );


  void sunriseScene.offsetWidth;


  /*
    Eight-second crossfade.
  */

  sunriseScene.classList.add(
    "blending"
  );


  await wait(8000);


  lakeScene.classList.remove(
    "active"
  );


  sunriseScene.classList.remove(
    "preparing",
    "blending"
  );


  sunriseScene.classList.add(
    "active"
  );


  await wait(1800);


  /*
    FIRST LIGHT
  */

  sunriseScene.classList.add(
    "first-light"
  );


  fadeText(
    sunriseText,
    "The night never lasts forever.",
    500
  );


  fadeAudio(
    nightAudio,
    0.18,
    12000
  );


  await wait(10500);


  fadeText(
    sunriseText,
    "At first, the change is almost impossible to see.",
    500
  );


  await wait(6500);


  /*
    DAWN
  */

  sunriseScene.classList.add(
    "dawn"
  );


  fadeText(
    sunriseText,
    "But even the darkest sky eventually begins to soften.",
    500
  );


  fadeAudio(
    nightAudio,
    0.1,
    13000
  );


  await wait(10500);


  fadeText(
    sunriseText,
    "And slowly...",
    500
  );


  await wait(5500);


  fadeText(
    sunriseText,
    "the light finds its way back.",
    500
  );


  await wait(4500);


  /*
    FULL MORNING
  */

  sunriseScene.classList.add(
    "morning"
  );


  const morningPlayed =
    await tryPlay(
      morningAudio
    );


  if (morningPlayed) {
    fadeAudio(
      morningAudio,
      0.23,
      9000
    );
  }


  fadeAudio(
    nightAudio,
    0,
    9000
  );


  await wait(9000);


  nightAudio.pause();
  nightAudio.currentTime = 0;


  fadeText(
    sunriseText,
    "Thank you for staying until morning.",
    600
  );


  await wait(8500);


  startVoiceMessage();
}


/* VOICE MESSAGE */

async function startVoiceMessage() {
  if (voiceStarted) return;

  voiceStarted = true;


  voiceStatus.textContent =
    "listen closely...";


  fadeAudio(
    morningAudio,
    0.065,
    1700
  );


  const voicePlayed =
    await tryPlay(
      voiceAudio
    );


  /*
    Browser fallback.
  */

  if (!voicePlayed) {
    voiceStatus.textContent =
      "one last thing is waiting for you";

    voiceButton.classList.add(
      "show"
    );
  }
}


async function playVoiceFallback() {
  voiceButton.classList.remove(
    "show"
  );

  voiceStatus.textContent =
    "listen closely...";


  const voicePlayed =
    await tryPlay(
      voiceAudio
    );


  if (!voicePlayed) {
    voiceStatus.textContent =
      "Make sure voice-message.mp3 is uploaded beside index.html.";

    voiceButton.classList.add(
      "show"
    );
  }
}


async function finishExperience() {
  voiceStatus.textContent = "";


  fadeAudio(
    morningAudio,
    0,
    2200
  );


  await wait(2600);


  morningAudio.pause();
  morningAudio.currentTime = 0;


  showScene(scenes.final);
}


/* FINAL SECRET */

function openFinalSecret(event) {
  event.stopPropagation();

  finalSecretOverlay.classList.add(
    "visible"
  );
}


function closeFinalSecret() {
  finalSecretOverlay.classList.remove(
    "visible"
  );
}


/* EVENTS */

beginButton.addEventListener(
  "click",
  beginExperience
);


lake.addEventListener(
  "click",
  handleLakeClick
);


lake.addEventListener(
  "touchstart",
  handleLakeTouch,
  {
    passive: false
  }
);


lakeSecretStar.addEventListener(
  "click",
  activateSecretStar
);


lakeSecretStar.addEventListener(
  "touchstart",
  activateSecretStar,
  {
    passive: false
  }
);


voiceButton.addEventListener(
  "click",
  playVoiceFallback
);


voiceAudio.addEventListener(
  "ended",
  finishExperience
);


finalSecretStar.addEventListener(
  "click",
  openFinalSecret
);


closeSecretButton.addEventListener(
  "click",
  closeFinalSecret
);


/* SETUP */

createStars(
  "introStars",
  95
);

createStars(
  "eclipseStars",
  70
);

createStars(
  "lakeStars",
  135
);

createStars(
  "sunriseStars",
  95
);


animateIntroText();