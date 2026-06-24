const fraseElement = document.getElementById("frase");
const entrada = document.getElementById("entrada");
const tempoElement = document.getElementById("tempo");
const wpmElement = document.getElementById("wpm");
const precisaoElement = document.getElementById("precisao");
const errosElement = document.getElementById("erros");
const botaoIniciar = document.getElementById("botao-iniciar");
const botaoReiniciar = document.getElementById("botao-reiniciar");
const seletorModo = document.getElementById("seletor-modo");

// Elementos do Modal
const modalResultado = document.getElementById("modal-resultado");
const modalWpm = document.getElementById("modal-wpm");
const modalCorretos = document.getElementById("modal-corretos");
const modalErros = document.getElementById("modal-erros");
const modalPrecisao = document.getElementById("modal-precisao");
const botaoModalFechar = document.getElementById("botao-modal-fechar");

let fraseAtual = "";
let tempoRestante = 60;
let intervalo = null;
let erros = 0;
let caracteresDigitados = 0;
let caracteresCorretos = 0; 
let testeAtivo = false; // Auxiliar para gerenciar estados de digitação

async function escolheFrase(){
    fraseElement.innerHTML = "<span style='color: #64748b;'>Carregando frase...</span>";
    
    try {
        const url = "https://raw.githubusercontent.com/skandall/frases-aleatorias/main/frases.json";
        const resposta = await fetch(url);
        const listaDeFrases = await resposta.json();
        
        const indice = Math.floor(Math.random() * listaDeFrases.length);
        fraseAtual = listaDeFrases[indice].quote || listaDeFrases[indice]; 
        
        if (fraseAtual.length > 120) {
            fraseAtual = fraseAtual.substring(0, 120) + ".";
        }
    } catch (erro) {
        const backups = [
            "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
            "A persistência é o caminho do êxito e da evolução constante.",
            "Praticar programação diariamente constrói uma mente lógica e afiada."
        ];
        fraseAtual = backups[Math.floor(Math.random() * backups.length)];
    }
}

function renderizarFrase() {
    fraseElement.innerHTML = "";
    fraseAtual.split("").forEach(char => {
        const span = document.createElement("span");
        span.textContent = char;
        fraseElement.appendChild(span);
    });
}

function resetarEstado(){
    const modoSelecionado = seletorModo.value;

    if (modoSelecionado === "infinito") {
        tempoRestante = 0;
        tempoElement.textContent = "0s";
    } else {
        tempoRestante = parseInt(modoSelecionado);
        tempoElement.textContent = tempoRestante + "s";
    }

    erros = 0;
    caracteresDigitados = 0;
    caracteresCorretos = 0;

    wpmElement.textContent = "0";
    precisaoElement.textContent = "100";
    errosElement.textContent = "0";
    entrada.value = "";
    
    // Fecha o modal se estiver aberto ao reiniciar
    modalResultado.classList.remove("mostrar");

    if(intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }
}

function iniciarTime(){
    const modoSelecionado = seletorModo.value;

    intervalo = setInterval (() => {
        if (modoSelecionado === "infinito") {
            tempoRestante++;
            tempoElement.textContent = tempoRestante + "s";
            atualizarMetricas();
        } else {
            tempoRestante--;
            tempoElement.textContent = tempoRestante + "s";

            if(tempoRestante <= 0){
                finalizarTeste();
            } else {
                atualizarMetricas();
            }
        }
    }, 1000);
}

// Função isolada para reiniciar a interface completamente
function acaoReiniciar() {
    resetarEstado();
    seletorModo.disabled = false;
    entrada.disabled = true;
    testeAtivo = false;
    fraseElement.innerHTML = "Clique em Iniciar para começar!";
}

botaoIniciar.addEventListener("click", async () =>{
    botaoIniciar.disabled = true;
    resetarEstado();
    await escolheFrase();
    renderizarFrase();
    
    seletorModo.disabled = true;
    entrada.disabled = false;
    entrada.focus();
    testeAtivo = true;
    iniciarTime();
    botaoIniciar.disabled = false;
});

botaoReiniciar.addEventListener("click", acaoReiniciar);
botaoModalFechar.addEventListener("click", () => modalResultado.classList.remove("mostrar"));

// ESCUTADOR DO ENTER: Se o modal estiver aberto, reinicia o jogo
window.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && modalResultado.classList.contains("mostrar")) {
        evento.preventDefault(); // Impede comportamentos padrões do Enter
        acaoReiniciar();
    }
});

entrada.addEventListener("input", () => {
    const valorDigitado = entrada.value;
    const caracteresFrase = fraseElement.querySelectorAll("span");

    caracteresDigitados = valorDigitado.length;
    erros = 0;
    caracteresCorretos = 0;

    caracteresFrase.forEach((span, index) => {
        const charDigitado = valorDigitado[index];

        if(charDigitado === undefined){
            span.classList.remove("correto", "errado");
        } else if(charDigitado === span.textContent){
            span.classList.add("correto");
            span.classList.remove("errado");
            caracteresCorretos++;
        } else {
            span.classList.add("errado");
            span.classList.remove("correto");
            erros++;
        }
    });

    errosElement.textContent = erros;
    atualizarMetricas();

    if(valorDigitado.length === fraseAtual.length && testeAtivo) {
        finalizarTeste();
    }
});

function atualizarMetricas() {
  const modoSelecionado = seletorModo.value;
  let minutosDecorridos = 0;

  if (modoSelecionado === "infinito") {
      minutosDecorridos = tempoRestante / 60;
  } else {
      const tempoTotal = parseInt(modoSelecionado);
      minutosDecorridos = (tempoTotal - tempoRestante) / 60;
  }

  let wpm = 0;
  if (minutosDecorridos > 0) {
    const palavras = caracteresCorretos / 5;
    wpm = Math.round(palavras / minutosDecorridos);
  }

  let precisao = 100;
  if (caracteresDigitados > 0) {
    precisao = Math.round((caracteresCorretos / caracteresDigitados) * 100);
  }

  wpmElement.textContent = wpm;
  precisaoElement.textContent = precisao;
  
  // Retorna os dados prontos para alimentar a janela modal
  return { wpm, precisao };
}

function finalizarTeste() {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }
  
  testeAtivo = false;
  entrada.disabled = true;
  seletorModo.disabled = false;
  
  // Pega as métricas finais e alimenta o Modal
  const metricasFinais = atualizarMetricas();
  modalWpm.textContent = metricasFinais.wpm;
  modalCorretos.textContent = caracteresCorretos;
  modalErros.textContent = erros;
  modalPrecisao.textContent = metricasFinais.precisao;
  
  // Exibe a janela flutuante na tela
  modalResultado.classList.add("mostrar");
}