const PRECO_UNITARIO = 185.00;

// ==========================================
// CONTROLADOR DE INICIALIZAÇÃO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const carrinho = lerCarrinho();
    
    // 1. Roda em absolutamente TODAS as páginas para manter a Navbar atualizada
    atualizarBadge(carrinho);

    // 2. Só roda a renderização se estiver de fato na página de carrinho
    // (Garante que não quebre nas páginas de Login, Cadastro, Index, etc.)
    if (document.getElementById('carrinho-conteudo')) {
        renderizarCarrinho();
    }
});

// ==========================================
// FUNÇÕES GLOBAIS (Acessíveis por qualquer página)
// ==========================================

// Lê o carrinho do localStorage
function lerCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

// Salva o carrinho no localStorage
function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Formata número como reais
function formatarReais(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// Atualiza o badge de quantidade na navbar (Roda globalmente)
function atualizarBadge(carrinho) {
    const badge = document.getElementById('nav_cart_badge');
    
    // Se o badge existir na navbar desta página, atualiza ele
    if (badge) {
        const total = carrinho.reduce((s, i) => s + i.quantidade, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

// ==========================================
// FUNÇÕES ESPECÍFICAS DA PÁGINA DE CARRINHO
// ==========================================

// Renderiza o conteúdo da página com base no carrinho
function renderizarCarrinho() {
    const carrinho = lerCarrinho();
    const container = document.getElementById('carrinho-conteudo');
    const subtituloEl = document.getElementById('subtitulo-qtd');

    // Segurança extra: se os elementos da página de carrinho sumirem por algum motivo, não executa
    if (!container || !subtituloEl) return;

    atualizarBadge(carrinho);

    // Se carrinho estiver vazio, mostra mensagem
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

    // Conta total de itens
    const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
    subtituloEl.textContent = totalItens + (totalItens === 1 ? ' item no carrinho' : ' itens no carrinho');

    // Calcula o valor total
    const totalValor = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);

    // Monta o HTML da lista de itens
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

    // Monta o rodapé com total e botão de checkout
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

// Altera a quantidade de um item (+1 ou -1)
function alterarQuantidade(index, delta) {
    let carrinho = lerCarrinho();
    carrinho[index].quantidade += delta;
    
    // Remove o item se a quantidade chegar a 0
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    salvarCarrinho(carrinho);
    renderizarCarrinho(); // Atualiza a tela do carrinho
}

// Remove um item do carrinho pelo índice
function removerItem(index) {
    let carrinho = lerCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}




var nome = document.getElementById('nome').value;
var email = document.getElementById('email').value;
var senha = document.getElementById('senha').value;
var confirmaSenha = document.getElementById('confirma_senha').value;
var termosAceitos = document.getElementById('termos').checked;

function cadastrarUsuario() {
    alert("Cadastro realizado com sucesso! Bem-vindo(a).");
    window.location.href = "login.html"; 
}

function loginUsuario() {
    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
}