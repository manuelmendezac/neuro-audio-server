const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 5000;
const VOICE_ID = 'aAtR3uAVlEaQIWGd9EDO'; // voz pro
const XI_API_KEY = process.env.XI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/generarAudio', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'El campo nombre es requerido' });
  }

  const texto = `Bienvenido, ${nombre} AI. Hoy es un gran día para crear lo imposible. ${new Date().toLocaleDateString('es-ES', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})}. Bienvenido a tu portal de inteligencia aumentada. Explora tu Segundo Cerebro. Personaliza tu clon en el Centro de Entrenamiento. Activa el modo Focus. Conecta tu clon fuera de la plataforma. Consulta tu Dashboard. ¡Estás listo para comenzar!`;


  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': XI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texto,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: error.detail || 'Error generando audio' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="bienvenida.mp3"');
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error conectando con ElevenLabs' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
