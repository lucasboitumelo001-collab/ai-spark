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
import { generateResearch } from "@/lib/ai.functions";
import { useSessionActivity } from "@/lib/session-activity";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a topic, pasted article or URL into a summary, key insights and actionable recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Summaries, insights and recommendations generated from your own material.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const call = useServerFn(generateResearch);
  const { logActivity } = useSessionActivity();

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!topic.trim() && !content.trim() && !url.trim()) {
      toast.error("Add a topic, paste some text, or provide a URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await call({ data: { topic, content, url } });
      setOutput(res.text);
      logActivity("Research", topic.trim() || url.trim() || "Pasted text analysis");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The AI request failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout
      title="AI Research Assistant"
      description="Analyse a topic, an article or a link and get a structured briefing."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-5 rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Research topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Hybrid work policies for mid-size teams"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Source URL (optional)</Label>
            <Input
              id="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Article or text to analyse (optional)</Label>
            <Textarea
              id="content"
              rows={10}
              placeholder="Paste the content you want summarised..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={generate} disabled={loading}>
            {loading ? "Analysing..." : "Analyse with AI"}
          </Button>
        </section>

        <section className="space-y-3 rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Briefing
          </h2>
          {loading && <Thinking label="AI is analysing your material..." />}
          {!loading && !output && (
            <p className="text-sm text-muted-foreground">
              You&apos;ll get a summary, key insights and recommendations here — editable and
              copyable.
            </p>
          )}
          {output && (
            <AiOutput
              value={output}
              onChange={setOutput}
              onRegenerate={generate}
              loading={loading}
              rows={20}
            />
          )}
        </section>
      </div>
    </AppLayout>
  );
}
