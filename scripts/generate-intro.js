import fs from 'fs';

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // grab one from elevenlabs.io/app/voice-library
const TEXT = `Hi, I'm Abdul Maajid — a CS student from Chennai, somewhere between
coursework and the real thing. Most of what I know came from meetups, hackathons,
and late nights reading other people's code.`;

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
  method: 'POST',
  headers: {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: TEXT,
    model_id: 'eleven_multilingual_v2',
    voice_settings: { stability: 0.4, similarity_boost: 0.8 }
  })
});

fs.writeFileSync('static/intro.mp3', Buffer.from(await res.arrayBuffer()));
console.log('Saved static/intro.mp3');