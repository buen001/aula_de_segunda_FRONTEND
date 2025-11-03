// =============================================
// PRODUTO.JS - Sistema de Adicionar ao Carrinho
// =============================================

// Atualizar contador do badge
function atualizarBadge() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const badge = document.getElementById('contadorBadge');
    if (badge) {
      badge.textContent = total;
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
        <div>
          <strong>${mensagem}</strong>
          <div style="font-size: 0.85rem; margin-top: 4px;">
            <a href="carrinho.html" style="color: white; text-decoration: underline;">Ver carrinho</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(100px)';
      setTimeout(() => notif.remove(), 300);
    }, 4000);
  }
  
  // Adicionar ao carrinho
  function adicionarAoCarrinho(event, produtoId) {
    event.preventDefault();
    
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const tamanhoSelect = document.getElementById('tamanho');
    const tamanho = tamanhoSelect ? tamanhoSelect.value : 'unico';
    const observacoesField = document.getElementById('observacoes');
    const observacoes = observacoesField ? observacoesField.value : '';
  
    // Validação
    if (!quantidade || quantidade < 1) {
      mostrarNotificacao('Por favor, selecione uma quantidade válida', 'erro');
      return;
    }
  
    // Validação de quantidade máxima para produtos unitários
    if (!tamanhoSelect && quantidade > 50) {
      mostrarNotificacao('Quantidade máxima: 50 unidades. Entre em contato para pedidos maiores.', 'erro');
      return;
    }
  
    // Criar objeto do item
    const item = {
      id: produtoId,
      quantidade: quantidade,
      tamanho: tamanho,
      observacoes: observacoes,
      dataAdicionado: new Date().toISOString()
    };
  
    // Carregar carrinho existente
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verificar se já existe item igual
    const indexExistente = carrinho.findIndex(i => 
      i.id === item.id && 
      i.tamanho === item.tamanho && 
      i.observacoes === item.observacoes
    );
  
    if (indexExistente !== -1) {
      const novaQuantidade = carrinho[indexExistente].quantidade + quantidade;
      
      // Validação para produtos unitários
      if (!tamanhoSelect && novaQuantidade > 50) {
        mostrarNotificacao('Não é possível adicionar mais. Limite: 50 unidades no total.', 'erro');
        return;
      }
      
      carrinho[indexExistente].quantidade = novaQuantidade;
      mostrarNotificacao(`Quantidade atualizada! (${carrinho[indexExistente].quantidade} no total)`);
    } else {
      carrinho.push(item);
      mostrarNotificacao('Produto adicionado ao carrinho!');
    }
  
    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarBadge();
  
    // Animar badge
    const badge = document.querySelector('.badge-carrinho');
    if (badge) {
      badge.style.transform = 'scale(1.3) rotate(10deg)';
      setTimeout(() => {
        badge.style.transform = 'scale(1) rotate(0deg)';
      }, 300);
    }
  
    // Efeito no botão
    const btnSubmit = event.target.querySelector('button[type="submit"]');
    if (btnSubmit) {
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '✓ Adicionado ao Carrinho!';
      btnSubmit.style.background = '#4cd137';
      btnSubmit.disabled = true;
      setTimeout(() => {
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.style.background = '';
        btnSubmit.disabled = false;
      }, 2000);
    }
  
    // Limpar observações
    if (observacoesField) {
      observacoesField.value = '';
    }
  }
  
  // Inicializar quando a página carregar
  document.addEventListener('DOMContentLoaded', function() {
    atualizarBadge();
    
    // Atualizar a cada 2 segundos (caso mude em outra aba)
    setInterval(atualizarBadge, 2000);
    
    // Adicionar validação em tempo real para quantidade
    const inputQuantidade = document.getElementById('quantidade');
    if (inputQuantidade) {
      inputQuantidade.addEventListener('input', function() {
        const valor = parseInt(this.value);
        const tamanhoSelect = document.getElementById('tamanho');
        
        // Se não tiver select de tamanho (produto unitário), limitar a 50
        if (!tamanhoSelect && valor > 50) {
          this.value = 50;
          mostrarNotificacao('Quantidade máxima: 50 unidades', 'info');
        }
        if (valor < 1) {
          this.value = 1;
        }
      });
    }
  });