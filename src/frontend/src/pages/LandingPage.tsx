import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Download,
  Sparkles,
  Star,
  Upload,
  Wand2,
} from "lucide-react";
import { motion } from "motion/react";
import type { PublicPhoto } from "../backend.d";
import { PhotoImage } from "../components/PhotoImage";
import { PhotoGridSkeleton } from "../components/PhotoSkeleton";
import { StyleBadge } from "../components/StyleBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePublicPhotos } from "../hooks/useQueries";
import { EDITING_STYLES } from "../lib/photoUtils";

const FEATURES = [
  {
    icon: Upload,
    title: "Upload Easily",
    description:
      "Drag & drop or browse to upload your photos. Supports all major image formats.",
    color: "bg-pink-100 text-pink-700",
  },
  {
    icon: Wand2,
    title: "Choose Your Style",
    description:
      "Pick from 6 curated editing styles — Vintage, Vivid, Soft Glow, and more.",
    color: "bg-lavender-100 text-purple-700",
  },
  {
    icon: Download,
    title: "Download & Share",
    description:
      "Download your styled photos instantly. Share to the community gallery.",
    color: "bg-peach-100 text-orange-700",
  },
];

const TESTIMONIALS = [
  {
    name: "Amara Chen",
    role: "Wedding Photographer",
    quote:
      "PhotoCraft transformed my workflow. The Soft Glow style is my absolute favorite for portraits.",
    rating: 5,
  },
  {
    name: "Luca Martini",
    role: "Travel Blogger",
    quote:
      "The Vintage filter gives my travel shots that timeless film aesthetic I've always wanted.",
    rating: 5,
  },
  {
    name: "Zoe Williams",
    role: "Food Photographer",
    quote:
      "Warm Tone makes every dish look irresistible. My engagement rate tripled!",
    rating: 5,
  },
];

function PreviewPhoto({ photo }: { photo: PublicPhoto }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="aspect-[4/3]">
        <PhotoImage
          blobId={photo.blobId}
          alt={photo.title}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent">
        <StyleBadge style={photo.editingStyle} size="sm" />
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const { data: publicPhotos, isLoading } = usePublicPhotos();

  const previewPhotos = publicPhotos?.slice(0, 8) ?? [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background image with layered gradient */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-bg.dim_1600x900.jpg"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          {/* Directional overlay — darker on left for text legibility, opens on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
          {/* Bottom fade to match the next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Decorative floating circles — atmospheric depth */}
        <div className="absolute top-16 right-[15%] w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-24 right-[5%] w-48 h-48 rounded-full bg-accent/20 blur-2xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-28 md:py-36">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="mb-8">
                <span className="inline-flex items-center gap-2 bg-white/80 text-foreground/70 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-border/60 shadow-sm">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Photo Styling Platform
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-display font-bold text-5xl md:text-6xl lg:text-[5.5rem] text-foreground leading-[1.05] mb-6"
              >
                Your photos,
                <br />
                <span className="text-gradient">elevated.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-foreground/60 max-w-lg mb-10 leading-relaxed"
              >
                Upload any photo, choose from 6 hand-crafted editing styles, and
                download a beautifully styled result in seconds.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3"
              >
                {identity ? (
                  <Link to="/upload">
                    <Button
                      size="lg"
                      className="gap-2 shadow-glow px-8 h-12 rounded-xl"
                    >
                      <Upload className="w-4 h-4" />
                      Start Creating
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="gap-2 shadow-glow px-8 h-12 rounded-xl"
                  >
                    {isLoggingIn ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Get Started Free
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}

                <Link to="/gallery">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 h-12 rounded-xl bg-white/60 hover:bg-white/80 border-border/60"
                  >
                    Explore Gallery
                  </Button>
                </Link>
              </motion.div>

              {/* Social proof strip */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 mt-10"
              >
                <div className="flex -space-x-2">
                  {["A", "L", "Z", "M"].map((initial, i) => (
                    <div
                      key={initial}
                      className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm"
                      style={{
                        background: [
                          "oklch(0.72 0.1 10)",
                          "oklch(0.68 0.09 290)",
                          "oklch(0.75 0.09 50)",
                          "oklch(0.70 0.1 160)",
                        ][i],
                        zIndex: 4 - i,
                      }}
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-foreground/60">
                  Loved by{" "}
                  <span className="font-semibold text-foreground/80">
                    2,400+
                  </span>{" "}
                  photographers
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to transform your photography
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
              >
                <div
                  className={`inline-flex items-center justify-center rounded-2xl w-14 h-14 mb-5 ${feature.color}`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editing Styles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              6 Stunning Editing Styles
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Each style crafted to tell a different visual story
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EDITING_STYLES.map((style, i) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                {/* Colored emoji header */}
                <div
                  className={cn(
                    "flex items-center justify-center h-20 text-4xl",
                    style.iconBg,
                  )}
                >
                  {style.icon}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {style.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Preview */}
      {(isLoading || previewPhotos.length > 0) && (
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
                  Community Gallery
                </h2>
                <p className="text-muted-foreground">
                  Beautiful photos from our community
                </p>
              </div>
              <Link to="/gallery">
                <Button variant="outline" className="gap-2 hidden sm:flex">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {isLoading ? (
              <PhotoGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewPhotos.map((photo) => (
                  <PreviewPhoto key={photo.id} photo={photo} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Loved by Photographers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from(
                    { length: t.rating },
                    (_, j) => `star-${t.name}-${j}`,
                  ).map((id) => (
                    <Star
                      key={id}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ready to Create?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Join thousands of photographers crafting stunning imagery with
              PhotoCraft.
            </p>
            {identity ? (
              <Link to="/upload">
                <Button size="lg" className="gap-2 shadow-glow px-10">
                  <Upload className="w-5 h-5" />
                  Upload Your First Photo
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-2 shadow-glow px-10"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
