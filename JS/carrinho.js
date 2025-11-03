// =============================================
// CARRINHO.JS - Sistema de Carrinho de Compras
// =============================================

// Carregar carrinho do localStorage
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Dados dos produtos
const produtos = {
  'bolo_aniversario': {
    nome: 'Bolo de Aniversário',
    imagem: 'img/bolo_de_aniversario_02.png',
    precos: { pequeno: 100, medio: 120, grande: 150 }
  },
  'bolo_marshmallow': {
    nome: 'Bolo de Marshmallow',
    imagem: 'img/bolo_marshmallow.jpeg',
    precos: { pequeno: 120, medio: 140, grande: 160 }
  },
  'bolo_prestigio': {
    nome: 'Bolo Prestígio',
    imagem: 'img/bolo_prestigio.jpeg',
    precos: { pequeno: 90, medio: 110, grande: 130 }
  },
  'torta_cookie': {
    nome: 'Torta Cookie',
    imagem: 'img/torta_cookie.jpeg',
    precos: { pequeno: 120, medio: 150, grande: 180 }
  },
  'pavlova': {
    nome: 'Pavlova',
    imagem: 'img/pavlova_02.png',
    precos: { pequeno: 120, medio: 150, grande: 180 }
  },
  'bombom_nutella': {
    nome: 'Bombom Nutella',
    imagem: 'img/bombom_nutella.jpeg',
    precos: { unico: 15 }
  },
  'morango_amor': {
    nome: 'Morango do Amor',
    imagem: 'img/morango_do_amor_02.png',
    precos: { unico: 12 }
  }
};

// Atualizar contador de itens
function atualizarContador() {
  const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  document.getElementById('contadorItens').textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
}

// Calcular subtotal
function calcularSubtotal() {
  return carrinho.reduce((sum, item) => {
    const produto = produtos[item.id];
    const preco = produto.precos[item.tamanho] || produto.precos.unico;
    return sum + (preco * item.quantidade);
  }, 0);
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Remover item do carrinho
function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  renderizarCarrinho();
  mostrarNotificacao('Item removido do carrinho', 'info');
}

// Alterar quantidade do item
function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    removerItem(index);
  } else {
    salvarCarrinho();
    renderizarCarrinho();
  }
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  const notif = document.createElement('div');
  notif.className = 'notificacao-carrinho';
  
  const cores = {
    sucesso: '#4cd137',
    erro: '#ff4757',
    info: '#ffa502'
  };
  
  notif.style.background = cores[tipo] || cores.sucesso;
  notif.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 1.5rem;">${tipo === 'sucesso' ? '✓' : tipo === 'erro' ? '✗' : 'ℹ'}</span>
      <span>${mensagem}</span>
    </div>
  `;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(100px)';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Finalizar compra
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const subtotal = calcularSubtotal();
  const taxaEntrega = 10;
  const total = subtotal + taxaEntrega;
  
  let mensagem = '🎂 PEDIDO - AMOR AOS PEDAÇOS 🎂\n\n';
  mensagem += '══════════════════════════════\n';
  
  carrinho.forEach((item, index) => {
    const produto = produtos[item.id];
    const preco = produto.precos[item.tamanho] || produto.precos.unico;
    const tamanhoTexto = {
      pequeno: 'Pequeno',
      medio: 'Médio',
      grande: 'Grande',
      unico: 'Unidade'
    };
    
    mensagem += `\n${index + 1}. ${produto.nome}\n`;
    mensagem += `   Tamanho: ${tamanhoTexto[item.tamanho]}\n`;
    mensagem += `   Quantidade: ${item.quantidade}\n`;
    mensagem += `   Valor: R$ ${(preco * item.quantidade).toFixed(2)}\n`;
    if (item.observacoes) {
      mensagem += `   Obs: ${item.observacoes}\n`;
    }
  });
  
  mensagem += '\n══════════════════════════════\n';
  mensagem += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
  mensagem += `Taxa de Entrega: R$ ${taxaEntrega.toFixed(2)}\n`;
  mensagem += `TOTAL: R$ ${total.toFixed(2)}\n`;
  mensagem += '══════════════════════════════\n\n';
  mensagem += 'Entraremos em contato para confirmar\n';
  mensagem += 'os detalhes de pagamento e entrega.\n\n';
  mensagem += 'Obrigado por escolher Amor aos Pedaços! ❤️';
  
  alert(mensagem);
  
  // Limpar carrinho
  carrinho = [];
  salvarCarrinho();
  renderizarCarrinho();
  mostrarNotificacao('Pedido enviado com sucesso!', 'sucesso');
}

// Renderizar carrinho
function renderizarCarrinho() {
  const conteudo = document.getElementById('carrinhoConteudo');
  atualizarContador();

  if (carrinho.length === 0) {
    conteudo.innerHTML = `
      <div class="carrinho-vazio">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione deliciosos doces ao seu carrinho!</p>
        <a href="produtos.html">Ver Produtos</a>
      </div>
    `;
    return;
  }

  const subtotal = calcularSubtotal();
  const taxaEntrega = 10;
  const total = subtotal + taxaEntrega;

  const tamanhoTexto = {
    pequeno: 'Pequeno (6-8 pessoas)',
    medio: 'Médio (10-12 pessoas)',
    grande: 'Grande (15-20 pessoas)',
    unico: 'Unidade'
  };

  conteudo.innerHTML = `
    <div class="grid-layout">
      <div class="itens-carrinho">
        ${carrinho.map((item, index) => {
          const produto = produtos[item.id];
          const preco = produto.precos[item.tamanho] || produto.precos.unico;

          return `
            <div class="item-carrinho">
              <img src="${produto.imagem}" alt="${produto.nome}" class="item-imagem">
              <div class="item-info">
                <h3>${produto.nome}</h3>
                <p class="item-detalhes">${tamanhoTexto[item.tamanho]}</p>
                ${item.observacoes ? `<p class="item-detalhes"><em>${item.observacoes}</em></p>` : ''}
                <p class="item-preco">R$ ${preco.toFixed(2)} cada</p>
              </div>
              <div class="item-acoes">
                <div class="quantidade-controle">
                  <button onclick="alterarQuantidade(${index}, -1)">−</button>
                  <span>${item.quantidade}</span>
                  <button onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
                <button class="btn-remover" onclick="removerItem(${index})">Remover</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div>
        <div class="resumo-carrinho">
          <h3>Resumo do Pedido</h3>
          <div class="resumo-linha">
            <span>Subtotal</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
          <div class="resumo-linha">
            <span>Taxa de Entrega</span>
            <span>R$ ${taxaEntrega.toFixed(2)}</span>
          </div>
          <div class="resumo-total">
            <span>Total</span>
            <span>R$ ${total.toFixed(2)}</span>
          </div>
          <button class="btn-finalizar" onclick="finalizarCompra()">Finalizar Compra</button>
          <button class="btn-continuar" onclick="window.location.href='produtos.html'">Continuar Comprando</button>
        </div>
      </div>
    </div>
  `;
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  renderizarCarrinho();
});