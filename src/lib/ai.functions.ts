import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const DISCLAIMER_FREE = "Do not add any disclaimer; the app already shows one.";

async function run(system: string, prompt: string) {
  const { createLovableResponsesProvider, REASONING_OPTIONS, MODEL } = await import(
    "./ai.server"
  );
  const lovable = createLovableResponsesProvider();

  const result = streamText({
    model: lovable.responses(MODEL),
    system,
    prompt,
    providerOptions: { openai: { ...REASONING_OPTIONS.openai } },
  });

  const text = await result.text;
  if (!text.trim()) throw new Error("The AI returned an empty response. Please try again.");
  return text.trim();
}

const EmailInput = z.object({
  recipient: z.string().min(1),
  subject: z.string().min(1),
  keyPoints: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const text = await run(
      `You are an expert workplace communication assistant. Write complete, ready-to-send business emails in plain text.
Rules:
- Match the requested tone exactly.
- Cover every key point the user lists, naturally and concisely.
- Output only: "Subject: ..." on the first line, then a blank line, then the email body with greeting and sign-off.
- Use [Your Name] where the sender's name is unknown.
- ${DISCLAIMER_FREE}`,
      `Recipient / context: ${data.recipient}
Subject: ${data.subject}
Tone: ${data.tone}
Key points to cover:
${data.keyPoints}`,
    );
    return { text };
  });

const ResearchInput = z.object({
  topic: z.string().optional().default(""),
  content: z.string().optional().default(""),
  url: z.string().optional().default(""),
});

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = ResearchInput.parse(input);
    if (!parsed.topic.trim() && !parsed.content.trim() && !parsed.url.trim()) {
      throw new Error("Provide a topic, some text, or a URL.");
    }
    return parsed;
  })
  .handler(async ({ data }) => {
    const parts: string[] = [];
    if (data.topic.trim()) parts.push(`Research topic: ${data.topic.trim()}`);
    if (data.url.trim()) parts.push(`Source URL provided by the user: ${data.url.trim()}`);
    if (data.content.trim())
      parts.push(`Source text provided by the user:\n"""\n${data.content.trim().slice(0, 20000)}\n"""`);

    const text = await run(
      `You are a senior workplace research analyst. Analyse exactly what the user provides and produce a specific, non-generic briefing.
Format the answer in markdown-style plain text with these three sections, in this order:
## Summary
## Key Insights (bulleted)
## Recommendations (bulleted, actionable)
Rules:
- Ground everything in the user's actual topic/text. Never invent statistics.
- If only a URL is given and you cannot open it, reason from the topic implied by the URL and clearly note that the page content was not read.
- ${DISCLAIMER_FREE}`,
      parts.join("\n\n"),
    );
    return { text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const transcript = data.messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const text = await run(
      `You are an AI workplace productivity assistant for professionals. You help with communication, meetings, planning, prioritisation, documents, career and team topics.
Rules:
- Be concise, practical and professional. Use short paragraphs or bullets.
- Ask a clarifying question when the request is ambiguous.
- Politely redirect clearly non-workplace requests.
- ${DISCLAIMER_FREE}`,
      `Conversation so far:\n\n${transcript}\n\nAssistant:`,
    );
    return { text };
  });
