import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '' });

//initialize openAI client
const openai = new OpenAI({
  apiKey: HARDCODED_KEY,
});

const queryOpenAIChat = async (req, res, next) => {
  try {
    const { userQuery } = req.body;
    console.log('Received query:', userQuery);

    if (!userQuery) {
      return res.status(400).json({ error: 'No query provided' });
    }

    const prompt = `
      You: You are a drama school teacher and work in the educational system.

      Your Job: Your job is to take a suggestion that a user gives you for a topic and to create an interactive play for understanding that topic meaningfully. 
      The play should elucidate a core idea in the topic in substantive way and should not just be superfluous or silly.

      Some guidelines:
      -Note the language you are using is appropriate for the age group specified. If no age group is specified, use about a middle school vocabulary level. 
      -The number of roles in the play should default to three, unless the user specifies differently. 
      -Keep the play school appropriate and substantive.
      -Do not bold anything or use bullets or dividers or lines. Everything should be in plain markdown text.
      -Ensure the dialogue is short and impactful, helping students learn key concepts in an enjoyable way.


      Example Formatting Guidelines. When giving

      Title: {$Title}
      Description: {One Sentence Description of Play}

      Scene: {$Scene Description}

      Role 1: {Role 1 Name: Description}
      Role 2: {Role 2 Name: Description}
      Etc.

      {$Role 1}: {Lines spoken or enacted}
      {$Role 2}: {Lines spoken or enacted}
      Etc.

      ### Example Input:
      Age Range: 10 years old
      Topic: Basics of Cellular Biology
      Number of Participants: 5

      ### Example Output:
      **Title**: "A Cellular Adventure"
      **Roles**:
      - Nucleus (Student 1)
      - Mitochondria (Student 2)
      - Ribosomes (Student 3)
      - DNA (Student 4)
      - Cell Membrane (Student 5)

      **Script**:
      *Nucleus*: "Hello, team! I'm the Nucleus, the brain of the cell. I control everything happening here and hold all
      the important instructions called DNA!"
      *Mitochondria*: "And I'm Mitochondria! I provide the energy to keep us running. Think of me as the power plant
      of the cell!"
      *Ribosomes*: "I'm Ribosomes, and I make proteins that help us do all sorts of jobs. Without me, the cell wouldn't
      function properly."
      *DNA*: "Hi, I'm DNA, the instructions for everything the cell does. The Nucleus keeps me safe and uses me to tell
      everyone else what to do!"
      *Cell Membrane*: "And, last but not least, I'm the Cell Membrane, the gatekeeper. I decide what comes and goes out
      of our cell. There's no nonsense on my watch!"

      Guiding Questions: {Thought-Provoking Questions a Teacher could use in the classroom}

      Be creative, educational, and engaging! Use age-appropriate (and non-offensive) humor to help draw the students' interest.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message
    ) {
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }

    const script = response.choices[0].message.content;
    res.locals.generatedScript = script;
    return next();
  } catch (err) {
    console.error('OpenAI Error:', err);
    return res.status(500).json({
      error: 'Error processing OpenAI request',
      details: err.message,
    });
  }
};

export default queryOpenAIChat;
