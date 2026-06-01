// ============================================
// ASSISTENTE IA — ERP INDUSTRIAL
// Adaptado de NazcaGestão
// ============================================

const AssistantState = {
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  recognition: null,
  synthesis: window.speechSynthesis,
  pendingAction: null,
  conversationContext: [],
  lastQuery: null
};

const ASSISTANT_CONFIG = {
  language: 'pt-BR',
  voiceRate: 1.0,
  voicePitch: 1.0,
  maxContextMessages: 10,
  confirmDestructiveActions: true
};

// ============================================
// TOGGLE DO CHATBOT
// ============================================

function toggleChatBot() {
  const container = document.getElementById('chatbot-container');
  if (!container) return;
  container.classList.toggle('minimized');
}

// ============================================
// RECONHECIMENTO DE VOZ
// ============================================

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech Recognition não suportado neste navegador');
    document.getElementById('voice-btn')?.classList.add('disabled');
    return null;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = ASSISTANT_CONFIG.language;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => { AssistantState.isListening = true; updateVoiceUI('listening'); };
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
    const isFinal = event.results[event.results.length - 1].isFinal;
    if (isFinal) processVoiceCommand(transcript);
    else showTranscriptPreview(transcript);
  };
  recognition.onerror = (event) => {
    AssistantState.isListening = false;
    updateVoiceUI('idle');
    if (event.error === 'not-allowed') addAssistantMessage('⚠️ Permissão de microfone negada. Permita o acesso nas configurações do navegador.', 'warning');
    else if (event.error === 'no-speech') addAssistantMessage('Não ouvi nada. Pode repetir?', 'info');
  };
  recognition.onend = () => { AssistantState.isListening = false; if (!AssistantState.isProcessing) updateVoiceUI('idle'); };
  return recognition;
}

function toggleVoiceRecognition() {
  if (!AssistantState.recognition) AssistantState.recognition = initSpeechRecognition();
  if (!AssistantState.recognition) { showToastERP('Reconhecimento de voz não suportado', 'error'); return; }
  if (AssistantState.isListening) AssistantState.recognition.stop();
  else {
    if (AssistantState.isSpeaking) AssistantState.synthesis.cancel();
    try { AssistantState.recognition.start(); } catch (e) { console.error('Erro ao iniciar reconhecimento:', e); }
  }
}

function updateVoiceUI(state) {
  const voiceBtn = document.getElementById('voice-btn');
  const micIcon = document.getElementById('mic-icon');
  const voiceStatus = document.getElementById('voice-status');
  voiceBtn?.classList.remove('listening', 'processing', 'speaking');
  switch (state) {
    case 'listening':
      voiceBtn?.classList.add('listening');
      if (micIcon) micIcon.className = 'fa-solid fa-microphone';
      if (voiceStatus) { voiceStatus.textContent = '● Ouvindo...'; voiceStatus.className = 'voice-status listening'; }
      break;
    case 'processing':
      voiceBtn?.classList.add('processing');
      if (micIcon) micIcon.className = 'fa-solid fa-spinner';
      if (voiceStatus) { voiceStatus.textContent = '⟳ Processando...'; voiceStatus.className = 'voice-status processing'; }
      break;
    case 'speaking':
      voiceBtn?.classList.add('speaking');
      if (micIcon) micIcon.className = 'fa-solid fa-volume-high';
      if (voiceStatus) { voiceStatus.textContent = '🔊 Falando...'; voiceStatus.className = 'voice-status speaking'; }
      break;
    default:
      if (micIcon) micIcon.className = 'fa-solid fa-microphone';
      if (voiceStatus) { voiceStatus.textContent = ''; voiceStatus.className = 'voice-status'; }
  }
}

function showTranscriptPreview(text) {
  let preview = document.getElementById('transcript-preview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'transcript-preview';
    preview.className = 'transcript-preview';
    const inputArea = document.querySelector('.chatbot-input-area');
    inputArea?.parentNode.insertBefore(preview, inputArea);
  }
  preview.textContent = `"${text}..."`;
}

function clearTranscriptPreview() {
  document.getElementById('transcript-preview')?.remove();
}

// ============================================
// SÍNTESE DE VOZ
// ============================================

function speak(text, callback) {
  const voiceEnabled = document.getElementById('voice-response-toggle')?.checked ?? true;
  if (!voiceEnabled || !AssistantState.synthesis) { callback?.(); return; }
  const cleanText = text.replace(/[*_#`]/g, '').replace(/:\w+:/g, '').replace(/[📦🔧📋✅🛒🏭🎓👋●⟳🔊⚠️❌]/g, '').trim();
  if (!cleanText) { callback?.(); return; }
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = ASSISTANT_CONFIG.language;
  utterance.rate = ASSISTANT_CONFIG.voiceRate;
  utterance.pitch = ASSISTANT_CONFIG.voicePitch;
  const voices = AssistantState.synthesis.getVoices();
  const ptVoice = voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utterance.voice = ptVoice;
  utterance.onstart = () => { AssistantState.isSpeaking = true; updateVoiceUI('speaking'); };
  utterance.onend = () => { AssistantState.isSpeaking = false; updateVoiceUI('idle'); callback?.(); };
  utterance.onerror = () => { AssistantState.isSpeaking = false; updateVoiceUI('idle'); callback?.(); };
  AssistantState.synthesis.speak(utterance);
}

// ============================================
// PROCESSAMENTO DE COMANDOS
// ============================================

function processVoiceCommand(transcript) {
  clearTranscriptPreview();
  AssistantState.isProcessing = true;
  updateVoiceUI('processing');
  addUserMessage(transcript);
  setTimeout(() => {
    const response = interpretCommand(transcript);
    AssistantState.isProcessing = false;
    addAssistantMessage(response.message, response.type);
    if (response.action) executeAction(response.action);
    speak(response.message);
  }, 300);
}

function interpretCommand(input) {
  const text = input.toLowerCase().trim();

  // Ajuda
  if (matches(text, ['ajuda', 'help', 'comandos', 'o que você pode fazer', 'como usar'])) return getHelp();

  // Módulos / navegação
  if (matches(text, ['estoque', 'inventário', 'materiais'])) return goModulo('estoque', '📦 Abrindo módulo de Estoque...');
  if (matches(text, ['manutenção', 'máquinas', 'preventiva'])) return goModulo('manutencao', '🔧 Abrindo módulo de Manutenção...');
  if (matches(text, ['rh', 'ponto', 'jornada', 'funcionários', 'recursos humanos'])) return goModulo('ponto', '🧑‍💼 Abrindo módulo de RH...');
  if (matches(text, ['ordens', 'pedidos', 'produção', 'kanban'])) return goOrdens();
  if (matches(text, ['qualidade', 'inspeção', 'conformidade'])) return goModulo('qualidade', '✅ Abrindo módulo de Qualidade...');
  if (matches(text, ['suprimentos', 'compras', 'fornecedores'])) return goModulo('suprimentos', '🛒 Abrindo módulo de Suprimentos...');
  if (matches(text, ['linha de produção', 'monitoramento', 'industrial'])) return goModulo('producao', '🏭 Abrindo módulo de Produção...');
  if (matches(text, ['treinamento', 'capacitação', 'cursos'])) return goModulo('treinamento', '🎓 Abrindo módulo de Treinamentos...');
  if (matches(text, ['dashboard', 'início', 'home', 'painel', 'voltar'])) return goHome();

  // Ordens — perguntas
  if (matches(text, ['quantas ordens', 'total de ordens', 'listar ordens', 'ver ordens', 'ordens pendentes', 'ordens abertas'])) return queryOrdens(text);

  // Usuário
  if (matches(text, ['quem está logado', 'meu usuário', 'meu nome', 'quem sou'])) return getUsuario();

  // Tema
  if (matches(text, ['modo escuro', 'dark mode', 'tema escuro'])) return setTema('dark');
  if (matches(text, ['modo claro', 'light mode', 'tema claro'])) return setTema('light');

  // Sair
  if (matches(text, ['sair', 'logout', 'deslogar', 'encerrar sessão'])) return doLogout();

  // Confirmação de ação pendente
  if (AssistantState.pendingAction) {
    if (matches(text, ['sim', 'confirmar', 'pode', 'ok', 'confirmo', 'positivo'])) return executePendingAction();
    if (matches(text, ['não', 'cancelar', 'cancela', 'negativo', 'pare'])) return cancelPendingAction();
  }

  return {
    message: `Não entendi "${input}". Tente comandos como:\n• "Abrir Estoque"\n• "Ver Ordens de Serviço"\n• "Ir para Dashboard"\n• "Modo escuro"\n\nDiga "ajuda" para ver todos os comandos.`,
    type: 'info'
  };
}

// ============================================
// AÇÕES DO ERP
// ============================================

function goModulo(modulo, msg) {
  return {
    message: msg,
    type: 'query',
    action: { type: 'abrirModulo', data: { modulo } }
  };
}

function goOrdens() {
  return {
    message: '📋 Abrindo módulo de Ordens de Serviço...',
    type: 'query',
    action: { type: 'navegarURL', data: { url: '/app/modules/ordens_pedido/ordens.html' } }
  };
}

function goHome() {
  return {
    message: '🏠 Voltando ao Dashboard...',
    type: 'query',
    action: { type: 'navegarURL', data: { url: '/app/app.html' } }
  };
}

function queryOrdens(text) {
  const ordens = JSON.parse(localStorage.getItem('ordensERP') || '[]');
  if (!ordens.length) return { message: '📋 Nenhuma ordem cadastrada ainda. Acesse o módulo de Ordens para criar.', type: 'info' };

  const abertas    = ordens.filter(o => o.status === 'Aberto' || o.status === 'aberto').length;
  const emAndamento = ordens.filter(o => o.status === 'Em andamento' || o.status === 'em_andamento').length;
  const concluidas = ordens.filter(o => o.status === 'Concluído' || o.status === 'concluido').length;

  return {
    message: `📋 **Ordens de Serviço**\n\n• Total: ${ordens.length}\n• Abertas: ${abertas}\n• Em andamento: ${emAndamento}\n• Concluídas: ${concluidas}\n\nDiga "abrir ordens" para gerenciar.`,
    type: 'query'
  };
}

function getUsuario() {
  const usuario = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado') || 'Usuário';
  return { message: `👤 Você está logado como **${usuario}**.`, type: 'query' };
}

function setTema(modo) {
  const isDark = modo === 'dark';
  AssistantState.pendingAction = { type: 'tema', data: { isDark } };
  return {
    message: `Quer ativar o **modo ${isDark ? 'escuro' : 'claro'}**? (Sim/Não)`,
    type: 'update'
  };
}

function doLogout() {
  AssistantState.pendingAction = { type: 'logout', data: {} };
  return { message: 'Quer mesmo **sair** do sistema? (Sim/Não)', type: 'delete' };
}

function executeAction(action) {
  switch (action.type) {
    case 'abrirModulo':
      if (typeof abrirModulo === 'function') abrirModulo(action.data.modulo);
      break;
    case 'navegarURL':
      window.location.href = action.data.url;
      break;
  }
}

function executePendingAction() {
  const action = AssistantState.pendingAction;
  AssistantState.pendingAction = null;
  if (!action) return { message: 'Nenhuma ação pendente.', type: 'info' };

  switch (action.type) {
    case 'tema':
      const toggle = document.getElementById('theme-toggle');
      if (toggle) { toggle.checked = action.data.isDark; if (typeof alternarTema === 'function') alternarTema(); }
      return { message: `✅ Modo ${action.data.isDark ? 'escuro' : 'claro'} ativado!`, type: 'success' };
    case 'logout':
      if (typeof logout === 'function') logout();
      else window.location.href = '/public/pages/login.html';
      return { message: '✅ Saindo...', type: 'success' };
    default:
      return { message: 'Ação não reconhecida.', type: 'error' };
  }
}

function cancelPendingAction() {
  AssistantState.pendingAction = null;
  return { message: '❌ Ação cancelada.', type: 'info' };
}

// ============================================
// AJUDA
// ============================================

function getHelp() {
  return {
    message: `🤖 **Comandos disponíveis:**\n\n**Módulos:**\n• "Abrir Estoque"\n• "Abrir Manutenção"\n• "Abrir RH"\n• "Ver Ordens de Serviço"\n• "Abrir Qualidade"\n• "Abrir Suprimentos"\n• "Linha de Produção"\n• "Treinamentos"\n• "Voltar ao Dashboard"\n\n**Consultas:**\n• "Quantas ordens pendentes?"\n• "Quem está logado?"\n\n**Ações:**\n• "Modo escuro / Modo claro"\n• "Sair do sistema"`,
    type: 'info'
  };
}

// ============================================
// UI DO CHAT
// ============================================

function addUserMessage(text) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;
  const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  container.insertAdjacentHTML('beforeend', `
    <div class="message-group user-msg">
      <div class="message-bubble">${escapeHtmlChat(text)}</div>
      <span class="message-time">${time}</span>
    </div>
  `);
  container.scrollTop = container.scrollHeight;
}

function addAssistantMessage(text, type = 'info') {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;
  const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const typeClass = type === 'error' ? 'error-message' : type === 'warning' ? 'warning-message' : (type === 'success' || type === 'create' || type === 'update') ? 'action-message' : '';
  const badgeMap = {
    'query':   '<span class="command-badge query"><i class="fa-solid fa-magnifying-glass"></i> Consulta</span>',
    'create':  '<span class="command-badge create"><i class="fa-solid fa-plus"></i> Criar</span>',
    'update':  '<span class="command-badge update"><i class="fa-solid fa-pen"></i> Editar</span>',
    'delete':  '<span class="command-badge delete"><i class="fa-solid fa-trash"></i> Excluir</span>',
    'success': '<span class="command-badge create"><i class="fa-solid fa-check"></i> Sucesso</span>'
  };
  const badge = badgeMap[type] || '';
  const htmlText = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/• /g, '&bull; ');
  container.insertAdjacentHTML('beforeend', `
    <div class="message-group assistant-msg">
      <div class="message-bubble ${typeClass}">
        ${badge}
        <div>${htmlText}</div>
      </div>
      <span class="message-time">${time}</span>
    </div>
  `);
  container.scrollTop = container.scrollHeight;
}

function escapeHtmlChat(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToastERP(msg, type) {
  console.log(`[${type}] ${msg}`);
}

// ============================================
// ENVIO DE MENSAGEM
// ============================================

window.sendChatMessage = function () {
  const input = document.getElementById('chatbot-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  processVoiceCommand(text);
};

// ============================================
// UTILITÁRIOS
// ============================================

function matches(text, keywords) {
  return keywords.some(k => text.includes(k));
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => console.log('Vozes carregadas:', speechSynthesis.getVoices().length);
  }
  console.log('🤖 Assistente ERP inicializado');
});

window.toggleVoiceRecognition = toggleVoiceRecognition;
window.toggleChatBot = toggleChatBot;
window.AssistantState = AssistantState;
