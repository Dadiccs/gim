let wastedTime = 0; // in minuti
let maxLimit = 180; // soglia massima "normale"
let dataURL = 'social-time.json';
let fraseMotivazionale = "";
let evidenziato1 = "";
let evidenziato2 = "";
let evidenziato3 = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  setInterval(loadWastedTime, 60000);
  loadWastedTime();
}

function draw() {
  background(30);

  // --- Cerchio rosso dinamico ---
  let maxRadius = dist(0, 0, width, height);
  let radius;
  let circleColor;

  if (wastedTime <= maxLimit) {
    radius = map(wastedTime, 0, maxLimit, 0, maxRadius);
    circleColor = color(255, 0, 0);
  } else {
    radius = maxRadius;
    circleColor = color(150, 0, 0);
  }

  noStroke();
  fill(circleColor);
  ellipse(width / 2, height / 2, radius * 2, radius * 2);

  // --- Orologio digitale ---
  fill(255);
  textSize(windowWidth * 0.015);
  let h = nf(hour(), 2);
  let m = nf(minute(), 2);
  let s = nf(second(), 2);
  text(`${h}:${m}:${s}`, width / 2, height * 0.05);

  // --- Testi principali ---
  let textColor = color(255);

  fill(textColor);
  textSize(windowWidth * 0.015);

  // Calcola posizione Y per evitare sovrapposizione in schermi grandi
  let yTempoPerso;
  if (windowHeight > 700) {
    yTempoPerso = height * 0.42; // un po' sopra i minuti
  } else {
    yTempoPerso = height * 0.45;
  }
  text("Tempo perso oggi sui social", width / 2, yTempoPerso);

  textSize(windowWidth * 0.08);
  text(wastedTime + " min", width / 2, height * 0.5);

// --- Frase motivazionale ---
let startY = height * 0.75;
let coloreEvidenziato = color(255, 0, 0);

let frase = fraseMotivazionale
  .replace("{x}", "<x>")
  .replace("{y}", "<y>")
  .replace("{z}", "<z>");

let finalFrase = frase.split(/(<x>|<y>|<z>)/);
let assembled = "";

finalFrase.forEach(part => {
  if (part === "<x>") assembled += `§${evidenziato1}§`;
  else if (part === "<y>") assembled += `§${evidenziato2}§`;
  else if (part === "<z>") assembled += `§${evidenziato3 || ""}§`;
  else assembled += part;
});

let blocks = assembled.split(/(§.*?§)/);

textSize(windowWidth * 0.018);

let fraseLarghezza = 0;
blocks.forEach(block => {
  let raw = block.replace(/§/g, "");
  fraseLarghezza += textWidth(raw);
});

let fraseAltezza = windowHeight * 0.04;
let paddingX = 20;
let paddingY = 10;
let backgroundX = width / 2 - fraseLarghezza / 2 - paddingX;
let backgroundY = startY - fraseAltezza / 2 - paddingY / 2;
let backgroundW = fraseLarghezza + paddingX * 2;
let backgroundH = fraseAltezza + paddingY;

fill(0, 130);
noStroke();
rect(backgroundX, backgroundY, backgroundW, backgroundH, 10);

let x = width / 2 - fraseLarghezza / 2;

blocks.forEach(block => {
  let isHighlighted = block.startsWith("§") && block.endsWith("§");
  let raw = block.replace(/§/g, "");
  if (isHighlighted) {
    fill(coloreEvidenziato);
  } else {
    fill(textColor);
  }
  text(raw, x + textWidth(raw) / 2, startY);
  x += textWidth(raw);
});

  // --- AVVISO DI PROTOTIPO ---
  let avviso = "Prototipo – L'app andrebbe collegata al computer per monitorare il tempo reale passato sui social. Al momento crea un valore randomizzato tra 0 e 300";
  let avvisoHeight = windowHeight * 0.05;

  fill(0, 200);
  noStroke();
  rect(0, height - avvisoHeight, width, avvisoHeight);

  fill(255);
  textSize(windowWidth * 0.014);
  textAlign(CENTER, CENTER);
  text(avviso, width / 2, height - avvisoHeight / 2);
}

function loadWastedTime() {
  fetch(dataURL)
    .then(response => response.json())
    .then(data => {
      wastedTime = data.minutes;
      aggiornaFraseMotivazionale(wastedTime);
    })
    .catch(err => {
      console.log("Errore nel caricare i dati:", err);
      wastedTime = int(random(0, 300));
      aggiornaFraseMotivazionale(wastedTime);
    });
}

function aggiornaFraseMotivazionale(minuti) {
  let giorniAnnui = ((minuti * 365) / 60 / 24).toFixed(1);
  let percentuale = ((minuti / (16 * 60)) * 100).toFixed(1) + "%";
  let pagine = Math.floor(minuti / 2);
  let vocaboli = Math.floor((minuti / 60) * 40);
  let oreSett = ((minuti * 7) / 60).toFixed(1);

  const frasi = [
    { frase: "Continua così e sprecherai {x} in un anno.", x: `${giorniAnnui} giorni` },
    { frase: "Hai consumato il {x} del tuo tempo sveglio solo scrollando.", x: `${percentuale}` },
    { frase: "Avresti potuto leggere {x} pagine di un libro.", x: `${pagine}` },
    { frase: "Con lo stesso tempo, potevi imparare {x} vocaboli in una nuova lingua.", x: `${vocaboli}` },
    { frase: "Hai buttato {x} solamente oggi. Se lo fai ogni giorno, sono {y} ore a settimana.", x: `${minuti} minuti`, y: `${oreSett}` }
  ];

  let scelta = random(frasi);
  fraseMotivazionale = scelta.frase;
  evidenziato1 = scelta.x || "";
  evidenziato2 = scelta.y || "";
  evidenziato3 = scelta.z || "";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
