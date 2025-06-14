let currentWeather;
let targetWeather;
let buttons = [];
let flash = false;
let lastFlash = 0;
let weatherName = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  createButtonStyles();

  currentWeather = {
    bg: color(135, 206, 250),
    rainCount: 0,
    rainLength: 0,
    rainWeight: 0,
  };

  targetWeather = { ...currentWeather };
  weatherName = "soleggiato";

  const labels = ["Soleggiato", "Pioggerella", "Temporale"];
  labels.forEach((label) => {
    const btn = createButton(label);
    btn.mousePressed(() => changeWeather(label.toLowerCase()));
    btn.addClass("weather-btn");
    buttons.push(btn);
  });

  positionButtons();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionButtons();
  // Riapplica il meteo corrente con scala aggiornata
  changeWeather(weatherName);
}

function positionButtons() {
  const spacing = 20;
  const btnWidth = 100;
  const totalWidth = btnWidth * buttons.length + spacing * (buttons.length - 1);
  const startX = (windowWidth - totalWidth) / 2;

  buttons.forEach((btn, i) => {
    btn.position(startX + i * (btnWidth + spacing), 20);
  });
}

function changeWeather(type) {
  weatherName = type;

  if (type === "soleggiato") {
    targetWeather = {
      bg: color(135, 206, 250),
      rainCount: 0,
      rainLength: 0,
      rainWeight: 0,
    };
  } else if (type === "pioggerella") {
    targetWeather = {
      bg: color(170, 190, 210),
      rainCount: scaleRainAmount(80),
      rainLength: 12,
      rainWeight: 1.2,
    };
  } else if (type === "temporale") {
    targetWeather = {
      bg: color(40),
      rainCount: scaleRainAmount(600),
      rainLength: 50,
      rainWeight: 3,
    };
  }
}

function draw() {
  // Lampo nel temporale
  let flashActive = false;
  if (weatherName === "temporale") {
    if (random() < 0.01 && millis() - lastFlash > 1000) {
      flash = true;
      lastFlash = millis();
    }
    if (flash && millis() - lastFlash < 100) {
      flashActive = true;
    } else {
      flash = false;
    }
  }

  // Transizione meteo
  currentWeather.bg = lerpColor(currentWeather.bg, targetWeather.bg, 0.05);
  currentWeather.rainCount = lerp(currentWeather.rainCount, targetWeather.rainCount, 0.05);
  currentWeather.rainLength = lerp(currentWeather.rainLength, targetWeather.rainLength, 0.05);
  currentWeather.rainWeight = lerp(currentWeather.rainWeight, targetWeather.rainWeight, 0.05);

  // Sfondo
  if (flashActive) {
    background(255);
  } else {
    background(currentWeather.bg);
  }

  // Gradiente soleggiato
  if (weatherName === "soleggiato" && currentWeather.rainCount < 10) {
    drawSunnyGradient();
  }

  // Pioggia
  if (currentWeather.rainCount > 1) {
    drawRain(currentWeather.rainCount, currentWeather.rainLength, currentWeather.rainWeight);
  }
}

function drawRain(count, maxLength, weight) {
  let wind = 5; // inclinazione pioggia (positivo = destra)
  for (let i = 0; i < count; i++) {
    let gl = random(10, maxLength);
    let gx = random(0, width);
    let gy = random(-gl, height);
    strokeWeight(random(1, weight));
    stroke(255, random(180, 255));
    line(gx, gy, gx + wind, gy + gl);
  }
}

function drawSunnyGradient() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 250), color(255, 255, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function createButtonStyles() {
  const style = `
    .weather-btn {
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      width: 100px;
      text-align: center;
    }
    .weather-btn:hover {
      background: rgba(0, 0, 0, 0.8);
    }
  `;
  const styleTag = createElement('style', style);
  styleTag.parent(document.head);
}

function scaleRainAmount(baseCount) {
  let referenceArea = 1600 * 900;
  let currentArea = width * height;
  let scaleFactor = currentArea / referenceArea;

  return baseCount * scaleFactor;
}
