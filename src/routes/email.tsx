import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { AiOutput, Thinking } from "@/components/AiOutput";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";
import { useSessionActivity } from "@/lib/session-activity";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate polished, tone-matched workplace emails from a recipient, subject and key points.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-written professional emails in formal, friendly or persuasive tone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const call = useServerFn(generateEmail);
  const { logActivity } = useSessionActivity();

  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<(typeof tones)[number]>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!recipient.trim() || !subject.trim() || !keyPoints.trim()) {
      toast.error("Please fill in the recipient, subject and key points.");
      return;
    }
    setLoading(true);
    try {
      const res = await call({ data: { recipient, subject, keyPoints, tone } });
      setOutput(res.text);
      logActivity("Email", `${tone} email — ${subject}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The AI request failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Describe the situation and let AI draft a professional email you can edit and send."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / context</Label>
              <Input
                id="recipient"
                placeholder="e.g. My manager, Thabo, about the delayed Q3 report"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Update on the Q3 report timeline"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={7}
                placeholder={"One point per line, e.g.\n- Report delayed by two days\n- Data source changed\n- New delivery date Friday"}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={tone === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={generate} disabled={loading}>
              {loading ? "Generating..." : "Generate email"}
            </Button>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            AI draft
          </h2>
          {loading && <Thinking />}
          {!loading && !output && (
            <p className="text-sm text-muted-foreground">
              Your generated email will appear here, fully editable.
            </p>
          )}
          {output && (
            <AiOutput value={output} onChange={setOutput} onRegenerate={generate} loading={loading} />
          )}
        </section>
      </div>
    </AppLayout>
  );
}
