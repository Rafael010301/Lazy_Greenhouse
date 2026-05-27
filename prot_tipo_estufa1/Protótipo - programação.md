#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); 

// --- Definição de Pinos ---
const int pinoBotao   = 2;  
const int pinoUmidade = A0; 
const int pinoLDR     = A1; 

// --- Constantes de Calibração do Sensor de Umidade ---
const int VALOR_SECO = 550;   
const int VALOR_MOLHADO = 290; 

// --- Variáveis do Sistema de Login/Nome da Planta ---
char nomePlanta[6] = "     ";  // Guarda o nome (5 letras)
int posicaoLetra = 0;          // Qual letra estamos editando (0 a 4)
char letraAtual = 'A';         // Letra que está mudando no momento
bool emModoLogin = true;       // Controla se está travado no login

// --- Variáveis de Controle de Tempo do Botão ---
unsigned long tempoApertado = 0;
unsigned long tempoSolto = 0;
bool botaoPressionadoAnteriormente = false;

// --- Variáveis de Controle do Display ---
int estadoBotao = 0;        
int modoDisplay = 0;        // 0 = Perfil, 1 = Solo, 2 = Luz, 3 = Projeto

// --- Variáveis dos Sensores ---
int umidadePorcent = 0;
int luzPorcent = 0;

// Timers para ler os sensores
unsigned long tempoAnterior = 0;
const long intervaloLeitura = 1000; 

// Caractere customizado para o bloco da barra de progresso
byte blocoPreenchido[8] = { B11111, B11111, B11111, B11111, B11111, B11111, B11111, B11111 };

void setup() {
  pinMode(pinoBotao, INPUT);
  pinMode(pinoUmidade, INPUT);
  pinMode(pinoLDR, INPUT);
  
  lcd.init();
  lcd.backlight();
  lcd.createChar(0, blocoPreenchido);
  
  // Tela Inicial do Login
  lcd.setCursor(0, 0);
  lcd.print("Nome da Planta:");
  lcd.setCursor(0, 1);
  lcd.print("> A");
}

void loop() {
  estadoBotao = digitalRead(pinoBotao);

  // --- LOGICA 1: SISTEMA DE LOGIN (CLIQUE MUDA / SEGURAR CONFIRMA) ---
  if (emModoLogin) {
    // Detecta o exato momento em que o botão foi APERTADO
    if (estadoBotao == HIGH && !botaoPressionadoAnteriormente) {
      tempoApertado = millis();
      botaoPressionadoAnteriormente = true;
      delay(50); // Debounce
    }

    // Detecta o exato momento em que o botão foi SOLTO
    if (estadoBotao == LOW && botaoPressionadoAnteriormente) {
      unsigned long duracaoClique = millis() - tempoApertado;
      botaoPressionadoAnteriormente = false;

      if (duracaoClique < 800) { 
        // 1. CLIQUE RÁPIDO: Muda a letra
        letraAtual++;
        if (letraAtual > 'Z') letraAtual = 'A'; 
        
        lcd.setCursor(2 + posicaoLetra, 1);
        lcd.print(letraAtual);
      } 
      else {
        // 2. CLIQUE LONGO (SEGURAR): Salva e avança
        nomePlanta[posicaoLetra] = letraAtual; // Salva a letra atual
        posicaoLetra++;                        // Avança a posição
        letraAtual = 'A';                      // Reseta para o próximo caractere
        
        if (posicaoLetra < 5) {
          // Limpa a linha de baixo para o efeito visual ficar limpo
          lcd.setCursor(0, 1);
          lcd.print("                ");
          lcd.setCursor(0, 1);
          lcd.print("> ");
          lcd.print(nomePlanta); // Mostra o que já foi digitado
          lcd.setCursor(2 + posicaoLetra, 1);
          lcd.print(letraAtual); // Mostra o 'A' piscando na nova vaga
        } else {
          // Nome completo preenchido!
          emModoLogin = false;
          lcd.clear();
          lcd.setCursor(2, 0);
          lcd.print("NOME SALVO!");
          lcd.setCursor(5, 1);
          lcd.print(nomePlanta);
          delay(2000);
          lerSensores();
          atualizarDisplay();
        }
      }
      delay(50);
    }
    return; // Não deixa rodar o resto do código se estiver no login
  }

  // --- LOGICA 2: NAVEGAÇÃO DE TELAS NORMAL (PÓS-LOGIN) ---
  if (estadoBotao == HIGH && !botaoPressionadoAnteriormente) {
    botaoPressionadoAnteriormente = true;
    modoDisplay++;
    if (modoDisplay > 3) {
      modoDisplay = 0;
    }
    atualizarDisplay();
    delay(200); // Evita passar várias telas de uma vez
  }
  if (estadoBotao == LOW) {
    botaoPressionadoAnteriormente = false;
  }

  // --- LOGICA 3: ATUALIZAÇÃO PERIÓDICA DOS SENSORES ---
  if (millis() - tempoAnterior >= intervaloLeitura) {
    tempoAnterior = millis();
    lerSensores();
    atualizarDisplay(); 
  }
}

void lerSensores() {
  int umidadeBruta = analogRead(pinoUmidade);
  umidadePorcent = map(umidadeBruta, VALOR_SECO, VALOR_MOLHADO, 0, 100);
  umidadePorcent = constrain(umidadePorcent, 0, 100);

  int luzBruta = analogRead(pinoLDR);
  luzPorcent = map(luzBruta, 0, 1023, 0, 100);
}

void desenharBarraProgresso(int porcentagem) {
  int blocosParaDesenhar = map(porcentagem, 0, 100, 0, 10);
  lcd.setCursor(0, 1);
  lcd.print("[");
  for (int i = 0; i < 10; i++) {
    if (i < blocosParaDesenhar) lcd.write(byte(0));
    else lcd.print(" ");
  }
  lcd.print("] ");
  lcd.print(porcentagem);
  lcd.print("%");
}

// --- INTERFACE DO LCD TOTALMENTE CORRIGIDA ---
void atualizarDisplay() {
  lcd.clear();
  switch (modoDisplay) {
    case 0: // TELA DE PERFIL REPARADA (TEXTOS CURTOS E AJUSTADOS)
      lcd.setCursor(0, 0);
      lcd.print("Planta: ");
      lcd.print(nomePlanta);
      
      lcd.setCursor(0, 1);
      // Textos reduzidos para caberem perfeitamente em 16 espaços
      if (umidadePorcent < 40)       lcd.print("Status: C/ Sede!");
      else if (umidadePorcent > 80)  lcd.print("Status: Encharc.");
      else                           lcd.print("Status: OK :)");
      break;
      
    case 1: 
      lcd.setCursor(0, 0);
      lcd.print("UMIDADE DO SOLO");
      desenharBarraProgresso(umidadePorcent);
      break;
      
    case 2: 
      lcd.setCursor(2, 0);
      lcd.print("LUMINOSIDADE");
      desenharBarraProgresso(luzPorcent);
      break;
      
    case 3: 
      lcd.setCursor(1, 0);
      lcd.print("LazyGreenhouse");
      lcd.setCursor(0, 1);
      lcd.print("----------------"); 
      break;
  }
}