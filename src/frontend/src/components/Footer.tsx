import { Link } from "@tanstack/react-router";
import { Camera, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-1">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground">
              PhotoCraft
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              to="/gallery"
              className="hover:text-foreground transition-colors"
            >
              Gallery
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © {year}. Built with{" "}
            <Heart className="w-3 h-3 text-primary fill-current" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
