// Função para enviar os dados para o servidor Node.js
async function sendToDiscord(details, state) {
  try {
    await fetch('http://localhost:3000/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ details, state })
    });
  } catch (err) {
    console.log('Servidor local offline ou erro de conexão');
  }
}

// Atualiza a presença quando a aba ativa muda ou a página recarrega
async function updateTabInfo() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
    const urlObj = new URL(tab.url);
    const domain = urlObj.hostname.replace('www.', '');
    const title = tab.title || 'Navegando';

    // Mapeia domínios para as chaves de imagem cadastradas no Dev Portal
    let imageKey = 'default'; // Nome da imagem padrão se o site não estiver na lista
    
    if (domain.includes('youtube.com')) imageKey = 'youtube';
    else if (domain.includes('netflix.com')) imageKey = 'netflix';
    else if (domain.includes('github.com')) imageKey = 'github';
    else if (domain.includes('twitch.tv')) imageKey = 'twitch';

    // Envia os dados com o nome da imagem (largeImageKey)
    sendToDiscord(`Em: ${domain}`, title.substring(0, 128), imageKey, domain);
  }
}

async function sendToDiscord(details, state, largeImageKey, largeImageText) {
  try {
    await fetch('http://localhost:3000/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ details, state, largeImageKey, largeImageText })
    });
  } catch (err) {
    console.log('Servidor local offline');
  }
}

// Detecta troca de aba ativa
chrome.tabs.onActivated.addListener(updateTabInfo);

// Detecta quando a página termina de carregar
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTabInfo();
  }
});