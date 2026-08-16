import { useEffect, useState, type FormEvent } from "react";
import {
  getTodayJournal,
  updateJournal,
  upsertJournal,
} from "../../api/journal";
import type { CreateJournalEntryInput } from "../../types/types";

type JournalForm = CreateJournalEntryInput;

function today() {
  return new Intl.DateTimeFormat("fr-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function JournalPage() {
  const [form, setForm] = useState<JournalForm>({
    date: today(),
    humeur: 0,
    energie: 0,
    qualite_sommeil: 0,
    anxiete_stress: 0,
    evenements: "",
    gratitude: "",
    activityIds: [],
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [journalExiste, setJournalExiste] = useState(false);

  useEffect(() => {
    async function chargerJournalDuJour() {
      try {
        const entree = await getTodayJournal(today());

        if (!entree) {
          return;
        }

        setJournalExiste(true);

        setForm({
          date: today(),
          humeur: entree.humeur,
          energie: entree.energie,
          qualite_sommeil: entree.qualite_sommeil,
          anxiete_stress: entree.anxiete_stress,
          evenements: entree.evenements,
          gratitude: entree.gratitude ?? "",
          activityIds: entree.activities.map(
            (journalActivity) => journalActivity.activityId,
          ),
        });
      } catch {
        setError("Impossible de charger votre journal du jour.");
      }
    }

    void chargerJournalDuJour();
  }, []);

  function updateScale(
    field: "humeur" | "energie" | "qualite_sommeil" | "anxiete_stress",
    value: number,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateText(field: "evenements" | "gratitude", value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.humeur ||
      !form.energie ||
      !form.qualite_sommeil ||
      !form.anxiete_stress
    ) {
      setError("Veuillez répondre aux quatre indicateurs.");
      return;
    }

    if (!form.evenements.trim()) {
      setError("Décrivez au moins un événement marquant.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        evenements: form.evenements.trim(),
        gratitude: form.gratitude?.trim() || undefined,
      };

      if (journalExiste) {
        const { date, ...modifications } = payload;

        await updateJournal(date, modifications);

        setSuccess("Votre journal du jour a été modifié.");
      } else {
        await upsertJournal(payload);

        setJournalExiste(true);

        setSuccess("Votre journal du jour a été enregistré.");
      }
    } catch {
      setError("Impossible d'enregistrer votre journal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-10 text-center text-3xl font-bold">
          Mon journal de bien-être
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 lg:grid-cols-2 lg:p-10"
        >
          <section className="space-y-8">
            <label className="block">
              <span className="mb-2 block font-semibold">Date</span>
              <input
                type="date"
                value={form.date}
                readOnly
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>

            <ScaleQuestion
              label="Aujourd'hui, mon humeur est..."
              value={form.humeur}
              onChange={(value) => updateScale("humeur", value)}
            />
            <ScaleQuestion
              label="Mon niveau d'énergie est..."
              value={form.energie}
              onChange={(value) => updateScale("energie", value)}
            />
            <ScaleQuestion
              label="La qualité de mon sommeil est..."
              value={form.qualite_sommeil}
              onChange={(value) => updateScale("qualite_sommeil", value)}
            />
            <ScaleQuestion
              label="Mon niveau d'anxiété et de stress est..."
              value={form.anxiete_stress}
              onChange={(value) => updateScale("anxiete_stress", value)}
            />
          </section>

          <section className="space-y-6">
            <label className="block">
              <span className="mb-2 block font-semibold">
                Événements marquants
              </span>
              <textarea
                required
                value={form.evenements}
                onChange={(event) =>
                  updateText("evenements", event.target.value)
                }
                rows={8}
                className="w-full resize-none rounded-xl border border-slate-300 p-4"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold">
                Gratitude du jour (facultatif)
              </span>
              <textarea
                value={form.gratitude}
                onChange={(event) =>
                  updateText("gratitude", event.target.value)
                }
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-300 p-4"
              />
            </label>
          </section>

          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                {success}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-sky-700 px-6 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
            >
              {saving
                ? journalExiste
                  ? "Modification..."
                  : "Enregistrement..."
                : journalExiste
                  ? "Modifier mon journal"
                  : "Enregistrer mon journal"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

type ScaleQuestionProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function ScaleQuestion({ label, value, onChange }: ScaleQuestionProps) {
  return (
    <fieldset>
      <legend className="mb-4 font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-5">
        {[1, 2, 3, 4, 5].map((number) => (
          <label
            key={number}
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            <input
              type="radio"
              checked={value === number}
              onChange={() => onChange(number)}
              className="h-5 w-5"
            />
            <span className="text-sm text-slate-600">{number}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
