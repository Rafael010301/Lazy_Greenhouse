// ==========================================
// LAZY GREENHOUSE — js/script.js
// Script centralizado e defensivo.
// Cada seção verifica se o elemento existe
// antes de registrar qualquer evento.
// ==========================================

// ------------------------------------------
// CONSTANTES E UTILITÁRIOS GLOBAIS
// ------------------------------------------
const PRECO_UNITARIO = 185.00;

function formatarReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ==========================================
// SEÇÃO 1 — BADGE DO CARRINHO
// Roda em todas as páginas que tiverem #cart_badge
// ==========================================
function atualizarBadgeCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const badge = document.getElementById('cart_badge');
    if (!badge) return; // Sai silenciosamente se a página não tiver badge
    const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

// Chama ao carregar para já exibir o estado atual
atualizarBadgeCarrinho();

// ==========================================
// SEÇÃO 2 — PÁGINA DE COMPRAS (Compras.html)
// Botão "Adicionar ao carrinho"
// ==========================================
const btnAdicionarCarrinho = document.getElementById('btn-adicionar-carrinho');
if (btnAdicionarCarrinho) {
    btnAdicionarCarrinho.addEventListener('click', function (e) {
        e.preventDefault();
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const index = carrinho.findIndex(item => item.id === 1);
        if (index >= 0) {
            carrinho[index].quantidade += 1;
        } else {
            carrinho.push({
                id: 1,
                nome: 'Lazy Greenhouse',
                preco: PRECO_UNITARIO,
                quantidade: 1
            });
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarBadgeCarrinho();
        window.location.href = 'carrinho.html';
    });
}

// ==========================================
// SEÇÃO 3 — PÁGINA DO CARRINHO (carrinho.html)
// Renderiza itens do localStorage
// ==========================================
const conteudoCarrinhoEl = document.getElementById('carrinho-conteudo');
if (conteudoCarrinhoEl) {
    function renderizarCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const subtituloEl = document.getElementById('subtitulo-qtd');

        if (carrinho.length === 0) {
            conteudoCarrinhoEl.innerHTML = `
                <div style="text-align:center; padding: 3rem 0;">
                    <p style="font-size:1.2rem; color:#888;">Seu carrinho está vazio.</p>
                    <a href="Compras.html" style="display:inline-block;margin-top:1rem;
                       padding:.75rem 2rem;background:#3a7d44;color:#fff;
                       border-radius:8px;text-decoration:none;">Ver produtos</a>
                </div>`;
            if (subtituloEl) subtituloEl.textContent = '0 itens no carrinho';
            return;
        }

        const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
        if (subtituloEl) {
            subtituloEl.textContent =
                `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} no carrinho`;
        }

        const totalGeral = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);

        conteudoCarrinhoEl.innerHTML = carrinho.map(item => `
            <div class="carrinho-item" data-id="${item.id}">
                <div class="carrinho-item-info">
                    <p class="carrinho-item-nome">${item.nome}</p>
                    <p class="carrinho-item-preco">
                        ${formatarReais(item.preco)} × ${item.quantidade}
                    </p>
                </div>
                <div class="carrinho-item-acoes">
                    <button class="qty-btn btn-remover-item" data-id="${item.id}">
                        Remover
                    </button>
                    <p class="carrinho-item-subtotal">
                        ${formatarReais(item.preco * item.quantidade)}
                    </p>
                </div>
            </div>
        `).join('') + `
            <div class="carrinho-total">
                <strong>Total: ${formatarReais(totalGeral)}</strong>
                <a href="pagamento.html" class="btn-finalizar-carrinho">Finalizar Compra</a>
            </div>`;

        // Rebinda botões de remoção após renderizar
        conteudoCarrinhoEl.querySelectorAll('.btn-remover-item').forEach(btn => {
            btn.addEventListener('click', function () {
                let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                const id = parseInt(this.dataset.id);
                carrinho = carrinho.filter(i => i.id !== id);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                atualizarBadgeCarrinho();
                renderizarCarrinho();
            });
        });
    }

    renderizarCarrinho();
}

// ==========================================
// SEÇÃO 4 — PÁGINA DE PAGAMENTO (pagamento.html)
// ==========================================

// Lê quantidade atual do carrinho — leitura isolada dentro desta seção
function obterQuantidadeDoCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtoNoCarrinho = carrinho.find(item => item.id === 1);
    return produtoNoCarrinho ? produtoNoCarrinho.quantidade : 1;
}

let quantidade = obterQuantidadeDoCarrinho();
let descontoValor = 0;

function atualizarResumo() {
    const subtotal = PRECO_UNITARIO * quantidade;
    const total = subtotal - descontoValor;

    const qtyDisplay   = document.getElementById('qty-display');
    const precoItem    = document.getElementById('preco-item');
    const subtotalEl   = document.getElementById('subtotal');
    const descontoEl   = document.getElementById('desconto');
    const totalFinal   = document.getElementById('total-final');

    if (qtyDisplay)  qtyDisplay.textContent  = quantidade;
    if (precoItem)   precoItem.textContent    = formatarReais(subtotal);
    if (subtotalEl)  subtotalEl.textContent   = formatarReais(subtotal);
    if (totalFinal)  totalFinal.textContent   = formatarReais(total);
    if (descontoEl) {
        descontoEl.textContent =
            descontoValor > 0 ? '— ' + formatarReais(descontoValor) : '— R$ 0,00';
    }
}

// Atualiza o localStorage para carrinho não ficar desatualizado
function salvarQuantidadeNoCarrinho(novaQtd) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const index = carrinho.findIndex(item => item.id === 1);
    if (index >= 0) {
        carrinho[index].quantidade = novaQtd;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }
}

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
            descontoValor = (PRECO_UNITARIO * quantidade) * (percentual / 100);
            msgEl.textContent = '✅ Cupom aplicado! ' + percentual + '% de desconto.';
            msgEl.style.color = '#2e7d32';
        } else if (codigoCupom === '') {
            msgEl.textContent = 'Digite um cupom antes de aplicar.';
            msgEl.style.color = '#c62828';
        } else {
            msgEl.textContent = '❌ Cupom inválido. Tente: VERDE10, LAZY20 ou SENAI';
            msgEl.style.color = '#c62828';
            descontoValor = 0;
        }
        atualizarResumo();
    });
}

// Seletores de Métodos de Pagamento
const botoesMetodo = document.querySelectorAll('.metodo-btn');
botoesMetodo.forEach(function (btn) {
    btn.addEventListener('click', function () {
        botoesMetodo.forEach(b => b.classList.remove('metodo-ativo'));
        btn.classList.add('metodo-ativo');
    });
});

// Finalização da Compra (Modal)
const btnFinalizar = document.getElementById('btn-finalizar');
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', function () {
        // Lê o valor do input no momento do clique — não em escopo global
        const campoNome = document.getElementById('nome');
        const nomeCliente = campoNome ? campoNome.value.trim() || 'Cliente' : 'Cliente';

        const modalNome   = document.getElementById('modal-nome-cliente');
        const modalCodigo = document.getElementById('modal-codigo-pedido');
        const overlay     = document.getElementById('overlay-modal');

        if (modalNome)   modalNome.textContent   = nomeCliente;
        if (modalCodigo) modalCodigo.textContent =
            '#' + Math.floor(100000 + Math.random() * 900000);
        if (overlay)     overlay.style.display   = 'flex';

        localStorage.removeItem('carrinho');
        atualizarBadgeCarrinho();
    });
}

const btnFecharModal = document.getElementById('btn-fechar-modal');
if (btnFecharModal) {
    btnFecharModal.addEventListener('click', function () {
        const overlay = document.getElementById('overlay-modal');
        if (overlay) overlay.style.display = 'none';
    });
}

const overlayModal = document.getElementById('overlay-modal');
if (overlayModal) {
    overlayModal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

// ==========================================
// SEÇÃO 5 — PÁGINA DE LOGIN (login.html)
// Substitui o onclick="loginUsuario()" inline
// ==========================================
function loginUsuario() {
    // Lê os inputs dentro da função, não no escopo global
    const emailEl = document.getElementById('email');
    const senhaEl = document.getElementById('senha');
    if (!emailEl || !senhaEl) return;

    const email = emailEl.value.trim();
    const senha = senhaEl.value.trim();

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor, informe um e-mail válido.');
        return;
    }

    // Lógica de negócio preservada — autenticação via localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        alert('Login realizado com sucesso! Bem-vindo, ' + usuarioEncontrado.nome + '!');
        window.location.href = 'index.html';
    } else {
        alert('E-mail ou senha incorretos. Verifique seus dados.');
    }
}

const btnEntrar = document.getElementById('btn-entrar');
if (btnEntrar) {
    btnEntrar.addEventListener('click', loginUsuario);
}

// ==========================================
// SEÇÃO 6 — PÁGINA DE CADASTRO (cadastro.html)
// Substitui o onclick="cadastrarUsuario()" inline
// ==========================================
function cadastrarUsuario() {
    // Lê todos os inputs dentro da função, não no escopo global
    const nomeEl         = document.getElementById('nome');
    const emailEl        = document.getElementById('email');
    const senhaEl        = document.getElementById('senha');
    const confirmaSenhaEl = document.getElementById('confirma_senha');
    const termosEl       = document.getElementById('termos');

    if (!nomeEl || !emailEl || !senhaEl || !confirmaSenhaEl) return;

    const nome         = nomeEl.value.trim();
    const email        = emailEl.value.trim();
    const senha        = senhaEl.value.trim();
    const confirmaSenha = confirmaSenhaEl.value.trim();

    if (!nome || !email || !senha || !confirmaSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor, informe um e-mail válido.');
        return;
    }
    if (senha !== confirmaSenha) {
        alert('As senhas não coincidem. Verifique e tente novamente.');
        return;
    }
    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    if (termosEl && !termosEl.checked) {
        alert('Você precisa aceitar os termos para continuar.');
        return;
    }

    // Lógica de negócio preservada — persistência via localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const emailJaCadastrado = usuarios.some(u => u.email === email);

    if (emailJaCadastrado) {
        alert('Este e-mail já está cadastrado. Tente fazer login.');
        return;
    }

    usuarios.push({ nome, email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    window.location.href = 'login.html';
}

const btnCadastrar = document.getElementById('btn-cadastrar');
if (btnCadastrar) {
    btnCadastrar.addEventListener('click', cadastrarUsuario);
}
