let dvdImg;      // immagine scia
let dvdMainImg;  // immagine principale
let dvd;
let scaleFactor = 0.6; // scala iniziale
let maxScaleFactor;    // verrà calcolata in setup in base a finestra
let hitCount = 0;      // contatore tocchi bordo

function preload() {
  dvdImg = loadImage('img/dvd.png');
  dvdMainImg = dvdImg
}

function setup() {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';

  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('display', 'block');

  maxScaleFactor = (windowWidth - 30) / dvdImg.width;

  dvd = {
    x: width / 2,
    y: height / 2,
    vx: 5,
    vy: 3,
    w: dvdImg.width * scaleFactor,
    h: dvdImg.height * scaleFactor,
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxScaleFactor = (windowWidth - 30) / dvdImg.width;

  dvd.x = constrain(dvd.x, 0, width - dvd.w);
  dvd.y = constrain(dvd.y, 0, height - dvd.h);
}

function draw() {
  background(15);

  // Grana leggera sullo sfondo
  stroke(255, 20);
  strokeWeight(1);
  for (let i = 0; i < width * height * 0.001; i++) {
    point(random(width), random(height));
  }

  // Bordo
  stroke(200);
  strokeWeight(4);
  noFill();
  rect(0, 0, width, height);

  // Movimento immagine
  dvd.x += dvd.vx;
  dvd.y += dvd.vy;

  // Controllo muri e ingrandimento progressivo al tocco
  let hitWall = false;

  if (dvd.x < 0) {
    dvd.x = 0;
    dvd.vx *= -1;
    hitWall = true;
  }
  if (dvd.x + dvd.w > width) {
    dvd.x = width - dvd.w;
    dvd.vx *= -1;
    hitWall = true;
  }
  if (dvd.y < 0) {
    dvd.y = 0;
    dvd.vy *= -1;
    hitWall = true;
  }
  if (dvd.y + dvd.h > height) {
    dvd.y = height - dvd.h;
    dvd.vy *= -1;
    hitWall = true;
  }

  if (hitWall) {
    hitCount++;  // incremento contatore

    scaleFactor *= 1.1;
    scaleFactor = min(scaleFactor, maxScaleFactor);

    dvd.w = dvdImg.width * scaleFactor;
    dvd.h = dvdImg.height * scaleFactor;

    dvd.x = constrain(dvd.x, 0, width - dvd.w);
    dvd.y = constrain(dvd.y, 0, height - dvd.h);
  } else {
    dvd.w = dvdImg.width * scaleFactor;
    dvd.h = dvdImg.height * scaleFactor;
  }

  dvd.vx = constrain(abs(dvd.vx), 2, 15) * (dvd.vx < 0 ? -1 : 1);
  dvd.vy = constrain(abs(dvd.vy), 2, 15) * (dvd.vy < 0 ? -1 : 1);

  image(dvdMainImg, dvd.x, dvd.y, dvd.w, dvd.h);

  // Testo contatore al centro
  noStroke();
  fill(180);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) / 10); // dimensione responsiva
  text(`${hitCount}`, width / 2, height / 2);
}
