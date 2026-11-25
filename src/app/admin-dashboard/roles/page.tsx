"use client";

import React, { useState } from "react";
import Link from "next/link";
import { rolesApi, type Permission, type PermissionDef, type Role } from "@/lib/api";
import { useAsync } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { AdminHeader, StatusPill, PlusIcon, EditIcon } from "../AdminHeader";
import { DeleteButton } from "../DeleteButton";
import { Loader, Modal, btn, inputCls, useAdminAction } from "../AdminShell";

export default function RolesPage() {
  const { can } = useAuth();
  const run = useAdminAction();
  const roles = useAsync(() => rolesApi.list(), []);
  const perms = useAsync(() => rolesApi.permissions(), []);
  const [editing, setEditing] = useState<Role | "new" | null>(null);

  if (!can("staff:manage")) return <p className="rounded-2xl bg-amber-50 p-5 text-sm font-semibold text-amber-800">Only admins can manage roles.</p>;

  const labelOf = (key: Permission) => perms.data?.find((p) => p.key === key)?.label ?? key;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Roles & Permissions" }]}
        title="Roles & Permissions"
        description="A role is a set of permissions. Changes apply to everyone with that role on their next request."
        actions={
          <>
            <Link href="/admin-dashboard/staff" className={btn.secondary}>
              Staff accounts
            </Link>
            <button onClick={() => setEditing("new")} className={btn.primary}>
              <PlusIcon /> New role
            </button>
          </>
        }
      />

      {roles.loading || perms.loading ? (
        <Loader />
      ) : roles.error ? (
        <p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{roles.error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(roles.data ?? []).map((r) => (
            <section key={r.key} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">{r.name}</h2>
                    <span className="font-mono text-[11px] text-slate-400">{r.key}</span>
                  </div>
                  {r.description && <p className="mt-1 text-xs text-slate-500">{r.description}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  {r.isSystem ? <StatusPill tone="neutral">Locked</StatusPill> : r.isBuiltIn ? <StatusPill tone="info">Built-in</StatusPill> : <StatusPill tone="accent">Custom</StatusPill>}
                  <StatusPill tone="neutral">
                    {r.userCount} user{r.userCount === 1 ? "" : "s"}
                  </StatusPill>
                </div>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1">
                {r.permissions.length ? (
                  r.permissions.map((p) => (
                    <li key={p} title={labelOf(p)} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {p}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400">No dashboard permissions</li>
                )}
              </ul>
              <div className="mt-4 flex gap-2">
                {!r.isSystem && (
                  <button onClick={() => setEditing(r)} className={btn.secondary}>
                    <EditIcon /> Edit
                  </button>
                )}
                <Link href={`/admin-dashboard/staff?role=${r.key}`} className={btn.secondary}>
                  View users
                </Link>
                {!r.isBuiltIn && (
                  <DeleteButton
                    variant="button"
                    itemLabel={`the “${r.name}” role`}
                    body={r.userCount ? `${r.userCount} user(s) still have this role — move them to another role first.` : undefined}
                    onConfirm={async () => {
                      const ok = await run(() => rolesApi.remove(r.key), "Role deleted");
                      if (ok) void roles.reload();
                      return !!ok;
                    }}
                  />
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {editing && perms.data && (
        <RoleEditor
          role={editing === "new" ? undefined : editing}
          permissions={perms.data}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void roles.reload();
          }}
        />
      )}
    </div>
  );
}

function RoleEditor({
  role,
  permissions,
  onClose,
  onSaved,
}: {
  role?: Role;
  permissions: PermissionDef[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const run = useAdminAction();
  const [saving, setSaving] = useState(false);
  const groups = Array.from(new Set(permissions.map((p) => p.group)));
  const has = new Set(role?.permissions ?? ["dashboard:access"]);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name")).trim();
    const description = String(fd.get("description") ?? "").trim();
    const key = String(fd.get("key") ?? "").trim();
    const perms = fd.getAll("permissions").map(String) as Permission[];
    setSaving(true);
    const r = await run(
      () =>
        role
          ? rolesApi.update(role.key, { name, description, permissions: perms })
          : rolesApi.create({ name, ...(description ? { description } : {}), ...(key ? { key } : {}), permissions: perms }),
      role ? "Role updated" : "Role created"
    );
    setSaving(false);
    if (r) onSaved();
  };

  return (
    <Modal title={role ? `Edit role: ${role.name}` : "New role"} onClose={onClose} wide>
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Name *</span>
            <input name="name" required minLength={2} maxLength={60} defaultValue={role?.name} placeholder="e.g. Content Editor" className={inputCls} />
          </label>
          {!role && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Key</span>
              <input name="key" pattern="[a-z][a-z0-9-]{1,39}" placeholder="auto from name" className={inputCls} />
            </label>
          )}
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-slate-700">Description</span>
          <input name="description" maxLength={300} defaultValue={role?.description} className={inputCls} />
        </label>
        <div className="space-y-3">
          {groups.map((g) => (
            <fieldset key={g} className="rounded-xl bg-slate-50 p-3">
              <legend className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{g}</legend>
              {permissions
                .filter((p) => p.group === g)
                .map((p) => (
                  <label key={p.key} className={`flex items-start gap-2 py-1 text-sm ${p.assignable ? "text-slate-700" : "text-slate-400"}`}>
                    <input
                      type="checkbox"
                      name="permissions"
                      value={p.key}
                      disabled={!p.assignable}
                      defaultChecked={has.has(p.key)}
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />
                    <span>
                      {p.label}
                      <span className="ml-1 font-mono text-[10px] text-slate-400">{p.key}</span>
                      {!p.assignable && <span className="ml-1 text-[10px]">(admins only)</span>}
                    </span>
                  </label>
                ))}
            </fieldset>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">Without “Open the admin dashboard”, people with this role can&apos;t sign in to the dashboard.</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={btn.secondary}>
            Cancel
          </button>
          <button disabled={saving} className={btn.brand}>
            {saving ? "Saving…" : "Save role"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
