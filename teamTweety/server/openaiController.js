import OpenAI from 'openai';
import dotenv from 'dotenv';

//new imports
import fs from 'fs/promises';
import path from 'path';

dotenv.config({ path: '' });

//initialize openAI client
const openai = new OpenAI({
  apiKey: PLACEHOLDER_KEY,
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

      Your Job: Your job is to take a suggestion that a user gives you for a topic and to create an interactive
      play for understanding that topic meaningfully, formatted in precise Markdown using the required Guidelines I give you.
      The play should engage students and elucidate a core idea in the topic in substantive way and should not just
      be superfluous or silly.

      ### Required Formatting Guidelines:
      Format the output using the following Markdown structure exactly:
      - **All section headers (Title, Description, Scene, Roles, Script, and Guiding Questions) must be **bold**,
      using ('**') Markdown syntax.
      - Use italicized text ('_') for the scene description.
      - Use a second-level heading ('##') for roles.
      - Use bold text ('**') for role names, followed by a colon (':'), and then their description.
      - Use standard text for the dialogue under each role, with the character names bolded (e.g., '**Character
      Name**:').
      - Use a numbered list for the guiding questions.

      ### Example Input:
      Age Range: 10 years old
      Topic: Basics of Cellular Biology
      Number of Participants: 5

      ### Example Output:
      **Title**: A Cellular Adventure
      
      **Description**: _An educational journey exploring the components of a cell._

      **Scene**: _The interior of a cell, where its organelles come to life._

      **Roles**:
      - **Nucleus**: The brain of the cell, controlling all functions.
      - **Mitochondria**: The power plant, providing energy for the cell.
      - **Ribosomes**: The protein builders, assembling materials needed for growth.
      - **DNA**: The instructions for everything the cell does.
      - **Cell Membrane**: The gatekeeper, directing the flow of traffic into and out of the cell.

      **Script**:
      
      *Nucleus*: "Hello, team! I'm the Nucleus, the brain of the cell. I control everything happening here and
      hold all the important instructions called DNA!"
      *Mitochondria*: "And I'm Mitochondria! I provide the energy to keep us running. Think of me as the power
      plant of the cell!"
      *Ribosomes*: "I'm Ribosomes, and I make proteins that help us do all sorts of jobs. Without me, the cell
      wouldn't function properly."
      *DNA*: "Hi, I'm DNA, the instructions for everything the cell does. The Nucleus keeps me safe and uses me
      to tell everyone else what to do!"
      *Cell Membrane*: "And, last but not least, I'm the Cell Membrane, the gatekeeper. I decide what comes and
      goes out of our cell. There's no nonsense on my watch!"

      **Guiding Questions**:
      1. What is the role of the nucleus in the cell?
      2. How do mitochondria contribute to the cell's energy?
      3. What are ribosomes responsible for?

      ### Key Guidelines:
      1. All headers must be bold.
      2. Ensure the language and content are age-appropriate for the specified students with respect to grade
      and/or age range. If no age group is specified, default to content and a vocabulary appropriate for 13-year-olds. 
      3. If the number of participants is not specified, default to three roles.
      4. Keep the script brief and impactful to maintain student engagement.
      5. Avoid using dividers or excessive formatting outside the Markdown guidelines specified.
      6. Always format the entire output using Markdown formatting that's ready for rendering on a website or
      a frontend system.

      Be creative, educational, and engaging! Use age-appropriate (and non-offensive) humor to help draw the
      students' interest. Make sure the script aligns with the provided topic and is ready for rendering on the
      frontend.
    `;

    const response = await openai.chat.completions.create({
      model: 'ft:gpt-4o-2024-08-06:personal:tweety-fine-tuning:AtHvrboY',
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

    // Log the paired query and response
    const logEntry = {
      userQuery: userQuery,
      response: script,
    };
    await appendToLog(logEntry);
    return next();
  } catch (err) {
    console.error('OpenAI Error:', err);
    return res.status(500).json({
      error: 'Error processing OpenAI request',
      details: err.message,
    });
  }
};

async function appendToLog(data) {
  const logPath = path.join(process.cwd(), 'server', 'db.jsonl');
  try {
    const logEntry = JSON.stringify(data) + '\n';
    await fs.appendFile(logPath, logEntry, 'utf8');
  } catch (error) {
    console.error('Error writing to log:', error);
  }
}

export default queryOpenAIChat;
