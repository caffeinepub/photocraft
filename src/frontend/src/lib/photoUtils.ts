import { EditingStyle } from "../backend.d";

export const EDITING_STYLES = [
  {
    id: EditingStyle.Vintage,
    label: "Vintage",
    description: "Warm, faded tones with film grain and nostalgia",
    icon: "📷",
    colorClass: "style-vintage",
    // Active card bg / ring color
    selectedBg: "bg-amber-50",
    selectedRing: "ring-amber-400",
    iconBg: "bg-amber-100",
  },
  {
    id: EditingStyle.Vivid,
    label: "Vivid",
    description: "Bold, saturated colors that pop with clarity",
    icon: "✨",
    colorClass: "style-vivid",
    selectedBg: "bg-cyan-50",
    selectedRing: "ring-cyan-400",
    iconBg: "bg-cyan-100",
  },
  {
    id: EditingStyle.SoftGlow,
    label: "Soft Glow",
    description: "Dreamy, ethereal look with gentle luminosity",
    icon: "🌸",
    colorClass: "style-softglow",
    selectedBg: "bg-pink-50",
    selectedRing: "ring-pink-400",
    iconBg: "bg-pink-100",
  },
  {
    id: EditingStyle.BlackAndWhite,
    label: "Black & White",
    description: "Timeless monochrome with deep contrast",
    icon: "🎞️",
    colorClass: "style-bw",
    selectedBg: "bg-slate-100",
    selectedRing: "ring-slate-400",
    iconBg: "bg-slate-200",
  },
  {
    id: EditingStyle.WarmTone,
    label: "Warm Tone",
    description: "Cozy golden hour hues with orange and amber warmth",
    icon: "🌅",
    colorClass: "style-warm",
    selectedBg: "bg-orange-50",
    selectedRing: "ring-orange-400",
    iconBg: "bg-orange-100",
  },
  {
    id: EditingStyle.CoolTone,
    label: "Cool Tone",
    description: "Crisp, refreshing blues and teal undertones",
    icon: "❄️",
    colorClass: "style-cool",
    selectedBg: "bg-blue-50",
    selectedRing: "ring-blue-400",
    iconBg: "bg-blue-100",
  },
];

export function getStyleConfig(style: EditingStyle) {
  return EDITING_STYLES.find((s) => s.id === style) ?? EDITING_STYLES[0];
}

export function formatDate(uploadedAt: bigint): string {
  const ms = Number(uploadedAt) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncatePrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
}
