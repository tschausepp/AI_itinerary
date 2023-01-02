import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [days, setDays] = useState('1');
  const [budget, setBudget] = useState('Medium');
  const [destination, setDestination] = useState('World');
  const [interests, setInterests] = useState('Sports');
  const [travellertype, setTravellertype] = useState('Couple');
  const [transportation, setTransportation] = useState('Public Transportation');
  const [refinement, setRefinement] = useState('None');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
     event.preventDefault();

    if(loading) {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({ days, budget, destination, interests, travellertype, transportation, refinement }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.replaceAll("\n", "<br />"));
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert('Failed to generate your itinerary. Please try again later');
    }
    setLoading(false);
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>AI itinerary</h3>
        <form onSubmit={onSubmit}>
          <label>Days</label>
          <input
            type="number"
            min={1}
            max={99}
            name="Days"
            placeholder="Enter the days"
            value={days}
            onChange={(e) => setDays(Number.parseInt(e.target.value))}
          />
          <label>Budget</label>
          <select
            name="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            >
              <option value="luxury">Luxury</option>
              <option value="medium">Medium</option>
              <option value="budget">Budget</option>
            </select>

          <label>Destination</label>
          <input
            type="text"
            name="Destination"
            placeholder="Where do you want to go? (Seperate with ,)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <label>Travellers</label>
          <select
            name="Travellertype"
            value={travellertype}
            onChange={(e) => setTravellertype(e.target.value)}
            >
              <option value="couple">Couple</option>
              <option value="family with small children">Family with small Children</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="solo">Solo</option>
            </select>

          <label>Interests</label>
          <input
            type="text"
            name="Interests"
            placeholder="What do you want to do? (Seperate with ,)"
            value={destination}
            onChange={(e) => setInterests(e.target.value)}
          />

          <label>Transportation</label>
          <select
            name="Transportation"
            value={transportation}
            onChange={(e) => setTransportation(e.target.value)}
            >
              <option value="public transport">Public Transport</option>
              <option value="rental car">Rental Car</option>
            </select>
            
          <label>Refinement</label>
          <input
            type="text"
            name="Refinement"
            placeholder="Anything to consider when planing a trip? (Seperate with ,)"
            value={refinement}
            onChange={(e) => setRefinement(e.target.value)}
          />

          <input type="submit" value="Generate names" />
        </form>

        {loading && (
          <div>
            <h3>Creating your customzied itinerary with AI 💡</h3>
            <img src="/loading.gif" className={styles.loading} />
          </div>
        )}
      {result && (
        <div 
          className={styles.result} 
          dangerouslySetInnerHTML={{__html: result}}
        />
        )}
      </main>
    </div>
  );
}
