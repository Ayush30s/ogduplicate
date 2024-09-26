const OpenAI = require("openai");

// Configure OpenAI with your API key
const openai = new OpenAI({
    apiKey: "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",
});

const res = async () => {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": "Eassy on diwali"}],
        max_tokens: 10
    })

    console.log(chatCompletion.choices[0].message);
}

res();