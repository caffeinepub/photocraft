import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Camera, Grid3X3, LogOut, Menu, Upload, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

export function Header() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: profile } = useUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;
  const displayName =
    profile?.name ||
    `${identity?.getPrincipal().toString().slice(0, 8) ?? ""}...`;
  const initials = profile?.name
    ? profile.name.slice(0, 2).toUpperCase()
    : "PC";

  const navLinks = [
    { to: "/gallery", label: "Gallery", icon: Grid3X3, public: true },
    { to: "/dashboard", label: "My Photos", icon: Grid3X3, public: false },
    { to: "/upload", label: "Upload", icon: Upload, public: false },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="bg-primary rounded-xl p-1.5 shadow-sm group-hover:shadow-md transition-shadow">
            <Camera className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Photo<span className="text-gradient">Craft</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks
            .filter((link) => link.public || isAuthenticated)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  currentPath === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="hidden md:flex">
                <Button size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/30">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Photography enthusiast
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      My Photos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clear}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              size="sm"
              className="gap-2"
            >
              {isLoggingIn ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-card"
        >
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks
              .filter((link) => link.public || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    currentPath === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-all"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
