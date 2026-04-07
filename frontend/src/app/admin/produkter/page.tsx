"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

interface Product {
  id: string;
  name: string;
  price: number;
  articleNumber: string;
  vatRate: number;
  stock: number | null;
}

interface EditState {
  name: string;
  price: number | "";
}

export default function ProductsAdminPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ name: "", price: "" });
  const [saving, setSaving] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const flash = useCallback(
    (type: "success" | "error", text: string) => {
      setMessage({ type, text });
      setTimeout(() => setMessage(null), 5000);
    },
    []
  );

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await authFetch<Product[]>("/admin/products", token);
      setProducts(data);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Kunde inte hämta produkter");
    } finally {
      setLoading(false);
    }
  }, [token, flash]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingId) return;
    setSaving(true);
    try {
      await authFetch(`/admin/products/${encodeURIComponent(editingId)}`, token, {
        method: "PUT",
        body: JSON.stringify({
          name: editState.name.trim(),
          price: Number(editState.price),
        }),
      });
      flash("success", "Produkten uppdaterad");
      setEditingId(null);
      await fetchProducts();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    if (!token) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await authFetch<{ message?: string; synced?: number }>(
        "/admin/products/sync",
        token,
        { method: "POST" }
      );
      const info = res.message ?? `${res.synced ?? 0} produkter synkade`;
      setSyncResult(info);
      flash("success", info);
      await fetchProducts();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Synkronisering misslyckades");
    } finally {
      setSyncing(false);
    }
  };

  function stockBadge(stock: number | null) {
    if (stock === null || stock === undefined) {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
          Okänt
        </span>
      );
    }
    if (stock === 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
          {stock}
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          {stock}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
        {stock}
      </span>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#108474]/30 focus:border-[#108474] transition-colors";

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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Produkter</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} produkter totalt
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="rounded-xl bg-[#108474] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d6e61] active:scale-[0.98] disabled:opacity-50"
        >
          {syncing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Synkar...
            </span>
          ) : (
            "Synka alla"
          )}
        </button>
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

      {syncResult && !message && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {syncResult}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3.5 font-semibold text-gray-600">Artikel #</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Namn</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Pris (kr)</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Moms</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600">Lagersaldo</th>
                <th className="px-5 py-3.5 font-semibold text-gray-600 text-right">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Inga produkter hittades. Kör &quot;Synka alla&quot; för att hämta från Fortnox.
                  </td>
                </tr>
              )}
              {products.map((p) =>
                editingId === p.id ? (
                  <tr key={p.id} className="bg-gray-50/40">
                    <td className="px-5 py-4 font-mono text-gray-500">{p.articleNumber}</td>
                    <td colSpan={4} className="px-5 py-4">
                      <form
                        id={`edit-${p.id}`}
                        onSubmit={handleSave}
                        className="flex flex-wrap items-end gap-4"
                      >
                        <div className="min-w-[200px] flex-1">
                          <label className="mb-1 block text-xs font-medium text-gray-500">
                            Namn
                          </label>
                          <input
                            type="text"
                            required
                            value={editState.name}
                            onChange={(e) =>
                              setEditState((s) => ({ ...s, name: e.target.value }))
                            }
                            className={inputClass}
                          />
                        </div>
                        <div className="w-32">
                          <label className="mb-1 block text-xs font-medium text-gray-500">
                            Pris (kr)
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            step={1}
                            value={editState.price}
                            onChange={(e) =>
                              setEditState((s) => ({
                                ...s,
                                price: e.target.value === "" ? "" : Number(e.target.value),
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                      </form>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          form={`edit-${p.id}`}
                          disabled={saving}
                          className="rounded-lg bg-[#108474] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0d6e61] disabled:opacity-50"
                        >
                          {saving ? "Sparar..." : "Spara"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                          Avbryt
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-5 py-3.5 font-mono text-gray-500">{p.articleNumber}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{p.name}</td>
                    <td className="px-5 py-3.5 text-gray-700 tabular-nums">
                      {p.price.toLocaleString("sv-SE")}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{p.vatRate}%</td>
                    <td className="px-5 py-3.5">{stockBadge(p.stock)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setEditState({ name: p.name, price: p.price });
                        }}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#108474] transition-colors hover:bg-[#108474]/10"
                      >
                        Redigera
                      </button>
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
