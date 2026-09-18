import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessagesSquare, Search, Sparkle } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { useSessionActivity } from "@/lib/session-activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One workspace for AI-written emails, research briefings and a live workplace chatbot.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "AI email drafting, research briefings and a workplace chatbot in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few key points into a polished email in your chosen tone.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Summarise a topic, article or link into insights and recommendations.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Workplace Chatbot",
    body: "Ask anything about your work day and get practical, live answers.",
  },
] as const;

function Dashboard() {
  const { activities } = useSessionActivity();

  return (
    <AppLayout
      title="Welcome back"
      description="Three AI tools to move through your workday faster."
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card/60 to-card/30 p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            <Sparkle className="size-3.5" />
            Powered by Lovable AI
          </span>
          <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Write, research and decide — with an assistant that drafts in seconds.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Everything is generated live from what you type. Nothing is stored — your session
            clears when you close the tab.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/50 hover:bg-card"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent activity (this session)
          </h3>
          {activities.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing yet. Generate an email, run a research briefing or chat with the assistant.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border/60">
              {activities.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                      {a.tool}
                    </span>
                    <span className="truncate text-foreground/90">{a.label}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {a.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
