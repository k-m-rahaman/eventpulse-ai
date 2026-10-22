import { EventPlan } from '../types/event';

export interface GeminiConfig {
  apiKey: string;
  useFallbackSimulation: boolean;
}

export const STORAGE_KEY_GEMINI = 'eventpulse_gemini_config';

export function getGeminiConfig(): GeminiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GEMINI);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load Gemini config:', e);
  }
  return {
    apiKey: '',
    useFallbackSimulation: true,
  };
}

export function saveGeminiConfig(config: GeminiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_GEMINI, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Gemini config:', e);
  }
}

/**
 * Calls Gemini API if an API key is configured and fallback is not forced.
 * Returns null if falling back to smart simulation.
 */
export async function callGeminiForCrisisRipple(
  currentPlan: EventPlan,
  prompt: string,
  apiKey: string
): Promise<{ updatedPlan: Partial<EventPlan>; explanation: string } | null> {
  if (!apiKey || apiKey.trim().length < 8) {
    return null;
  }

  const systemPrompt = `You are EventPulse AI, an autonomous agentic event operating system.
Analyze the user's crisis prompt or event change request, and determine how it dynamically ripples across:
1. Budget categories (reallocating funds, overrun risks, savings tips)
2. Day-of and Pre-event Timeline nodes (shifting times, flagging conflicts)
3. Vendor SLA checklists (drafting personalized urgent WhatsApp/email messages)
4. Ideation suggestions

Return a JSON object adhering to this structure:
{
  "explanation": "concise 2-sentence explanation of the ripples caused",
  "budgetImpactSummary": "string summary",
  "timelineImpactSummary": "string summary",
  "vendorImpactSummary": "string summary",
  "weatherCondition": "Sunny & Clear" | "Rain Forecast" | "Overcast" | "Heavy Rain" | "Mild Breeze",
  "budgetCategories": [...updated budget array...],
  "timelineNodes": [...updated timeline nodes...],
  "vendors": [...updated vendors with new lastNoticeGenerated fields...]
}
Respond strictly with valid JSON only. Do not wrap in markdown backticks.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nCURRENT EVENT PLAN:\n${JSON.stringify(
                    currentPlan,
                    null,
                    2
                  )}\n\nUSER PROMPT / CRISIS TRIGGER:\n"${prompt}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 3000,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API call failed with status:', response.status);
      return null;
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) return null;

    // Clean JSON string if enclosed in backticks
    let cleanJson = candidate.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.slice(7);
    }
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.slice(0, -3);
    }

    const parsed = JSON.parse(cleanJson.trim());
    return {
      updatedPlan: parsed,
      explanation: parsed.explanation || 'AI evaluated the situation and propagated ripples across your entire event plan.',
    };
  } catch (err) {
    console.warn('Falling back to local agentic heuristic engine due to API error:', err);
    return null;
  }
}
