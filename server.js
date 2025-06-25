require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: 'Xabar yo‘q' });

  try {
    console.log("API KEY:", process.env.OPENAI_API_KEY); // tekshirish
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const data = await openaiRes.json();
    console.log("AI javobi:", data); // javobni ko‘rish

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "AI'dan javob kelmadi." });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("Serverda xatolik:", err);
    res.status(500).json({ error: "AI bilan bog‘lanishda xatolik yuz berdi." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server http://localhost:${PORT} da ishlayapti`);
});
