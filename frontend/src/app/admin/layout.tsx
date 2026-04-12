"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { authFetch } from "@/lib/api";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Package,
  Users,
  Repeat,
  Mail,
  MessageSquare,
  Inbox,
  Menu,
  X,
  LogOut,
  Camera,
} from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Översikt", icon: LayoutDashboard },
  { href: "/admin/inkorg", label: "Inkorg", icon: Inbox },
  { href: "/admin/ordrar", label: "Ordrar", icon: ShoppingBag },
  { href: "/admin/rabattkoder", label: "Rabattkoder", icon: Tag },
  { href: "/admin/produkter", label: "Produkter", icon: Package },
  { href: "/admin/kunder", label: "Kunder", icon: Users },
  { href: "/admin/prenumerationer", label: "Prenumerationer", icon: Repeat },
  { href: "/admin/recensioner", label: "Recensioner", icon: MessageSquare },
  { href: "/admin/nyhetsbrev", label: "Nyhetsbrev", icon: Mail },
  { href: "/admin/social", label: "Sociala medier", icon: Camera },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, logout } = useAuth();

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!token) {
        router.replace("/logga-in");
        return;
      }

      try {
        const data = await authFetch<AdminUser>("/admin/me", token);
        if (cancelled) return;

        if (data.role !== "admin") {
          router.replace("/logga-in");
          return;
        }

        setAdminUser(data);
        setAuthorized(true);
      } catch {
        if (!cancelled) router.replace("/logga-in");
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f5f7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#108474] border-t-transparent" />
      </div>
    );
  }

  if (!authorized) return null;

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f7]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#1d1d1f] text-white">
        <div className="flex h-16 items-center px-6">
          <span className="text-lg font-semibold tracking-tight">
            1753 Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium truncate">
              {adminUser?.name}
            </p>
            <p className="text-xs text-white/40 truncate">
              {adminUser?.email}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace("/logga-in");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logga ut
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1d1d1f] text-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight">
            1753 Admin
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 px-1">
            <p className="text-sm font-medium truncate">
              {adminUser?.name}
            </p>
            <p className="text-xs text-white/40 truncate">
              {adminUser?.email}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace("/logga-in");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logga ut
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#e6e6e6] bg-white/80 px-6 backdrop-blur-xl">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[#1d1d1f] hover:bg-[#f5f5f7] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-[#1d1d1f] lg:hidden">
              1753 Admin
            </h1>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#515151]">
                {adminUser?.name}
              </span>
              <div className="h-8 w-8 rounded-full bg-[#108474] flex items-center justify-center text-white text-sm font-medium">
                {adminUser?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
