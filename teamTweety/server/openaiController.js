import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '' });
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

//initialize openAI client
const openai = new OpenAI({
  apiKey:
});

const queryOpenAIChat = async (req, res, next) => {
  // const { userQuery } = res.locals;
  const { userQuery } = req.body;
  console.log('Received body:', JSON.stringify(req.body, null, 2));
  // console.log(userQuery);

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

    // const response =
    await openai.chat.completions.create({
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
    // res.status(200).json({ generatedScript: script });
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

export default queryOpenAIChat;
