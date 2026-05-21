  

#include <LiquidCrystal_I2C.h>

  

LiquidCrystal_I2C lcd(0x27, 16, 2); // Altere para 0x3F se o display não exibir letras

  

// --- Definição de Pinos ---

const int pinoBotao   = 2;  // Botão para alternar telas

const int pinoUmidade = A0; // Sensor de Umidade do Solo

const int pinoLDR     = A1; // Sensor de Luz (LDR)

  

// --- Variáveis de Controle do Botão ---

int estadoBotao = 0;        

int ultimoEstadoBotao = 0;  

int modoDisplay = 0;        // 0 = Inicial, 1 = Solo, 2 = Luz, 3 = Nome

  

// --- Variáveis dos Sensores ---

int umidadePorcent = 0;

int luzPorcent = 0;

  

// --- Variáveis para os LEDs e Alarme ---

const int ledEstavel = 3;

const int ledIntermediario = 4;

const int ledPerigo = 5;

const int alarmePerigo = 6; // Pino do Buzzer

  

// --- Controle do Buzzer Pulsante (Sem travar o código) ---

unsigned long tempoBuzzerAnterior = 0;

const long intervaloBuzzer = 300; // Velocidade do pulso (300ms ligado, 300ms desligado)

bool estadoBuzzer = false;

  

// Timers para ler os sensores

unsigned long tempoAnterior = 0;

const long intervaloLeitura = 1000; // Atualiza a cada 1 segundo

  

void setup() {

  pinMode(pinoBotao, INPUT);

  pinMode(pinoUmidade, INPUT);

  pinMode(pinoLDR, INPUT);

  

  pinMode(ledEstavel, OUTPUT);

  pinMode(ledIntermediario, OUTPUT);

  pinMode(ledPerigo, OUTPUT);

  pinMode(alarmePerigo, OUTPUT);

  

  lcd.init();

  lcd.backlight();

  lerSensores();

  atualizarDisplay();

}

  

void loop() {

  // 1. GERENCIAMENTO DO BOTÃO

  estadoBotao = digitalRead(pinoBotao);

  

  if (estadoBotao != ultimoEstadoBotao) {

    if (estadoBotao == HIGH) {

      modoDisplay++;

      if (modoDisplay > 3) {

        modoDisplay = 0;

      }

      atualizarDisplay();

    }

    delay(50); // Debounce

  }

  ultimoEstadoBotao = estadoBotao;

  

  // 2. ATUALIZAÇÃO PERIÓDICA DOS SENSORES

  if (millis() - tempoAnterior >= intervaloLeitura) {

    tempoAnterior = millis();

    lerSensores();

    atualizarDisplay();

  }

  

  // 3. GERENCIAMENTO DO SOM PULSANTE DO BUZZER (SÓ SE ESTIVER EM PERIGO)

  if (umidadePorcent <= 35) {

    // Se passou o tempo do intervalo, inverte o estado do buzzer (liga/desliga)

    if (millis() - tempoBuzzerAnterior >= intervaloBuzzer) {

      tempoBuzzerAnterior = millis();

      estadoBuzzer = !estadoBuzzer; // Inverte entre verdadeiro e falso

  

      if (estadoBuzzer) {

        tone(alarmePerigo, 440);

        delay(100);

        tone(alarmePerigo, 550);

        delay(100);

        tone(alarmePerigo, 330);

        delay(100);

      } else {

        noTone(alarmePerigo); // Desliga o som

      }

    }

  } else {

    // Se a umidade estiver acima de 40%, garante que o som fique desligado

    noTone(alarmePerigo);

  }

}

  

// Função para processar os dados dos sensores

void lerSensores() {

  int umidadeBruta = analogRead(pinoUmidade);

  umidadePorcent = map(umidadeBruta, 0, 1023, 100,0);

  

  int luzBruta = analogRead(pinoLDR);

  luzPorcent = map(luzBruta, 0, 1023, 0, 100);

  

  // --- Lógica dos LEDs ---

  if (umidadePorcent >= 75) {

    digitalWrite(ledEstavel, HIGH);

    digitalWrite(ledIntermediario, LOW);

    digitalWrite(ledPerigo, LOW);

  }

  else if (umidadePorcent > 35 && umidadePorcent < 74) {

    digitalWrite(ledEstavel, LOW);

    digitalWrite(ledIntermediario, HIGH);

    digitalWrite(ledPerigo, LOW);

  }

  else {

    digitalWrite(ledEstavel, LOW);

    digitalWrite(ledIntermediario, LOW);

    digitalWrite(ledPerigo, HIGH);

  }

}

  

// Interface do LCD

void atualizarDisplay() {

  lcd.clear();

  switch (modoDisplay) {

    case 0:

      lcd.setCursor(0, 0);

      lcd.print("Bem Vindo !");

      lcd.setCursor(0, 1);

      lcd.print("Pressione Botao");

      break;

    case 1:

      lcd.setCursor(0, 0);

      lcd.print("UMIDADE DO SOLO");

      lcd.setCursor(0, 1);

      lcd.print("Status: ");

      lcd.print(umidadePorcent);

      lcd.print("%");

      break;

    case 2:

      lcd.setCursor(0, 0);

      lcd.print("LUMINOSIDADE");

      lcd.setCursor(0, 1);

      lcd.print("Nivel: ");

      lcd.print(luzPorcent);

      lcd.print("%");

      break;

  

    case 3:

      lcd.setCursor(0, 0);

      lcd.print("LazyGreenhouse");

      break;

  }

}