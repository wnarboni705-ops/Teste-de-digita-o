# ⌨️ Teste de Digitação SpeedRun

Um aplicativo interativo de teste de digitação desenvolvido com **HTML5**, **CSS3** e **JavaScript Vanila**, integrado a uma API online para fornecimento dinâmico de frases. O projeto conta com múltiplos modos de tempo, cálculo de métricas em tempo real e um sistema de feedback visual e por janelas (modals).

![Interface do Projeto](https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop)

---

## 🚀 Funcionalidades

*   **Integração com API Assíncrona:** As frases são puxadas dinamicamente da internet através de requisições HTTP (`fetch` com `async/await`), garantindo um teste sempre inédito.
*   **Modos de Tempo Customizados:** Seletor com três opções de jogabilidade:
    *   `30 segundos` e `60 segundos` (Contagem regressiva).
    *   `Sem temporizador` (Modo livre com cronômetro progressivo, que encerra assim que a frase é concluída).
*   **Métricas em Tempo Real:** 
    *   **WPM (Palavras por Minuto):** Baseado no padrão internacional de 5 caracteres por palavra.
    *   **Precisão (%):** Porcentagem de acertos em relação ao total digitado.
    *   **Erros:** Contador simples de quantas letras erradas foram digitadas no momento.
*   **Feedback Visual Cirúrgico:** As letras da frase mudam de cor dinamicamente: verde para correto e vermelho com sublinhado para incorreto.
*   **Janela de Resultados (Modal):** Ao finalizar, uma tela flutuante exibe o resumo do seu desempenho.
*   **Atalhos de Teclado:** Reinicie o teste instantaneamente pressionando a tecla `Enter` enquanto a janela de resultados estiver aberta.

---

## 🛠️ Estrutura do Código Explicada

### 1. Estrutura HTML (`index.html`)
O documento é dividido em seções claras dentro de um `.container` principal:
*   **Configurações:** Contém o elemento `<select>` para gerenciar os modos de tempo.
*   **Área de Exibição:** Onde a frase é renderizada de caractere em caractere dentro de elementos `<span>`.
*   **Área de Entrada:** Um `<textarea>` bloqueado por padrão, ativado apenas ao iniciar o jogo para evitar trapaças.
*   **Painel de Informações:** Exibe os contadores em tempo real.
*   **Modal de Resultados:** Uma estrutura flutuante (`.modal-overlay`) configurada com opacidade zero que se sobrepõe à tela quando o teste termina.

### 2. Estilização CSS (`teste-D.css`)
*   **Tema Dark Moderno:** Utiliza uma paleta baseada no *Tailwind CSS* (`#020617`, `#0f172a`, `#e5e7eb`).
*   **Layout Flexbox:** Centraliza perfeitamente o aplicativo na tela do usuário em qualquer resolução.
*   **Design Responsivo:** Botões expandem proporcionalmente (`flex: 1`) e caixas possuem largura máxima delimitada (`max-width: 700px`).
*   **Classes Dinâmicas:** `.correto` (verde) e `.errado` (vermelho) manipulam as cores do texto via JavaScript.

### 3. Lógica JavaScript (`teste-D.js`)
A inteligência do sistema foi construída sob os seguintes pilares:

*   **Consumo da API (`escolheFrase`):**
    Utiliza um `fetch` assíncrono para buscar um arquivo JSON de citações. Conta com um bloco `try...catch` robusto: se a requisição falhar (ou o usuário estiver offline), o sistema adota automaticamente frases de *backup* salvas localmente, impedindo falhas na aplicação.
    
*   **Manipulação do DOM (`renderizarFrase`):**
    Pega a frase da API, quebra letra por letra usando `.split("")` e envelopa cada caractere em uma tag `<span>`, permitindo o monitoramento individual de cada dígito.

*   **Ouvinte de Entrada (`input`):**
    Compara o `value` atual do campo de texto com cada `span.textContent` correspondente usando o índice. Se o usuário apagar o texto, o caractere torna-se `undefined` no comparador e o script limpa as classes de cor de forma responsiva.

*   **Gerenciador do Tempo (`iniciarTime`):**
    Utiliza `setInterval` de 1000ms. Se o modo for "infinito", a variável soma segundos (`tempoRestante++`); caso contrário, subtrai (`tempoRestante--`) e dispara o gatilho `finalizarTeste()` ao zerar.

---

## 📦 Como Executar o Projeto

1. Faça o clone ou baixe os arquivos do repositório.
2. Certifique-se de manter a estrutura de pastas correta:
```text
   ├── CSS/
   │   └── teste-D.css
   ├── HTML/
   │   └── index.html
   └── JS/
       └── teste-D.js
