import { GoogleGenerativeAI } from '@google/generative-ai'

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Infers countries for a batch of studio names via Gemini Flash (free tier).
// Returns { studioName: isoAlpha2 | null }
export async function inferStudiosCountries(studioNames) {
  if (!studioNames.length) return {}

  const prompt = `You are a video game industry expert with encyclopedic knowledge of game studios worldwide.

For each studio name below, return its country of origin as an ISO 3166-1 alpha-2 code (e.g. "JP", "US", "GB", "DE").
If you genuinely don't know, return null.

Return ONLY a valid JSON object — no explanation, no markdown:
{ "Studio Name": "XX", ... }

Studios:
${studioNames.map((n) => `- "${n}"`).join('\n')}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const match = text.match(/\{[\s\S]+\}/)
    if (!match) return {}
    return JSON.parse(match[0])
  } catch (err) {
    console.error('Gemini inference error:', err.message)
    return {}
  }
}
