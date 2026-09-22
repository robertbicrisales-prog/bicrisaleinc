// One-off asset generation: writes brand photography into public/img.
// Run with: node scripts/generate-images.mjs
import { GoogleGenAI } from '@google/genai'
import { writeFile } from 'node:fs/promises'

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: { baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, '') },
})

const look =
  'Shot on a full-frame camera with a fast prime lens. Moody editorial magazine photography, ' +
  'warm ink-black shadows, ivory highlights, brass and amber practical lighting, fine film grain, ' +
  'shallow depth of field, no text, no logos, no watermarks, no visible faces looking at camera.'

const jobs = [
  ['hero', `Interior of a dark, intimate fine-dining room at night, marble bar with brass fixtures, low pendant lights, a blurred server crossing frame. ${look} Aspect ratio 3:2, cinematic wide composition with negative space on the left.`],
  ['hospitality', `Overhead detail of a plated hand-rolled pasta dish on dark ceramic, olive oil sheen, a glass of natural wine at the edge of frame, linen napkin. ${look} Aspect ratio 4:5.`],
  ['wellness', `A serene med spa treatment room, travertine walls, single stem of eucalyptus in a ceramic vessel, soft daylight raking across folded towels. ${look} Aspect ratio 4:5.`],
  ['studio-food', `Close-up of a bartender's hands finishing a smoked cocktail with a torched orange peel, embers glowing, dark bar backdrop. ${look} Aspect ratio 1:1.`],
  ['studio-portrait', `Editorial three-quarter profile portrait of a restaurant chef-owner in a dark apron, arms crossed, standing in a dim kitchen pass, rim light from behind. ${look} Aspect ratio 1:1.`],
  ['studio-nightlife', `A crowded upscale nightlife venue from above, bottle sparklers, motion blur of dancing, deep shadows with amber light shafts. ${look} Aspect ratio 1:1.`],
  ['studio-detail', `Macro detail of an embossed brass foil logo blind-debossed into thick cream cotton paper stationery on a dark walnut table, raking light. ${look} Aspect ratio 1:1. Abstract emboss pattern only, absolutely no letters or readable text.`],
  ['studio', `A creative agency studio at dusk: long walnut table strewn with printed brand boards, colour swatches, a camera body and a loupe, two blurred people conferring in the background. ${look} Aspect ratio 3:2.`],
  ['digital', `A matte black smartphone and a thin laptop on a dark stone surface, screens glowing warm amber with abstract blurred interface shapes, brass desk lamp out of focus. ${look} Aspect ratio 3:2. Screens show abstract glowing blocks only, no readable text.`],
]

await Promise.all(
  jobs.map(async ([name, prompt]) => {
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: prompt,
      })
      const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
      if (!part) throw new Error('no image part returned')
      await writeFile(`public/img/${name}.png`, Buffer.from(part.inlineData.data, 'base64'))
      console.log(`ok ${name}`)
    } catch (err) {
      console.log(`FAIL ${name}: ${err.message}`)
    }
  }),
)
