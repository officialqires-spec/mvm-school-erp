export default async function handler(req, res) {
    // 1. Agar request POST nahi hai, toh reject kar do
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { message, imageBase64, mimeType } = req.body;

    // 2. Vercel ki tijori (Environment Variables) se tumhari 15 keys nikalenge
    const keys = [
        process.env.GEMINI_KEY_1, process.env.GEMINI_KEY_2, process.env.GEMINI_KEY_3,
        process.env.GEMINI_KEY_4, process.env.GEMINI_KEY_5, process.env.GEMINI_KEY_6,
        process.env.GEMINI_KEY_7, process.env.GEMINI_KEY_8, process.env.GEMINI_KEY_9,
        process.env.GEMINI_KEY_10, process.env.GEMINI_KEY_11, process.env.GEMINI_KEY_12,
        process.env.GEMINI_KEY_13, process.env.GEMINI_KEY_14, process.env.GEMINI_KEY_15
    ].filter(Boolean); // Jo key Vercel me set hogi sirf wahi list me aayegi

    if (keys.length === 0) {
        return res.status(500).json({ error: "API Keys are missing in backend!" });
    }

    // 3. Randomly ek key pick karenge (Limit bypass karne ki master trick)
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    // 4. Gemini ko bhejne ke liye payload taiyar karenge
    let apiPayload = { parts: [{ text: message }] };
    
    if (imageBase64) {
        apiPayload.parts.push({
            inlineData: { mimeType: mimeType, data: imageBase64 }
        });
    }

    // 1.5-flash fast aur API quotas ke liye zyada stable hai
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${randomKey}`;

    try {
        // 5. Gemini se baat karo
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [apiPayload] })
        });
        
        const data = await response.json();
        res.status(200).json(data); // Answer Frontend ko bhej do
        
    } catch (error) {
        res.status(500).json({ error: "Backend failed to contact Gemini" });
    }
}
