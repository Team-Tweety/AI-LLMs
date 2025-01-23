import dotenv from 'dotenv';
import OpenAI from 'openai';

//initialize openAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const queryOpenAIChat = async (req, res, next) => {
  const { userQuery } = res.locals;
  //data validation - is this being passed to AI
  if (!userQuery) {
    const error = {
      log: 'queryOpenAIChat did not receive a query',
      status: 500,
      message: { err: 'An error occured before querying OpenAI' },
    };
    return next(error);
  }
  try {
    const prompt = 'Placeholder for prompt';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'developer',
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${userQuery}`,
            },
          ],
        },
      ],
      store: true,
      temperature: 0.7,
      max_tokens: 500,
    });
    //what we are receiving back from OpenAI
    const script = completion.choices[0].message.content;

    // Error handling for no response from OpenAI
    if (!script) {
      const error = {
        log: 'OpenAI did not return a completion',
        status: 500,
        message: { err: 'An error occured while querying OpenAI' },
      };
      return next(error);
    }

    res.locals.generatedScript = script;
    return next();
  } catch (err) {
    const error = {
      log: 'queryOpenAI: Error: OpenAI error' + err,
      status: 500,
      message: { err: 'An error occurred while querying OpenAI' },
    };
    return next(error);
  }
};
