const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post("/generate", async (req, res) => {
    try {

        const { prompt } = req.body;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a coding assistant.",
                },
                {
                    role: "user",
                    content: "Generate only clean source code. Do not include explanations or markdown. User request: " + prompt,
                },
            ],
            model: "llama-3.1-8b-instant",
        });
        res.json({
    result: completion.choices[0].message.content.replace(/```html|```css|```javascript|```js|```/g, ""),
});
    } catch (error) {

        console.log(error);

        res.status(500).json({
            result: "Error generating code",
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});