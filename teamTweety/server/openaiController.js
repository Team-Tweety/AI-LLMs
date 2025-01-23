import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '' });

//initialize openAI client
const openai = new OpenAI({
  apiKey: (HARDCODE)
});

const queryOpenAIChat = async (req, res, next) => {
  try {
    const { userQuery } = req.body;
    console.log('Received query:', userQuery);

    if (!userQuery) {
      return res.status(400).json({ error: 'No query provided' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: userQuery
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    const script = response.choices[0].message.content;
    res.locals.generatedScript = script;
    return next();

  } catch (err) {
    console.error('OpenAI Error:', err);
    return res.status(500).json({ 
      error: 'Error processing OpenAI request',
      details: err.message 
    });
  }
};

export default queryOpenAIChat;
