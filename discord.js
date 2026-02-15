// api/discord.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;

    const webhookUrl = process.env.DISCORD_WEBHOOK;

    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK не задан в переменных окружения Vercel');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text().catch(() => 'No details');
      console.error(`Discord webhook error: ${discordResponse.status} — ${errorText}`);
      return res.status(502).json({ error: 'Failed to deliver to Discord' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}