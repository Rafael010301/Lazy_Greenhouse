// ==========================================
// SISTEMA DE PAGAMENTO E RESUMO INTEGRADO
// ==========================================

// Em vez de travar em 1, lê a quantidade real que está no carrinho
function obterQuantidadeDoCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    // Como o site só tem 1 produto (id: 1), pegamos a quantidade dele. Se não houver, assume 1.
    const produtoNoCarrinho = carrinho.find(item => item.id === 1);
    return produtoNoCarrinho ? produtoNoCarrinho.quantidade : 1;
}

let quantidade = obterQuantidadeDoCarrinho();
let descuentoValor = 0;

function atualizarResumo() {
    const subtotal = PRECO_UNITARIO * quantidade;
    const total = subtotal - descuentoValor;

    const qtyDisplay = document.getElementById('qty-display');
    const precoItem = document.getElementById('preco-item');
    const subtotalEl = document.getElementById('subtotal');
    const descontoEl = document.getElementById('desconto');
    const totalFinal = document.getElementById('total-final');

    if (qtyDisplay) qtyDisplay.textContent = quantidade; 
    if (precoItem) precoItem.textContent = formatarReais(subtotal);
    if (subtotalEl) subtotalEl.textContent = formatarReais(subtotal);
    if (totalFinal) totalFinal.textContent = formatarReais(total);
    
<<<<<<< Updated upstream
    if (descontoEl) {
        descontoEl.textContent = descuentoValor > 0 ? '— ' + formatarReais(descuentoValor) : '— R$ 0,00';
=======
    // Atualiza a navbar em todas as páginas
    atualizarBadge(carrinho);

    // Só renderiza se for a página do carrinho
    if (document.getElementById('carrinho-conteudo')) {
        renderizarCarrinho();
>>>>>>> Stashed changes
    }
}

// Atualiza também o localStorage para o carrinho não ficar desatualizado
function salvarQuantidadeNoCarrinho(novaQtd) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = carrinho.findIndex(item => item.id === 1);
    if (index >= 0) {
        carrinho[index].quantidade = novaQtd;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }
}

// Botões de mais e menos na tela de pagamento
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

// Lógica de Cupons
const CUPONS_VALIDOS = { 'VERDE10': 10, 'LAZY20': 20, 'SENAI': 15 };
const btnCupom = document.getElementById('btn-cupom');

if (btnCupom) {
    btnCupom.addEventListener('click', function () {
        const campoCupom = document.getElementById('cupom');
        const msgEl = document.getElementById('cupom-msg');
        if (!campoCupom || !msgEl) return;

        const codigoCupom = campoCupom.value.trim().toUpperCase();

        if (CUPONS_VALIDOS[codigoCupom] !== undefined) {
            const percentual = CUPONS_VALIDOS[codigoCupom];
            descuentoValor = (PRECO_UNITARIO * quantidade) * (percentual / 100);
            msgEl.textContent = '✅ Cupom aplicado! ' + percentual + '% de desconto.';
            msgEl.style.color = '#2e7d32';
        } else if (codigoCupom === '') {
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

// Seletores de Métodos de Pagamento
const botoesMetodo = document.querySelectorAll('.metodo-btn');
botoesMetodo.forEach(function(btn) {
    btn.addEventListener('click', function () {
        botoesMetodo.forEach(b => b.classList.remove('metodo-ativo'));
        btn.classList.add('metodo-ativo');
    });
});

<<<<<<< Updated upstream
// Finalização da Compra (Modal)
const btnFinalizar = document.getElementById('btn-finalizar');
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', function () {
        const campoNome = document.getElementById('nome');
        const nomeCliente = campoNome ? campoNome.value.trim() || 'Cliente' : 'Cliente';
        
        const modalNome = document.getElementById('modal-nome-cliente');
        const modalCodigo = document.getElementById('modal-codigo-pedido');
        const overlay = document.getElementById('overlay-modal');

        if (modalNome) modalNome.textContent = nomeCliente;
        if (modalCodigo) modalCodigo.textContent = '#' + Math.floor(100000 + Math.random() * 900000);
        if (overlay) overlay.style.display = 'flex';

        localStorage.removeItem('carrinho');
    });
}

// Fechamentos do Modal
const btnFecharModal = document.getElementById('btn-fechar-modal');
if (btnFecharModal) {
    btnFecharModal.addEventListener('click', function () {
        document.getElementById('overlay-modal').style.display = 'none';
    });
}

const overlayModal = document.getElementById('overlay-modal');
if (overlayModal) {
    overlayModal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
=======
// ==========================================
// FUNÇÕES GLOBAIS DO CARRINHO
// ==========================================
function lerCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Seu badge unificado (usa a função que você já tinha criado)
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
// FUNÇÕES ESPECÍFICAS DA PÁGINA DE CARRINHO
// ==========================================
function renderizarCarrinho() {
    const carrinho = lerCarrinho();
    const container = document.getElementById('carrinho-conteudo');
    const subtituloEl = document.getElementById('subtitulo-qtd');

    if (!container || !subtituloEl) return;

    atualizarBadge(carrinho);

    if (carrinho.length === 0) {
        subtituloEl.textContent = 'Seu carrinho está vazio.';
        container.innerHTML = `
            <div class="carrinho-vazio">
                <div class="icone-vazio">🛒</div>
                <h3>Nada por aqui ainda!</h3>
                <p>Adicione produtos para continuar as compras.</p>
                <a href="Compras.html" class="btn-ir-compras">Ver produtos</a>
            </div>
        `;
        return;
    }

    const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
    subtituloEl.textContent = totalItens + (totalItens === 1 ? ' item no carrinho' : ' itens no carrinho');

    const totalValor = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);

    let htmlItens = '<div class="carrinho-lista">';
    carrinho.forEach(function(item, index) {
        const subtotalItem = item.preco * item.quantidade;
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
                    <p class="item-preco">${formatarReais(subtotalItem)}</p>
                    <button class="btn-remover" onclick="removerItem(${index})">✕ Remover</button>
                </div>
            </div>
        `;
    });
    htmlItens += '</div>';

    const htmlRodape = `
        <div class="carrinho-rodape">
            <div class="rodape-linha">
                <span>Subtotal (${totalItens} ${totalItens === 1 ? 'item' : 'itens'})</span>
                <span>${formatarReais(totalValor)}</span>
            </div>
            <div class="rodape-linha">
                <span>Frete</span>
                <span style="color:#2e7d32; font-weight:600;">Grátis</span>
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

    container.innerHTML = htmlItens + htmlRodape;
}

function alterarQuantidade(index, delta) {
    let carrinho = lerCarrinho();
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
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
// LÓGICA DE USUÁRIOS (SISTEMA DE AUTENTICAÇÃO)
// ==========================================

function cadastrarUsuario() {
    // 🎯 Captura os valores EXATAMENTE no momento do clique
    var nome = document.getElementById('nome') ? document.getElementById('nome').value : '';
    var email = document.getElementById('email') ? document.getElementById('email').value : '';
    var senha = document.getElementById('senha') ? document.getElementById('senha').value : '';
    var confirmaSenha = document.getElementById('confirma_senha') ? document.getElementById('confirma_senha').value : '';
    var termos = document.getElementById('termos');
    var termosAceitos = termos ? termos.checked : false;

    // Validação simples para ajudar sua usabilidade
    if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    if (senha !== confirmaSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    if (!termosAceitos) {
        alert("Você precisa aceitar os termos de uso!");
        return;
    }

    // Se passou nas validações, salva e redireciona
    alert("Cadastro realizado com sucesso! Bem-vindo(a).");
    window.location.href = "../pages/login.html"; 
}

function loginUsuario() {
    alert("Login realizado com sucesso!");
    window.location.href = "../pages/index.html"; 
>>>>>>> Stashed changes
}