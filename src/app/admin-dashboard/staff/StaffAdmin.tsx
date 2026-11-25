"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { rolesApi, staffApi, type Account } from "@/lib/api";
import { formatDate, initials } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader, StatusPill, PlusIcon, SearchIcon } from "../AdminHeader";
import { EmptyRow, Loader, Modal, Pagination, btn, inputCls, useAdminAction } from "../AdminShell";

export function StaffAdmin() {
  const sp = useSearchParams();
  const { can, user } = useAuth();
  const run = useAdminAction();
  const [role, setRole] = useState(sp.get("role") ?? "");
  const [type, setType] = useState<"staff" | "customer">("staff");
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const roles = useAsync(() => rolesApi.list(), []);
  const list = useAsync(
    () => staffApi.list({ type: role ? undefined : type, role: role || undefined, search: applied || undefined, page, limit: 20 }),
    [type, role, applied, page]
  );

  if (!can("staff:manage")) return <p className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-800">Only admins can manage staff.</p>;

  const changeRole = async (a: Account, next: string) => {
    if (await run(() => staffApi.update(a._id, { role: next }), next === "user" ? `${a.fullName} no longer has dashboard access` : "Role updated"))
      void list.reload();
  };

  const roleOptions = roles.data ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Staff" }]}
        title="Staff accounts"
        description="Give people dashboard access by assigning a role. Setting a role to Customer removes access."
        actions={
          <>
            <Link href="/admin-dashboard/roles" className={btn.secondary}>
              Roles & permissions
            </Link>
            <button onClick={() => setAdding(true)} className={btn.primary}>
              <PlusIcon /> Add staff
            </button>
          </>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(search.trim());
          setPage(1);
        }}
        className="mb-4 flex flex-wrap gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70"
      >
        <div className="relative min-w-[200px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or email…" className={`${inputCls} pl-10`} />
        </div>
        <select
          value={role ? `role:${role}` : type}
          onChange={(e) => {
            const v = e.target.value;
            if (v.startsWith("role:")) setRole(v.slice(5));
            else {
              setRole("");
              setType(v as "staff" | "customer");
            }
            setPage(1);
          }}
          className={`${inputCls} w-auto`}
        >
          <option value="staff">All staff</option>
          <option value="customer">Customers</option>
          {roleOptions.map((r) => (
            <option key={r.key} value={`role:${r.key}`}>
              Role: {r.name}
            </option>
          ))}
        </select>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : list.error ? (
          <p className="p-6 text-sm font-semibold text-rose-700">{list.error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Person</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Since</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(list.data?.items ?? []).map((a) => {
                  const self = a._id === user?.id;
                  return (
                    <tr key={a._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-black text-brand-dark">{initials(a.fullName)}</span>
                          <div>
                            <div className="font-bold text-slate-900">
                              {a.fullName} {self && <span className="text-[11px] font-semibold text-slate-400">(you)</span>}
                            </div>
                            <div className="text-xs text-slate-500">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={a.role}
                          disabled={self}
                          title={self ? "You can't change your own role" : undefined}
                          onChange={(e) => changeRole(a, e.target.value)}
                          className={`${inputCls} h-9 w-44`}
                          aria-label={`Role for ${a.fullName}`}
                        >
                          {roleOptions.map((r) => (
                            <option key={r.key} value={r.key}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill tone={a.isEmailVerified ? "success" : "warning"}>{a.isEmailVerified ? "Verified" : "Unverified"}</StatusPill>
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-500">{formatDate(a.createdAt)}</td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => setViewing(a._id)} className="text-xs font-bold text-brand-dark hover:underline">
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!list.data?.items.length && <EmptyRow colSpan={5}>Nobody matches.</EmptyRow>}
              </tbody>
            </table>
          </div>
        )}
        {list.data && list.data.totalPages > 1 && (
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        )}
      </div>

      {adding && (
        <AddStaff
          roles={roleOptions.filter((r) => r.key !== "user")}
          onClose={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            void list.reload();
          }}
        />
      )}
      {viewing && <AccountDetail id={viewing} onClose={() => setViewing(null)} onSaved={() => void list.reload()} />}
    </div>
  );
}

function AddStaff({ roles, onClose, onSaved }: { roles: { key: string; name: string }[]; onClose: () => void; onSaved: () => void }) {
  const run = useAdminAction();
  const [saving, setSaving] = useState(false);
  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    const r = await run(
      () =>
        staffApi.create({
          fullName: String(fd.get("fullName")).trim(),
          email: String(fd.get("email")).trim(),
          password: String(fd.get("password")),
          role: String(fd.get("role")),
        }),
      (x) => `${x.data.fullName} can now sign in as ${x.data.roleName}`
    );
    setSaving(false);
    if (r) onSaved();
  };
  return (
    <Modal title="Add staff account" onClose={onClose}>
      <form onSubmit={save} className="space-y-3">
        <input name="fullName" required minLength={2} placeholder="Full name" className={inputCls} />
        <input name="email" type="email" required placeholder="email@example.com" className={inputCls} />
        <input
          name="password"
          type="password"
          required
          minLength={8}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
          title="8+ characters with upper case, lower case and a number"
          placeholder="Temporary password"
          className={inputCls}
        />
        <select name="role" required defaultValue={roles.find((r) => r.key === "sales")?.key ?? roles[0]?.key} className={inputCls}>
          {roles.map((r) => (
            <option key={r.key} value={r.key}>
              {r.name}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500">
          The account is created already verified. To give an existing customer access, change their role from the Customers filter instead.
        </p>
        <div className="flex justify-end">
          <button disabled={saving} className={btn.brand}>
            {saving ? "Creating…" : "Create account"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AccountDetail({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const run = useAdminAction();
  const account = useAsync(() => staffApi.get(id), [id]);
  const [name, setName] = useState<string | null>(null);
  const a = account.data;
  return (
    <Modal title={a ? a.fullName : "Account"} onClose={onClose}>
      {account.loading ? (
        <Loader />
      ) : !a ? (
        <p className="text-sm text-rose-700">{account.error}</p>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="text-slate-600">
            {a.email} · {a.roleName}
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name?.trim()) return;
              if (await run(() => staffApi.update(a._id, { fullName: name.trim() }), "Name updated")) {
                void account.reload();
                onSaved();
              }
            }}
            className="flex gap-2"
          >
            <input value={name ?? a.fullName} onChange={(e) => setName(e.target.value)} className={inputCls} aria-label="Full name" />
            <button className={btn.secondary}>Rename</button>
          </form>
          <div>
            <div className="mb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">Effective permissions</div>
            <div className="flex flex-wrap gap-1">
              {(a.permissions ?? []).length ? (
                a.permissions!.map((p) => (
                  <span key={p} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {p}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None — no dashboard access</span>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
