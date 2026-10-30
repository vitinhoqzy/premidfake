const RPC = require('discord-rpc');
const express = require('express');
const cors = require('cors');

const clientId = '1565851479376531478'; // Lembre de manter o seu ID aqui!

const client = new RPC.Client({ transport: 'ipc' });
const app = express();

app.use(cors());
app.use(express.json());

let currentActivity = {
    details: 'Navegando na Web',
    state: 'Extensão conectada',
    startTimestamp: Date.now()
};

async function updatePresence() {
    if (!client) return;

    client.setActivity({
        details: currentActivity.details,
        state: currentActivity.state,
        startTimestamp: currentActivity.startTimestamp,
        instance: false,
    });
}

// Rota que a extensão vai chamar
app.post('/update', (req, res) => {
    const { details, state, largeImageKey, largeImageText } = req.body;
    
    if (details) currentActivity.details = details;
    if (state) currentActivity.state = state;
    if (largeImageKey) currentActivity.largeImageKey = largeImageKey;
    if (largeImageText) currentActivity.largeImageText = largeImageText;
    
    updatePresence();
    res.send({ status: 'ok' });
});

async function updatePresence() {
    if (!client) return;

    client.setActivity({
        details: currentActivity.details,
        state: currentActivity.state,
        startTimestamp: currentActivity.startTimestamp,
        largeImageKey: currentActivity.largeImageKey,
        largeImageText: currentActivity.largeImageText,
        instance: false,
    });
}

client.on('ready', () => {
    console.log('✅ Rich Presence conectado ao Discord!');
    updatePresence();
});

app.listen(3000, () => {
    console.log('🌐 Servidor local rodando na porta 3000');
});

client.login({ clientId }).catch(console.error);