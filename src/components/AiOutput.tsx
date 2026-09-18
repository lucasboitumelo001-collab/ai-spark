import { Check, Copy, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AiOutput({
  value,
  onChange,
  onRegenerate,
  loading,
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  loading?: boolean;
  rows?: number;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y bg-card/60 font-mono text-sm leading-relaxed"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
          }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="outline" onClick={onRegenerate} disabled={loading}>
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
          Regenerate
        </Button>
      </div>
    </div>
  );
}

export function Thinking({ label = "AI is thinking..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
      <span className="flex gap-1">
        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary" />
      </span>
      {label}
    </div>
  );
}
