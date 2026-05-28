// ==========================================
// CONFIGURAÇÃO GLOBAL
// ==========================================
const PRECO_UNITARIO = 185.00;

// ==========================================
// FUNÇÕES GLOBAIS DO CARRINHO
// ==========================================
function lerCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarBadge(carrinho) {
    const badge = document.getElementById('nav_cart_badge');
    if (badge) {
        const total = carrinho.reduce((s, i) => s + i.quantidade, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

function formatarReais(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// ==========================================
// SISTEMA DE PAGAMENTO E RESUMO
// ==========================================
function obterQuantidadeDoCarrinho() {
    const carrinho = lerCarrinho();
    const produto = carrinho.find(item => item.id === 1);
    return produto ? produto.quantidade : 1;
}

let quantidade = obterQuantidadeDoCarrinho();
let descuentoValor = 0;

// ÚNICA definição de atualizarResumo
function atualizarResumo() {
    const subtotal = PRECO_UNITARIO * quantidade;
    const total = subtotal - descuentoValor;

    const qtyDisplay  = document.getElementById('qty-display');
    const precoItem   = document.getElementById('preco-item');
    const subtotalEl  = document.getElementById('subtotal');
    const descontoEl  = document.getElementById('desconto');
    const totalFinal  = document.getElementById('total-final');

    if (qtyDisplay)  qtyDisplay.textContent  = quantidade;
    if (precoItem)   precoItem.textContent    = formatarReais(subtotal);
    if (subtotalEl)  subtotalEl.textContent   = formatarReais(subtotal);
    if (descontoEl)  descontoEl.textContent   = '— ' + formatarReais(descuentoValor);
    if (totalFinal)  totalFinal.textContent   = formatarReais(total);

    atualizarBadge(lerCarrinho()); // corrigido: lerCarrinho() no lugar de carrinho

    if (document.getElementById('carrinho-conteudo')) {
        renderizarCarrinho();
    }
}

function salvarQuantidadeNoCarrinho(novaQtd) {
    let carrinho = lerCarrinho();
    const index = carrinho.findIndex(item => item.id === 1);
    if (index >= 0) {
        carrinho[index].quantidade = novaQtd;
        salvarCarrinho(carrinho);
    }
}

// Botões +/- na tela de pagamento
const btnMais = document.getElementById('btn-mais');
if (btnMais) {
    btnMais.addEventListener('click', function () {
        quantidade += 1;
        salvarQuantidadeNoCarrinho(quantidade);
        atualizarResumo();
    });
}

const btnMenos = document.getElementById('btn-menos');
if (btnMenos) {
    btnMenos.addEventListener('click', function () {
        if (quantidade > 1) {
            quantidade -= 1;
            salvarQuantidadeNoCarrinho(quantidade);
            atualizarResumo();
        }
    });
}

// Cupons
const CUPONS_VALIDOS = { 'VERDE10': 10, 'LAZY20': 20, 'SENAI': 15 };
const btnCupom = document.getElementById('btn-cupom');
if (btnCupom) {
    btnCupom.addEventListener('click', function () {
        const campoCupom = document.getElementById('cupom');
        const msgEl      = document.getElementById('cupom-msg');
        if (!campoCupom || !msgEl) return;

        const codigo = campoCupom.value.trim().toUpperCase();

        if (CUPONS_VALIDOS[codigo] !== undefined) {
            const pct = CUPONS_VALIDOS[codigo];
            descuentoValor = (PRECO_UNITARIO * quantidade) * (pct / 100);
            msgEl.textContent = '✅ Cupom aplicado! ' + pct + '% de desconto.';
            msgEl.style.color = '#2e7d32';
        } else if (codigo === '') {
            msgEl.textContent = 'Digite um cupom antes de aplicar.';
            msgEl.style.color = '#c62828';
        } else {
            msgEl.textContent = '❌ Cupom inválido. Tente: VERDE10, LAZY20 ou SENAI';
            msgEl.style.color = '#c62828';
            descuentoValor = 0;
        }
        atualizarResumo();
    });
}

// ==========================================
// FUNÇÕES DA PÁGINA DE CARRINHO
// ==========================================
function renderizarCarrinho() {
    const carrinho = lerCarrinho();
    const container = document.getElementById('carrinho-conteudo');
    const subtituloEl = document.getElementById('subtitulo-qtd');

    if (!container || !subtituloEl) return;

    atualizarBadge(carrinho);

    // CASO 1: O carrinho está vazio
    if (carrinho.length === 0) {
        subtituloEl.textContent = 'Seu carrinho está vazio.';
        container.innerHTML = `
            <div class="carrinho-vazio">
                <h3>Nada por aqui ainda!</h3>
                <p>Adicione produtos para continuar as compras.</p>
                <a href="Compras.html" class="btn-ir-compras">Ver produtos</a>
            </div>
        `;
        return;
    }

    // CASO 2: O carrinho tem itens
    const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
    const totalValor = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
    
    subtituloEl.textContent = totalItens + (totalItens === 1 ? ' item no carrinho' : ' itens no carrinho');
    
    let htmlItens = '<div class="carrinho-lista">';
    
    carrinho.forEach(function(item, index) {
        htmlItens += `
            <div class="carrinho-item">
                <img src="${item.imagem}" alt="${item.nome}" class="item-img">
                <div class="item-info">
                    <p class="item-nome">${item.nome}</p>
                    <p class="item-desc">Estufa inteligente • Bivolt</p>
                    <div class="item-quantidade">
                        <button class="qty-btn" onclick="alterarQuantidade(${index}, -1)">−</button>
                        <span class="qty-numero">${item.quantidade}</span>
                        <button class="qty-btn" onclick="alterarQuantidade(${index}, +1)">+</button>
                    </div>
                </div>
                <div class="item-preco-col">
                    <p class="item-preco">${formatarReais(item.preco * item.quantidade)}</p>
                    <button class="btn-remover" onclick="removerItem(${index})">✕ Remover</button>
                </div>
            </div>
        `;
    });
    
    htmlItens += '</div>';

    // Gera o rodapé do resumo de valores
    const htmlRodape = `
        <div class="carrinho-rodape">
            <div class="rodape-linha">
                <span>Subtotal (${totalItens} ${totalItens === 1 ? 'item' : 'itens'})</span>
                <span>${formatarReais(totalValor)}</span>
            </div>
            <div class="rodape-linha">
                <span>Frete</span>
                <span style="color:#2e7d32;font-weight:600;">Grátis</span>
            </div>
            <div class="rodape-total">
                <span>Total</span>
                <span>${formatarReais(totalValor)}</span>
            </div>
            <a href="pagamento.html" class="btn-checkout">Finalizar Compra →</a>
            <a href="Compras.html" class="btn-continuar">← Continuar comprando</a>
            <p class="seguro-msg">Compra 100% segura e criptografada</p>
        </div>
    `;

    // Injeta a lista completa de itens + o rodapé financeiro na div do HTML
    container.innerHTML = htmlItens + htmlRodape;
}

function alterarQuantidade(index, delta) {
    let carrinho = lerCarrinho();
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

function removerItem(index) {
    let carrinho = lerCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

// ==========================================
// AUTENTICAÇÃO
// ==========================================
function cadastrarUsuario() {
    var nome          = document.getElementById('nome')?.value || '';
    var email         = document.getElementById('email')?.value || '';
    var senha         = document.getElementById('senha')?.value || '';
    var confirmaSenha = document.getElementById('confirma_senha')?.value || '';
    var termosAceitos = document.getElementById('termos')?.checked || false;

    if (!nome || !email || !senha) { alert("Preencha todos os campos obrigatórios!"); return; }
    if (senha !== confirmaSenha)   { alert("As senhas não coincidem!"); return; }
    if (!termosAceitos)            { alert("Aceite os termos de uso!"); return; }

    alert("Cadastro realizado com sucesso! Bem-vindo(a).");
    window.location.href = "../pages/login.html";
}

function loginUsuario() {
    alert("Login realizado com sucesso!");
    window.location.href = "../pages/index.html";
}

// ==========================================
// INICIALIZAÇÃO (aguarda o DOM)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {

    // Métodos de pagamento
    const btnCartao  = document.getElementById('btn-cartao');
    const btnPix     = document.getElementById('btn-pix');
    const btnBoleto  = document.getElementById('btn-boleto');
    const secaoCartao = document.getElementById('form-cartao');
    const secaoPix    = document.getElementById('pix');
    const secaoBoleto = document.getElementById('boleto');

    if (btnCartao && btnPix && btnBoleto) {
        function resetarBotoes() {
            [btnCartao, btnPix, btnBoleto].forEach(b => b.classList.remove('metodo-ativo'));
        }
        btnCartao.addEventListener('click', function () {
            resetarBotoes(); btnCartao.classList.add('metodo-ativo');
            secaoCartao?.classList.remove('escondido');
            secaoPix?.classList.add('escondido');
            secaoBoleto?.classList.add('escondido');
        });
        btnPix.addEventListener('click', function () {
            resetarBotoes(); btnPix.classList.add('metodo-ativo');
            secaoPix?.classList.remove('escondido');
            secaoCartao?.classList.add('escondido');
            secaoBoleto?.classList.add('escondido');
        });
        btnBoleto.addEventListener('click', function () {
            resetarBotoes(); btnBoleto.classList.add('metodo-ativo');
            secaoBoleto?.classList.remove('escondido');
            secaoCartao?.classList.add('escondido');
            secaoPix?.classList.add('escondido');
        });
    }

    // Botão finalizar — ÚNICA declaração, dentro do DOMContentLoaded
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function () {
            alert('Compra finalizada com sucesso!  Obrigado por comprar na Lazy Greenhouse.');
        });
    }



    // Inicializa o resumo ao carregar
    atualizarResumo();
});


document.addEventListener("DOMContentLoaded", function () {

    // Métodos de pagamento
    const btnCartao   = document.getElementById('btn-cartao');
    const btnPix      = document.getElementById('btn-pix');
    const btnBoleto   = document.getElementById('btn-boleto');
    const secaoCartao = document.getElementById('form-cartao');
    const secaoPix    = document.getElementById('pix');
    const secaoBoleto = document.getElementById('boleto');

    if (btnCartao && btnPix && btnBoleto) {
        function resetarBotoes() {
            [btnCartao, btnPix, btnBoleto].forEach(b => b.classList.remove('metodo-ativo'));
        }
        btnCartao.addEventListener('click', function () {
            resetarBotoes(); btnCartao.classList.add('metodo-ativo');
            secaoCartao?.classList.remove('escondido');
            secaoPix?.classList.add('escondido');
            secaoBoleto?.classList.add('escondido');
        });
        btnPix.addEventListener('click', function () {
            resetarBotoes(); btnPix.classList.add('metodo-ativo');
            secaoPix?.classList.remove('escondido');
            secaoCartao?.classList.add('escondido');
            secaoBoleto?.classList.add('escondido');
        });
        btnBoleto.addEventListener('click', function () {
            resetarBotoes(); btnBoleto.classList.add('metodo-ativo');
            secaoBoleto?.classList.remove('escondido');
            secaoCartao?.classList.add('escondido');
            secaoPix?.classList.add('escondido');
        });
    }

    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function () {
            alert('Compra finalizada com sucesso! Obrigado por comprar na Lazy Greenhouse.');
        });
    }

    // Inicializa carrinho OU resumo dependendo da página
    if (document.getElementById('carrinho-conteudo')) {
        renderizarCarrinho();
    } else {
        atualizarResumo();
    }

});

function adicionarAoCarrinho() {
    let carrinho = lerCarrinho();
    const index = carrinho.findIndex(item => item.id === 1);

    if (index >= 0) {
        carrinho[index].quantidade += 1;
    } else {
        carrinho.push({
            id: 1,
            nome: "Lazy Greenhouse",
            preco: 185.00,
            quantidade: 1,
            imagem: "https://www.image2url.com/r2/default/images/1776791311496-d3d72ae2-afbd-48a7-ac6d-7534884128c0.png"
        });
    }

    salvarCarrinho(carrinho);
    alert("Produto adicionado ao carrinho!");
    window.location.href = "../pages/carrinho.html";
}

// Adicione isso no final do arquivo para disparar o gatilho na página do carrinho
if (document.getElementById('carrinho-conteudo')) {
    renderizarCarrinho();
}