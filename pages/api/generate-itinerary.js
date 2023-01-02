import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    const {days, budget, destination, interests, travellertype, transportation, refinement} = req.body; 
    const prompt = generatePrompt (days, budget, destination, interests, travellertype, transportation, refinement);
    
    console.log(prompt);

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 200,
    });

    res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(days, budget, destination, interests, travellertype, transportation, refinement) {
  return `suggest a detailed day by day itinerary with destination names for a ${days} days trip to ${destination}. budget is ${budget}. prefer travelling by ${transportation}. Travellers is a ${travellertype}. Interests of ${interests}. Additionally, ${refinement}`;
}
