module.exports = async function(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { message, imageBase64, mimeType } = req.body;

    const keys = [
        process.env.GEMINI_KEY_1, process.env.GEMINI_KEY_2, process.env.GEMINI_KEY_3,
        process.env.GEMINI_KEY_4, process.env.GEMINI_KEY_5, process.env.GEMINI_KEY_6,
        process.env.GEMINI_KEY_7, process.env.GEMINI_KEY_8, process.env.GEMINI_KEY_9,
        process.env.GEMINI_KEY_10, process.env.GEMINI_KEY_11, process.env.GEMINI_KEY_12,
        process.env.GEMINI_KEY_13, process.env.GEMINI_KEY_14, process.env.GEMINI_KEY_15
    ].filter(Boolean); 

    if (keys.length === 0) {
        return res.status(500).json({ error: { message: "API Keys are missing in Vercel backend!" } });
    }

    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    let apiPayload = { parts: [{ text: message }] };
    
    if (imageBase64) {
        apiPayload.parts.push({
            inlineData: { mimeType: mimeType, data: imageBase64 }
        });
    }

    // EXACT MODEL NAME FIX: Sirf "gemini-1.5-flash"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${randomKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [apiPayload] })
        });
        
        const data = await response.json();
        res.status(200).json(data); 
        
    } catch (error) {
        res.status(500).json({ error: { message: "Backend failed to contact Gemini" } });
    }
};
