// Variáveis de controle do ambiente
let chuvaAtiva = false;
let irrigacaoAtiva = true; // Começa ligada, mas pode ser pausada com 'R'
let nivelAgua = 150; 
let maxAgua = 200;

// Raios (Mouse)
let raioAtivo = false;
let raioX = 0;
let raioY = 0;
let raioTimer = 0;

// Arrays para elementos visuais
let gotasChuva = [];
let gotasIrrigacao = [];

function setup() {
  createCanvas(600, 400);
}

function draw() {
  // Céu muda de cor se estiver chovendo
  if (chuvaAtiva) {
    background(110, 120, 135); // Céu nublado
  } else {
    background(135, 206, 235); // Céu limpo
  }

  // Se o raio estiver ativo, faz a tela piscar rápido
  if (raioAtivo && frameCount % 2 === 0) {
    background(255);
  }

  desenharCenario();
  desenharSolBonito(); 
  desenharNuvens();    
  desenharCisterna();
  desenharPlantacao(); 
  
  // Desenha o raio controlado pelo clique do mouse
  desenharRaio();

  // Gerenciar a chuva (Ativa/Desativa com a tecla E)
  if (chuvaAtiva) {
    gerarChuva();
    if (nivelAgua < maxAgua) nivelAgua += 0.3; // Enche a cisterna
  }
  
  // Gerenciar a irrigação dos regadores (Ativa/Pausa com a tecla R)
  if (irrigacaoAtiva && nivelAgua > 0) {
    gerarIrrigacao();
    nivelAgua -= 0.4; // Consome água da cisterna
  } else if (nivelAgua <= 0) {
    irrigacaoAtiva = false; // Desliga automaticamente se acabar a água
  }

  desenharInterface();
}

// Desenha o solo e a grama
function desenharCenario() {
  fill(100, 70, 40);
  noStroke();
  rect(0, 300, width, 100);
  
  fill(34, 139, 34);
  rect(0, 290, width, 10);
}

// Desenha o sol com tons laranjas e amarelos
function desenharSolBonito() {
  if (!chuvaAtiva) {
    let solX = 510;
    let solY = 80;
    
    noStroke();
    fill(255, 140, 0, 40); 
    ellipse(solX, solY, 100, 100);
    fill(255, 165, 0, 90); 
    ellipse(solX, solY, 80, 80);
    
    fill(255, 120, 0); 
    push();
    translate(solX, solY);
    for (let i = 0; i < 8; i++) {
      rotate(TWO_PI / 8);
      triangle(-10, -35, 10, -35, 0, -55);
    }
    pop();
    
    fill(255, 235, 50);
    stroke(255, 165, 0); 
    strokeWeight(2);
    ellipse(solX, solY, 55, 55);
    noStroke();
  }
}

// Desenha nuvens no topo quando a chuva está ligada
function desenharNuvens() {
  if (chuvaAtiva) {
    fill(170, 180, 195);
    noStroke();
    for (let x = 30; x < width; x += 100) {
      ellipse(x, 20, 90, 60);
      ellipse(x + 40, 30, 80, 50);
      ellipse(x - 30, 30, 70, 50);
    }
  }
}

// Lógica para desenhar o raio onde o usuário clicou
function desenharRaio() {
  if (raioAtivo) {
    stroke(255, 255, 0); // Amarelo brilhante
    strokeWeight(4);
    noFill();
    
    let passos = 6;
    let xAtual = raioX;
    let yAtual = 40; // Começa na altura das nuvens
    let stepY = (raioY - 40) / passos;

    beginShape();
    vertex(xAtual, yAtual);
    for (let i = 0; i < passos; i++) {
      xAtual += random(-25, 25); // Desvio em zigue-zague
      yAtual += stepY;
      vertex(xAtual, yAtual);
    }
    vertex(raioX, raioY); // Termina exatamente onde o mouse clicou
    endShape();
    
    raioTimer--;
    if (raioTimer <= 0) {
      raioAtivo = false; // Desliga o raio após alguns frames
    }
  }
}

// Desenha a cisterna de reutilização de água
function desenharCisterna() {
  stroke(80);
  strokeWeight(3);
  fill(180);
  rect(50, 180, 100, 110, 5);
  
  noStroke();
  fill(0, 119, 182);
  rect(52, 290 - nivelAgua/2, 96, nivelAgua/2);
  
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text("Cisterna", 100, 170);
  text(floor((nivelAgua/maxAgua)*100) + "%", 100, 240);
}

// Desenha a plantação com as rosas e os regadores automáticos fixados no chão
function desenharPlantacao() {
  stroke(70);
  strokeWeight(4);
  line(150, 290, 550, 290); // Cano principal no chão
  
  noStroke();
  for (let x = 240; x <= 500; x += 60) {
    // Regadores com suporte no chão
    stroke(120);
    strokeWeight(3);
    line(x - 15, 290, x - 15, 210); 
    line(x - 15, 210, x, 210);       
    line(x, 210, x, 220);            
    
    fill(50);
    noStroke();
    rect(x - 5, 220, 10, 6); 
    
    // Rosas Vermelhas
    fill(46, 139, 87); 
    rect(x - 2, 260, 4, 30); 
    ellipse(x - 8, 270, 10, 6); 
    ellipse(x + 8, 273, 10, 6); 
    
    fill(180, 0, 0); 
    ellipse(x, 255, 20, 18);
    
    fill(220, 20, 60); 
    ellipse(x - 4, 254, 12, 14);
    ellipse(x + 4, 254, 12, 14);
    
    fill(255, 50, 50); 
    ellipse(x, 252, 10, 10);
  }
}

// Desenha as gotas de chuva gordinhas embaixo e finas em cima
function gerarChuva() {
  if (random(1) < 0.3) {
    gotasChuva.push({ x: random(width), y: 40 });
  }
  
  fill(173, 216, 230, 200); 
  noStroke();
  
  for (let i = gotasChuva.length - 1; i >= 0; i--) {
    let g = gotasChuva[i];
    
    push();
    translate(g.x, g.y);
    beginShape();
    vertex(0, -10); 
    bezierVertex(3, -5, 6, 0, 6, 3); 
    bezierVertex(6, 7, -6, 7, -6, 3); 
    bezierVertex(-6, 0, -3, -5, 0, -10); 
    endShape(CLOSE);
    pop();
    
    g.y += 7; 
    if (g.y > 290) gotasChuva.splice(i, 1);
  }
}

// Controla a água automática saindo dos regadores em direção às rosas
function gerarIrrigacao() {
  if (frameCount % 4 === 0) {
    for (let x = 240; x <= 500; x += 60) {
      gotasIrrigacao.push({ 
        xAtual: x, 
        y: 226, 
        velocidadeX: random(-1.2, 1.2) 
      });
    }
  }
  
  fill(0, 150, 255, 200); 
  noStroke();
  
  for (let i = gotasIrrigacao.length - 1; i >= 0; i--) {
    let g = gotasIrrigacao[i];
    ellipse(g.xAtual, g.y, 4, 4);
    
    g.y += 4; 
    g.xAtual += g.velocidadeX; 
    
    if (g.y > 260) {
      gotasIrrigacao.splice(i, 1);
    }
  }
}

// Interface visual de instruções
function desenharInterface() {
  fill(255, 240);
  rect(10, 10, 350, 95, 5);
  
  fill(0);
  textAlign(LEFT);
  textSize(13);
  textStyle(BOLD);
  text("AgroSustentável: Reutilização de Água", 20, 28);
  
  textStyle(NORMAL);
  textSize(11);
  text("Aperte [ E ] para Iniciar/Parar a Chuva", 20, 50);
  text("Aperte [ R ] para Ligar/Pausar a Irrigação", 20, 68);
  text("Clique com o MOUSE na tela para soltar um RAIO", 20, 86);
}

// Detecta o clique do mouse para soltar o raio
function mousePressed() {
  raioAtivo = true;
  raioX = mouseX; 
  raioY = mouseY; 
  raioTimer = 8;  
}

// Detecta os comandos do teclado
function keyPressed() {
  if (key === 'e' || key === 'E') {
    chuvaAtiva = !chuvaAtiva; 
  }
  if (key === 'r' || key === 'R') {
    irrigacaoAtiva = !irrigacaoAtiva; // Alterna entre irrigar ou pausar
  }
}