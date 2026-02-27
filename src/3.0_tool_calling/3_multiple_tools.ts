import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import "dotenv/config";

const model = google("gemini-2.5-flash");

// Tool 1: Get current weather
const getWeather = tool({
  description: "Get current weather conditions for a city",
  inputSchema: z.object({  // Changed from 'parameters' to 'inputSchema'
    city: z.string().describe('The city name, e.g. "Paris"'),
    country: z.string().describe("Country code, e.g. US, FR, JP"),
  }),
  execute: async ({ city, country }) => {
    // Simulate API call
    return {
      temperature: 20,
      conditions: "sunny",
      city: city,
      country: country,
    };
  },
});

// Tool 2: Search restaurants
const searchRestaurants = tool({
  description: "Search for restaurants in a specific location",
  inputSchema: z.object({  // Changed from 'parameters' to 'inputSchema'
    location: z.string().describe("City or neighbourhood"),
    cuisine: z.string().optional().describe("Type of cuisine to filter by"),
    priceRange: z
      .enum(["$", "$$", "$$$", "$$$$"])
      .optional()
      .describe("Price range"),
  }),
  execute: async ({ location, cuisine, priceRange }) => {
    // Simulate restaurant search
    return [
      {
        name: "Le Bistro",
        cuisine: "French",
        price: "$$$",
        rating: 4.5,
      },
      {
        name: "Pizza Palace",
        cuisine: "Italian",
        price: "$$",
        rating: 4.2,
      },
    ];
  },
});

// Tool 3: Get traffic
const getTraffic = tool({
  description: "Get current traffic conditions for a route",
  inputSchema: z.object({  // Changed from 'parameters' to 'inputSchema'
    from: z.string().describe("Starting location"),
    to: z.string().describe("Destination"),
  }),
  execute: async ({ from, to }) => {
    // Simulate traffic API
    return {
      duration: "25 minutes",
      traffic: "Light traffic",
      route: `${from} to ${to}`,
    };
  },
});

async function planEvening() {
  const result = await generateText({
    model: model,
    tools: {
      getWeather,
      searchRestaurants,
      getTraffic,
    },
    prompt:
      "I want to have dinner in downtown Paris tonight. What restaurants do you recommend, what's the weather like, and how long will it take to get there from the Eiffel Tower?",
  });

console.log("loading...");
  console.log(result.content);
  console.log(result.response);

}

planEvening().catch(console.error);