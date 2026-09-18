import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, RefreshCw, SendHorizonal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Thinking } from "@/components/AiOutput";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatReply } from "@/lib/ai.functions";
import { useSessionActivity } from "@/lib/session-activity";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Ask anything about meetings, priorities, communication or team work and get practical AI guidance.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "A live AI assistant for everyday workplace questions and tasks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Help me plan an agenda for a 30-minute team stand-up.",
  "How do I politely push back on an unrealistic deadline?",
  "Summarise these meeting notes into action items.",
  "Suggest a weekly routine to protect deep-work time.",
];

function ChatPage() {
  const call = useServerFn(chatReply);
  const { logActivity } = useSessionActivity();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(history: Msg[]) {
    setLoading(true);
    try {
      const res = await call({ data: { messages: history } });
      setMessages([...history, { role: "assistant", content: res.text }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The AI request failed. Try again.");
      setMessages(history);
    } finally {
      setLoading(false);
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    logActivity("Chatbot", trimmed.slice(0, 60));
    void ask(next);
  }

  function regenerate() {
    const lastUser = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUser === -1) return;
    const cutoff = messages.length - lastUser;
    void ask(messages.slice(0, cutoff));
  }

  return (
    <AppLayout
      title="AI Workplace Chatbot"
      description="Ask workplace questions or give instructions — every answer is generated live."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="min-h-[45vh] space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-6">
          {messages.length === 0 && !loading && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start with one of these, or ask your own question.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border/60 bg-card/60 p-3 text-left text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-muted/60">
                {m.role === "user" ? (
                  <User className="size-3.5 text-muted-foreground" />
                ) : (
                  <Bot className="size-3.5 text-primary" />
                )}
              </div>
              {m.role === "user" ? (
                <p className="rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {m.content}
                </p>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {m.content}
                </p>
              )}
            </div>
          ))}

          {loading && <Thinking />}
          <div ref={endRef} />
        </div>

        <div className="space-y-2 rounded-2xl border border-border/60 bg-card/60 p-3">
          <Textarea
            ref={inputRef}
            rows={3}
            value={input}
            placeholder="Ask about meetings, priorities, communication, planning..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            className="resize-none border-0 bg-transparent focus-visible:ring-0"
          />
          <div className="flex justify-end gap-2">
            {messages.some((m) => m.role === "assistant") && (
              <Button variant="outline" size="sm" onClick={regenerate} disabled={loading}>
                <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
                Regenerate
              </Button>
            )}
            <Button size="sm" onClick={() => send(input)} disabled={loading || !input.trim()}>
              <SendHorizonal className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
