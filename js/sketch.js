//paramétrer la grille
let grille =20;
let marge = 0;

let sound, amp, timeCode;
let fft; // pour récupérer la waveform en temps réel
let img;


let affichage1 = true;
// mode d'affichage : 1 = grille2+7, 2 = grille1+7, 3 = grille4+5
let affichageMode = 1;

let temps =0;
 let lissage = 0.5; //ralentir la vitesse de variation de la grille
//niveau de détail de la grille
let zoom =0.005;
var particles = [];
let img2;



function preload(){
  sound = loadSound('sound/KOKO - Chiquita (feat Giovanni Ephrikian)-converted.mp3')
  img = loadImage('image/Sans titre-1.png')
  img2 = loadImage('image/plage.jpg')


}


function setup() {
    colorMode(HSL)
    // angleMode(DEGREES)
    createCanvas(windowWidth, windowHeight);
    amp = new p5.Amplitude();
    fft = new p5.FFT();
    // réduire la charge CPU/GPU
    frameRate(30);
    // s'assurer que l'analyseur lit la bonne source
    amp.setInput(sound);
    let lecture = sound.isPlaying();
    imageMode(CENTER); 

    //  }            
}

// lancer / stopper la musique au clic (gesture utilisateur requise pour l'audio)
function mousePressed(){
  print(timeCode)
  if (sound && sound.isPlaying && sound.isPlaying()){
    sound.pause()
  } else if (sound){
    sound.play()
  }
}


function draw() {
  if (sound && sound.isPlaying && sound.isPlaying()){
    timeCode = sound.currentTime(); ///time code actuel de la musique
  }
 


  // choix d'affichage (1/2/3)
  background(52);
  if (affichageMode === 1) {
    grille2();
    grille7();

  } else if (affichageMode === 2) {
    grille1();
    grille7bis();
  } else if (affichageMode === 3) {
    grille4();
    grille5();
  }else if (affichageMode === 4) {
    grille8();

  }else if (affichageMode === 5) {

   grille3();
    
  }
  
// grille3b();

}



function keyPressed(){
  // sélection directe des modes
  if (key === '1') affichageMode = 1;
  else if (key === '2') affichageMode = 2;
  else if (key === '3') affichageMode = 3;

  else if (key === '4') affichageMode = 4;
   else if (key === '5') affichageMode = 5;
  // espace => cycle
  else if (key === ' ') {
    affichageMode = (affichageMode % 5) + 1;
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


///Une fonction = un effet avec une structure similaire
function grille1(){
      let level = amp.getLevel();
     
      temps = temps+level*lissage; 

     for (let x = marge; x <width-marge; x+=grille) {
      for (let y = marge; y<height-marge; y+=grille) {
 
         let paramX=x*zoom;
         let paramY =y*zoom;
         //ci dessous modifier les paramètres pour afficher des formes 
         let noise3d = noise(paramX,paramY,temps)*grille*2
         fill(0)
       ellipse(x,y,noise3d)
       //
      }
 }
}

function grille2(){
      let level = amp.getLevel();
    
      temps = temps+level*lissage; 
background(30, 100, 50)
     for (let x = marge; x <width-marge; x+=grille) {
      for (let y = marge; y<height-marge; y+=grille) {
     
         let paramX=x*zoom;
         let paramY =y*zoom;
         //ci dessous modifier les paramètres pour afficher des formes 
         let noise3d = noise(paramX,paramY,temps)*90
         fill(noise3d,50,50)
          
       circle(x,y,grille)
       //
      }
 }
}





 function grille3(){
      

  let level = amp.getLevel();
    
      temps = temps+level*lissage; 

     for (let x = marge; x <width-marge; x+=grille) {
      for (let y = marge; y<height-marge; y+=grille) {
     
         let paramX=x*zoom;
         let paramY =y*zoom;
         //ci dessous modifier les paramètres pour afficher des formes 
         let noise3d = noise(paramX,paramY,temps)*grille*20
         
         strokeWeight()
         fill(noise3d,50,50)
      
        let s = grille + level * 100; // ajuster le multiplicateur si besoin
        let h = s * Math.sqrt(3) / 2;
        push();
        translate(x, y);
        triangle(-s/2, h/3, s/2, h/3, 0, -2*h/3);
        pop();
       //
      }
    }
  }
  function grille3b(){
     

} 

   
    
  

  





function grille4(){



 let level = amp.getLevel();
  temps = temps + level * lissage;

  // Parcourir la grille comme dans les autres fonctions
  for (let x = marge; x < width - marge; x += grille) {
    for (let y = marge; y < height - marge; y += grille) {
      let paramX = x * zoom;
      let paramY = y * zoom;
      // calculer une valeur bruitée utilisée pour la taille / forme
      let noise3d = noise(paramX, paramY, temps) * grille * 2;
      let filtre = noise(paramX, paramY, temps);

      // accumulation de conditions en fonction du résultat
      if (filtre > 0.7) {
        fill(320, 50, 100);
        ellipse(x, y, grille * 0.25);
      } else if (filtre > 0.5) {
        fill(248, 100, 60);
        square(x, y, grille);
      } else if (filtre > 0.4) {
        fill(200, 50, 55);
        textSize(40);
        text('*', x, y);
        fill(200, 50, 50, 0.5);
        ellipse(x, y, grille);
      } else if (filtre > 0.2) {
        fill(40, 50, 55);
        ellipse(x, y, noise3d);
      }
    }
  }
}


function grille5(){
  let level = amp.getLevel();
  temps = temps + level * lissage;

  if (!img) return;
  // paramètres locaux
  const imgScaleLocal = 0.6;
  const insetFactor = 0.02; // petite marge interne

  // calculer taille et position centrée (fit)
  let scaleFactor = Math.min(width / img.width, height / img.height) * imgScaleLocal;
  const iw = img.width * scaleFactor;
  const ih = img.height * scaleFactor;
  const ix = (width - iw) / 2;
  const iy = (height - ih) / 2;

  // lire pixels de l'image une seule fois (beaucoup plus rapide que img.get())
  img.loadPixels();
  const pixels = img.pixels;

  noStroke();
  // passer en RGB pour remplir par composantes
  push();
  colorMode(RGB);
  for (let x = ix + iw * insetFactor; x < ix + iw - iw * insetFactor; x += grille) {
    // calculer fraction horizontale une seule fois par colonne
    let fx = (x - ix) / iw;
    for (let y = iy + ih * insetFactor; y < iy + ih - ih * insetFactor; y += grille) {
      let fy = (y - iy) / ih;
      // coords dans l'image source
      let u = Math.max(0, Math.min(img.width - 1, Math.floor(fx * img.width)));
      let v = Math.max(0, Math.min(img.height - 1, Math.floor(fy * img.height)));
      let idx = 4 * (v * img.width + u);
      let r = pixels[idx];
      let g = pixels[idx + 1];
      let b = pixels[idx + 2];

      // mouvement: offsets basés sur noise + amplitude sonore
      let n1 = noise(fx * 3, fy * 3, temps * 1.5 + frameCount * 0.01);
      let n2 = noise(fx * 3 + 100, fy * 3 + 100, temps * 1.5 + frameCount * 0.01);
      let maxDispl = constrain(grille * 0.5 + level * 250, 0, grille * 4);
      let dx = map(n1, 0, 1, -maxDispl, maxDispl);
      let dy = map(n2, 0, 1, -maxDispl, maxDispl);

      fill(r, g, b);
      ellipse(x + dx, y + dy, grille * 0.85);
    }
  }
  pop();
}

// dessine l'image centrée (utilisé pour afficher l'image au premier plan)
function drawCenteredImage(){
  if (!img) return;
  const imgScaleLocal = 1;
  let scaleFactor = Math.min(width / img.width, height / img.height) * imgScaleLocal;
  const iw = img.width * scaleFactor;
  const ih = img.height * scaleFactor;
  const ix = (width - iw) / 2;
  const iy = (height - ih) / 2;
  // dessiner en Corner pour position exacte
  imageMode(CORNER);
  image(img, ix, iy, iw, ih);
  imageMode(CENTER);
}

function grille8(){
  // afficher img2 en grand en arrière-plan
  background(230, 100, 50);
  
  
  if (img2) {
    push();
    imageMode(CENTER);
    // augmenter la taille d'img2 : 90% de la largeur/hauteur de l'écran
    let img2Scale = Math.min(width, height) * 1.2;
    let img2Width = img2.width * (img2Scale / img2.width);
    let img2Height = img2.height * (img2Scale / img2.width);
    image(img2, width/2, height/2, img2Width, img2Height);
    pop();
  }
  if (!img) return;
  // calcul image centrée (fit réduit)
  const imgScaleLocal = 0.8;// ajuster la taille du texte binaire + grd ou pas 
  let scaleFactor = Math.min(width / img.width, height / img.height) * imgScaleLocal;
  const iw = img.width * scaleFactor;
  const ih = img.height * scaleFactor;
  const ix = (width - iw) / 2;
  const iy = (height - ih) / 2;




  let level = amp.getLevel();
  temps = temps + level * lissage;

  // petite marge interne pour ne pas dessiner sur les bords
  const inset = Math.max(2, Math.floor(Math.min(iw, ih) * 0.02));

  textAlign(CENTER, CENTER);
  // parcourir seulement l'intérieur de l'image
  for (let x = ix + inset; x < ix + iw - inset; x += grille) {
    for (let y = iy + inset; y < iy + ih - inset; y += grille) {
      let paramX = (x - ix) * zoom;
      let paramY = (y - iy) * zoom;
      let noise3d = noise(paramX, paramY, temps) * grille * 2;

      // choisir '0' ou '1' via noise (plus stable / moins coûteux que random())
      let n = noise(paramX * 0.1, paramY * 0.1, temps);
      let lettre = (n + random(-0.1, 0.1)) > 0.45 ? '1' : '0';

      fill(126, 100, 28.5); // couleur du texte (HSL)
      // texte réduit : base + petite modulation par bruit+son
      let size = max(5, (noise3d * 0.5) + level * 5)*2;
      textSize(size);
      text(lettre, x, y);
    }
  }
  // image au premier plan
  drawCenteredImage();
}
// function grille9(){


//   let level = amp.getLevel();
     
//       temps = temps+level*lissage; 

//      for (let x = marge; x <width-marge; x+=grille) {
//       for (let y = marge; y<height-marge; y+=grille) {
 
//          let paramX=x*zoom;
//          let paramY =y*zoom;
//          //ci dessous modifier les paramètres pour afficher des formes 
//          let noise3d = noise(paramX,paramY,temps)*grille*2
//          fill(0)
//        ellipse(x,y,noise3d)
//        //
//       }

// }
// }


// Affiche la forme d'onde 
function grille6(){
stroke(251, 100, 50);  
// fill(251, 100, 50);
noFill()
  

  // Utiliser FFT pour récupérer la waveform en temps réel (réagit au son)
  if (fft) {
    let waveform = fft.waveform(); // tableau de valeurs entre -1 et 1
    // dessiner la waveform en la mappant sur la largeur de l'écran
   
   
    beginShape()
    for (let i = 0; i < waveform.length; i++){
      const x = map(i, 0, waveform.length - 1, 0, width);
      const y = height/2 + waveform[i] * height * 0.5; // amplitude verticale
         point(x, y);
        vertex(x, y)
        }
    endShape()
}
}


function grille7(){

  noFill()
  noStroke(); 
  fill(216, 100, 58,0.5);
  push();
  translate(width/2, height/2 );
  

  // Utiliser FFT pour récupérer la waveform en temps réel (réagit au son)
   if (fft) {
    var waveform = fft.waveform() // tableau de valeurs entre -1 et 1
    // dessiner la waveform en la mappant sur la largeur de l'écran
   
    for ( var t = -1 ; t <=1; t +=2){
      beginShape()
      for (var i = 0; i <= 180; i+= 0.1 ){ // le i+= permet de changer la forme des ligne gnre + carré ou + pointu
      var index = floor(map(i, 0, 180, 0, waveform.length - 1))
      var r = map(waveform[index], - 1 , 1 ,100 , 350)// les 2 dernier c le radius min et max 
      var angle = radians(i)
      var x = r* sin (angle) * t
       var y = r* cos (angle)
        vertex(x, y)
        }
    endShape()
      }
   
    var p= new Particle()
    particles.push(p)

    for(var i=0; i<particles.length; i++){
      if (!particles[i].edges()){
        particles[i].update()
        particles[i].show()
      } else {
        particles.splice(i,1)
      }
    }

  pop();

}
}

// pour que les particule soient créées
class Particle{
    constructor(){
      this.pos = p5.Vector.random2D().mult(250)
      this.vel = createVector(0,0)    // la vitesse
      this.acc = this.pos.copy().mult(random(0.0001,0.00001)) // l'accélération*

      this.w = random(6,14) // la taille
      // couleur initiale en HSL (setup() a défini colorMode(HSL))
      this.h = random(360)
      this.s = random(60,100)
      this.l = random(30,80)
      this.hueSpeed = random(-0.3, 0.3)
      this.col = color(this.h, this.s, this.l)

    }
    update()  {
      this.vel.add(this.acc)
      this.pos.add(this.vel)
      this.h = (this.h + this.hueSpeed + 360) % 360
      this.l += sin(frameCount * 0.02 + (this.pos.x + this.pos.y) * 0.001) * 0.2
      this.l = constrain(this.l, 20, 90)
      this.col = color(this.h, this.s, this.l)
    }

    edges(){
      if(this.pos.x< -width/2 || this.pos.x > width/2 || 
        this.pos.y< -height/2 || this.pos.y > height/2){
          return true
      } else {
        return false
      }
    }
    show(){
      noStroke()
      fill(this.col)
      ellipse(this.pos.x, this.pos.y, this.w);  
  }

}



function grille7bis(){

  noFill()
  noStroke(); 
  fill(0, 100, 50,0.5);
  push();
  translate(width/2, height/2 );
  

  // Utiliser FFT pour récupérer la waveform en temps réel (réagit au son)
   if (fft) {
    var waveform = fft.waveform() // tableau de valeurs entre -1 et 1
    // dessiner la waveform en la mappant sur la largeur de l'écran
   
    for ( var t = -1 ; t <=1; t +=2){
      beginShape()
      for (var i = 0; i <= 180; i+= 0.1 ){ // le i+= permet de changer la forme des ligne gnre + carré ou + pointu
      var index = floor(map(i, 0, 180, 0, waveform.length - 1))
      var r = map(waveform[index], - 1 , 1 ,100 , 350)// les 2 dernier c le radius min et max 
      var angle = radians(i)
      var x = r* sin (angle) * t
       var y = r* cos (angle)
        vertex(x, y)
        }
    endShape()
      }
   
    var p= new Particle()
    particles.push(p)

    for(var i=0; i<particles.length; i++){
      if (!particles[i].edges()){
        particles[i].update()
        particles[i].show()
      } else {
        particles.splice(i,1)
      }
    }

  pop();

}
}


 