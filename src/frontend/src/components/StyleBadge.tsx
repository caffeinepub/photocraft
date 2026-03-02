import { cn } from "@/lib/utils";
import { EditingStyle } from "../backend.d";
import { getStyleConfig } from "../lib/photoUtils";

const styleColorMap: Record<EditingStyle, string> = {
  [EditingStyle.Vintage]: "bg-amber-100 text-amber-800 border-amber-200",
  [EditingStyle.Vivid]: "bg-cyan-100 text-cyan-800 border-cyan-200",
  [EditingStyle.SoftGlow]: "bg-pink-100 text-pink-800 border-pink-200",
  [EditingStyle.BlackAndWhite]: "bg-slate-100 text-slate-700 border-slate-200",
  [EditingStyle.WarmTone]: "bg-orange-100 text-orange-800 border-orange-200",
  [EditingStyle.CoolTone]: "bg-blue-100 text-blue-800 border-blue-200",
};

interface StyleBadgeProps {
  style: EditingStyle;
  size?: "sm" | "md";
  className?: string;
}

export function StyleBadge({ style, size = "sm", className }: StyleBadgeProps) {
  const config = getStyleConfig(style);
  const colorClasses =
    styleColorMap[style] ??
    "bg-secondary text-secondary-foreground border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        colorClasses,
        className,
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
