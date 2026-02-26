"use client";

import { motion, type Variants } from "framer-motion";
import { ShieldCheck, Lock, Zap } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Origine Garantie",
    desc: "Produits authentiques, directs d'Afrique",
  },
  {
    icon: Lock,
    title: "Paiement Sécurisé",
    desc: "Cryptage SSL • Stripe certifié PCI DSS",
  },
  {
    icon: Zap,
    title: "Livraison Express",
    desc: "Expédition rapide partout au Québec",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-page py-10">
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {items.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="flex items-start gap-4 rounded-2xl p-4 transition-colors hover:bg-secondary/60"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground/50">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
