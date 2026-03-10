"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Pencil, Check, X } from "lucide-react";

interface EditProfileFormProps {
  initialName: string;
  initialPhone: string;
  initialAddressLine1: string;
  initialAddressLine2: string;
  initialCity: string;
  initialPostalCode: string;
  initialProvince: string;
}

const PROVINCES = [
  { value: "QC", label: "Québec" },
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "Colombie-Britannique" },
  { value: "AB", label: "Alberta" },
  { value: "MB", label: "Manitoba" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NS", label: "Nouvelle-Écosse" },
  { value: "NB", label: "Nouveau-Brunswick" },
  { value: "PE", label: "Île-du-Prince-Édouard" },
  { value: "NL", label: "Terre-Neuve-et-Labrador" },
];

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-foreground/60">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-label={label}
        className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}

export function EditProfileForm({
  initialName,
  initialPhone,
  initialAddressLine1,
  initialAddressLine2,
  initialCity,
  initialPostalCode,
  initialProvince,
}: EditProfileFormProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [line1, setLine1] = useState(initialAddressLine1);
  const [line2, setLine2] = useState(initialAddressLine2);
  const [city, setCity] = useState(initialCity);
  const [postalCode, setPostalCode] = useState(initialPostalCode);
  const [province, setProvince] = useState(initialProvince || "QC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const hasAddress = line1 || city || postalCode;

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name.trim() || null,
          phone: phone.trim() || null,
          address_line1: line1.trim() || null,
          address_line2: line2.trim() || null,
          city: city.trim() || null,
          postal_code: postalCode.trim() || null,
          province: province || "QC",
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      setSuccess(true);
      setEditing(false);
      router.refresh(); // Rafraîchit les données server (sans rechargement complet)
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Erreur lors de la mise à jour. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(initialName);
    setPhone(initialPhone);
    setLine1(initialAddressLine1);
    setLine2(initialAddressLine2);
    setCity(initialCity);
    setPostalCode(initialPostalCode);
    setProvince(initialProvince || "QC");
    setEditing(false);
    setError("");
  };

  if (!editing) {
    return (
      <div className="space-y-4">
        {/* Infos de base */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-foreground/40">Nom</p>
            <p className="mt-1 font-medium">{name || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/40">Téléphone</p>
            <p className="mt-1 font-medium">{phone || "Non renseigné"}</p>
          </div>
        </div>

        {/* Adresse */}
        <div>
          <p className="text-xs text-foreground/40">Adresse par défaut</p>
          {hasAddress ? (
            <div className="mt-1 text-sm font-medium leading-relaxed">
              <p>{line1}{line2 && `, ${line2}`}</p>
              <p>{city}{postalCode && `, ${postalCode}`} — {province}</p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-foreground/40 italic">
              Aucune adresse enregistrée — sera demandée à chaque commande
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
          {success && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="h-3.5 w-3.5" />
              Profil mis à jour
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Infos de base */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nom complet"
          value={name}
          onChange={setName}
          autoComplete="name"
          placeholder="Votre nom"
        />
        <Field
          label="Téléphone"
          value={phone}
          onChange={setPhone}
          type="tel"
          autoComplete="tel"
          placeholder="+1 (514) 000-0000"
        />
      </div>

      {/* Adresse */}
      <div className="border-t border-foreground/5 pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Adresse par défaut (optionnel)
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Adresse"
            value={line1}
            onChange={setLine1}
            autoComplete="address-line1"
            placeholder="123 rue Principale"
            className="sm:col-span-2"
          />
          <Field
            label="Appartement, suite (optionnel)"
            value={line2}
            onChange={setLine2}
            autoComplete="address-line2"
            placeholder="App. 4"
            className="sm:col-span-2"
          />
          <Field
            label="Ville"
            value={city}
            onChange={setCity}
            autoComplete="address-level2"
            placeholder="Montréal"
          />
          <Field
            label="Code postal"
            value={postalCode}
            onChange={setPostalCode}
            autoComplete="postal-code"
            placeholder="H1A 1A1"
          />
          <div>
            <label htmlFor="profile-province" className="mb-1.5 block text-xs font-medium text-foreground/60">
              Province
            </label>
            <select
              id="profile-province"
              aria-label="Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {PROVINCES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading} className="gap-1.5">
          <Check className="h-3.5 w-3.5" />
          {loading ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleCancel} disabled={loading} className="gap-1.5">
          <X className="h-3.5 w-3.5" />
          Annuler
        </Button>
      </div>
    </div>
  );
}
