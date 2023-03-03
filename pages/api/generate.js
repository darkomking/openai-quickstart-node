import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const vocabularyWord =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest a textual mnemonic device in English for the Korean word. 

Korean: 노래하다
Mnemonic: **No, Ray** can _sing_ very well actually 
Korean: 예쁘다
Mnemonic: **Yep** I'm _pretty_.
Korean: 것
Mnemonic: I just **got** this _thing_.	
Korean: 집
Mnemonic: A **Jeep** parked out in front of your _house_ is a must.
Korean: 마시다
Mnemonic: Get something out of the _drink_ **machi**ne.	
Korean: 하다
Mnemonic: **Ha**! I _did_ it!
Korean: ${vocabularyWord}
Mnemonic:`;
}