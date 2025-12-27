import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Wrench, BarChart3, Users, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/shared/Chatbot";

const features = [
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description: "Track corrective and preventive maintenance with smart workflows.",
  },
  {
    icon: Shield,
    title: "Equipment Health",
    description: "Monitor equipment health scores and receive critical alerts.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Manage technicians and optimize workload distribution.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Calendar view for preventive maintenance planning.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Comprehensive reporting and performance insights.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant notifications and live status tracking.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 gradient-hero" />
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, hsl(var(--secondary) / 0.15) 0%, transparent 50%)`,
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg"
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <span className="text-lg font-bold text-primary-foreground">G</span>
            </div>
            <span className="font-bold text-xl">
              <span className="text-primary">Gear</span>
              <span className="text-secondary">Guard</span>
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="hero">
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container py-20 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Enterprise-grade maintenance management
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="text-primary">GearGuard</span> – The Ultimate{" "}
            <span className="relative">
              <span className="relative z-10">Maintenance Tracker</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-2 left-0 -z-0 h-3 w-full origin-left bg-secondary/20"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground"
          >
            Streamline your maintenance operations with intelligent tracking, team
            management, and real-time analytics. Built for modern enterprises.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/signup">
              <Button size="xl" variant="hero" className="group">
                Get Started Free
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="hero-outline">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-50 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-4 text-sm text-muted-foreground">
                GearGuard Dashboard
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6">
              {/* Mock KPI Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="rounded-xl border-l-4 border-l-destructive bg-muted/50 p-4"
              >
                <div className="text-sm text-muted-foreground">Critical Equipment</div>
                <div className="mt-1 text-3xl font-bold text-destructive">2</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="rounded-xl border-l-4 border-l-info bg-muted/50 p-4"
              >
                <div className="text-sm text-muted-foreground">Technician Load</div>
                <div className="mt-1 text-3xl font-bold text-info">76%</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="rounded-xl border-l-4 border-l-success bg-muted/50 p-4"
              >
                <div className="text-sm text-muted-foreground">Open Requests</div>
                <div className="mt-1 text-3xl font-bold text-success">12</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">
              Everything you need for{" "}
              <span className="text-primary">maintenance excellence</span>
            </h2>
            <p className="text-muted-foreground">
              Powerful features designed for enterprise maintenance operations.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl gradient-primary p-12 text-center text-primary-foreground"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground/20 blur-3xl"
            />
            
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to transform your maintenance operations?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
                Join thousands of enterprises already using GearGuard to streamline
                their maintenance workflows.
              </p>
              <Link to="/signup">
                <Button size="xl" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <span className="text-sm font-bold text-primary-foreground">G</span>
            </div>
            <span className="font-semibold">GearGuard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 GearGuard. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
