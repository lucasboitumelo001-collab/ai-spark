import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Mail, Search, MessagesSquare, Menu, X, Bot } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "Workplace Chatbot", icon: MessagesSquare },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground data-[status=active]:bg-sidebar-primary/15 data-[status=active]:text-sidebar-primary-foreground"
        >
          <Icon className="size-4.5 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-3 py-1">
      <div className="grid size-9 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
        <Bot className="size-5 text-primary" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-semibold text-sidebar-foreground">AI Workplace</p>
        <p className="text-xs text-muted-foreground">Productivity Assistant</p>
      </div>
    </div>
  );
}

export function AppLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="flex flex-col gap-6">
          <Brand />
          <NavLinks />
        </div>
        <p className="rounded-lg bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
          AI-generated content may contain errors. Review and verify important information before
          using it.
        </p>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-start gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              className="mt-0.5 rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </header>

        <main className={cn("px-4 py-6 sm:px-8 sm:py-8")}>{children}</main>

        <footer className="px-4 pb-8 sm:px-8">
          <p className="rounded-lg border border-border/60 bg-card/60 p-3 text-xs text-muted-foreground">
            AI-generated content may contain errors. Review and verify important information before
            using it.
          </p>
        </footer>
      </div>
    </div>
  );
}
