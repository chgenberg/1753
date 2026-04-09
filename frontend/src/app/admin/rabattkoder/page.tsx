"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

interface Discount {
  id: number;
  code: string;
  percent: number;
  description: string;
  product_ids: string[] | null;
  max_uses: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  created_at: string;
}

interface DiscountForm {
  code: string;
  percent: number | "";
  description: string;
  productIds: string;
  maxUses: number | "";
  validFrom: string;
  validUntil: string;
}

const emptyForm: DiscountForm = {
  code: "",
  percent: "",
  description: "",
  productIds: "",
  maxUses: "",
  validFrom: "",
  validUntil: "",
};

function formToPayload(f: DiscountForm) {
  const ids = f.productIds
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    code: f.code.trim().toUpperCase(),
    percent: Number(f.percent),
    description: f.description.trim(),
    productIds: ids.length > 0 ? ids : null,
    maxUses: f.maxUses === "" ? null : Number(f.maxUses),
    validFrom: f.validFrom || null,
    validUntil: f.validUntil || null,
  };
}

function discountToForm(d: Discount): DiscountForm {
  return {
    code: d.code,
    percent: d.percent,
    description: d.description ?? "",
    productIds: d.product_ids?.join(", ") ?? "",
    maxUses: d.max_uses ?? "",
    validFrom: d.valid_from ? d.valid_from.slice(0, 16) : "",
    validUntil: d.valid_until ? d.valid_until.slice(0, 16) : "",
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const INPUT_CLASS =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#108474]/30 focus:border-[#108474] transition-colors";
const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-1";

function DiscountFormFields({
  form,
  setForm,
  onSubmit,
  submitting,
  submitLabel,
  onCancel,
}: {
  form: DiscountForm;
  setForm: (fn: (prev: DiscountForm) => DiscountForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className={LABEL_CLASS}>Kod *</label>
          <input
            type="text"
            required
            value={form.code}
            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
            className={INPUT_CLASS}
            placeholder="T.ex. SOMMAR25"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Rabatt % *</label>
          <input
            type="number"
            required
            min={1}
            max={100}
            value={form.percent}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                percent: e.target.value === "" ? "" : Number(e.target.value),
              }))
            }
            className={INPUT_CLASS}
            placeholder="25"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Beskrivning</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className={INPUT_CLASS}
            placeholder="Sommarrea 2026"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Produkt-ID:n</label>
          <input
            type="text"
            value={form.productIds}
            onChange={(e) => setForm((p) => ({ ...p, productIds: e.target.value }))}
            className={INPUT_CLASS}
            placeholder="Lämna tomt för alla produkter"
          />
          <p className="mt-1 text-xs text-gray-400">Komma-separerade. Lämna tomt för alla produkter.</p>
        </div>
        <div>
          <label className={LABEL_CLASS}>Max användningar</label>
          <input
            type="number"
            min={1}
            value={form.maxUses}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                maxUses: e.target.value === "" ? "" : Number(e.target.value),
              }))
            }
            className={INPUT_CLASS}
            placeholder="Obegränsat"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Giltig från</label>
          <input
            type="datetime-local"
            value={form.validFrom}
            onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Giltig till</label>
          <input
            type="datetime-local"
            value={form.validUntil}
            onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))}
            className={INPUT_CLASS}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#108474] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d6e61] active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? "Sparar..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}

export default function DiscountCodesPage() {
  const { token } = useAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<DiscountForm>(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<DiscountForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const flash = useCallback(
    (type: "success" | "error", text: string) => {
      setMessage({ type, text });
      setTimeout(() => setMessage(null), 4000);
    },
    []
  );

  const fetchDiscounts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authFetch<Discount[]>("/admin/discounts", token);
      setDiscounts(data);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Kunde inte hämta rabattkoder");
    } finally {
      setLoading(false);
    }
  }, [token, flash]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    try {
      await authFetch("/admin/discounts", token, {
        method: "POST",
        body: JSON.stringify(formToPayload(createForm)),
      });
      flash("success", `Rabattkod "${createForm.code.toUpperCase()}" skapad`);
      setCreateForm(emptyForm);
      setShowCreate(false);
      await fetchDiscounts();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Kunde inte skapa rabattkod");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingCode) return;
    setSaving(true);
    try {
      await authFetch(`/admin/discounts/${encodeURIComponent(editingCode)}`, token, {
        method: "PUT",
        body: JSON.stringify(formToPayload(editForm)),
      });
      flash("success", `Rabattkod "${editingCode}" uppdaterad`);
      setEditingCode(null);
      await fetchDiscounts();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Kunde inte uppdatera");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!token) return;
    if (!window.confirm(`Vill du verkligen ta bort rabattkoden "${code}"?`)) return;
    try {
      await authFetch(`/admin/discounts/${encodeURIComponent(code)}`, token, {
        method: "DELETE",
      });
      flash("success", `Rabattkod "${code}" borttagen`);
      await fetchDiscounts();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Kunde inte ta bort");
    }
  };

  const handleToggleActive = async (d: Discount) => {
    if (!token) return;
    try {
      await authFetch(`/admin/discounts/${encodeURIComponent(d.code)}`, token, {
        method: "PUT",
        body: JSON.stringify({ ...formToPayload(discountToForm(d)), active: !d.active }),
      });
      await fetchDiscounts();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Kunde inte ändra status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#108474] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Rabattkoder</h1>
          <p className="mt-1 text-sm text-gray-500">
            Hantera rabattkoder och erbjudanden
          </p>
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-xl bg-[#108474] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d6e61] active:scale-[0.98]"
          >
            Skapa rabattkod
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {showCreate && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Ny rabattkod</h2>
          <DiscountFormFields
            form={createForm}
            setForm={setCreateForm}
            onSubmit={handleCreate}
            submitting={creating}
            submitLabel="Skapa"
            onCancel={() => {
              setShowCreate(false);
              setCreateForm(emptyForm);
            }}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3.5 font-semibold text-gray-600">Kod</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Rabatt %</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Beskrivning</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Använd / Max</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Giltig till</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600 text-center">Aktiv</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600 text-right">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    Inga rabattkoder hittades. Skapa din första ovan.
                  </td>
                </tr>
              )}
              {discounts.map((d) =>
                editingCode === d.code ? (
                  <tr key={d.code}>
                    <td colSpan={7} className="p-4">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">
                        Redigerar: {d.code}
                      </h3>
                      <DiscountFormFields
                        form={editForm}
                        setForm={setEditForm}
                        onSubmit={handleUpdate}
                        submitting={saving}
                        submitLabel="Spara"
                        onCancel={() => setEditingCode(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={d.code}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">
                      {d.code}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{d.percent}%</td>
                    <td className="px-5 py-3.5 text-gray-500 max-w-[200px] truncate">
                      {d.description || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">
                      {d.used_count} / {d.max_uses ?? "∞"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {formatDate(d.valid_until)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(d)}
                        className={`inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                          d.active ? "bg-[#108474]" : "bg-gray-200"
                        }`}
                        aria-label={d.active ? "Inaktivera" : "Aktivera"}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                            d.active ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCode(d.code);
                            setEditForm(discountToForm(d));
                          }}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#108474] transition-colors hover:bg-[#108474]/10"
                        >
                          Redigera
                        </button>
                        <button
                          onClick={() => handleDelete(d.code)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          Ta bort
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
