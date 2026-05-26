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
    
    if (descontoEl) {
        descontoEl.textContent = descuentoValor > 0 ? '— ' + formatarReais(descuentoValor) : '— R$ 0,00';
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
}