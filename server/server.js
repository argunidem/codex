import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt =
      req.body.prompt +
      'You are going to act like a programming generator. You can only answer with code snippets.If it is not possible to answer with some code snippets then print "I am sorry but I can not anwser this question" ';
    // ' if the expression is not related to programming answer "I am sorry but I can only anwser questions related to programming"';

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log('Server is running on port http://localhost:5000')
);
