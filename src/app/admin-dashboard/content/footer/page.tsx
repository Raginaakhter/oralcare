"use client";

import { useState } from "react";
import {
  footerApi,
  SOCIAL_PLATFORMS,
  type FooterLink,
  type FooterSection,
  type FooterSettings,
  type PaymentLogo,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/api";
import { humanize } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, EditIcon, PlusIcon } from "../../AdminHeader";
import { DeleteButton } from "../../DeleteButton";
import { FormCard, Field, Textarea, FormRow, Toggle, opt, bool, str, num } from "../../AdminForm";
import { Loader, Modal, btn, inputCls, useAdminAction } from "../../AdminShell";
import { ImageUploadField } from "../../ImageUploadField";

export default function FooterAdminPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Content" }, { label: "Footer" }]}
        title="Footer"
        description="Everything in the storefront footer (served from GET /footer)."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsCard />
        <div className="space-y-6">
          <SectionsCard />
          <SocialCard />
          <PaymentLogosCard />
        </div>
      </div>
    </div>
  );
}

// ─── Settings ──────────────────────────────────────────────

function SettingsCard() {
  const run = useAdminAction();
  const settings = useAsync(() => footerApi.getSettings().catch(() => ({}) as FooterSettings), []);
  const [saving, setSaving] = useState(false);
  if (settings.loading) return <Loader />;
  const s = settings.data ?? {};

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body: FooterSettings = {};
    const keys = [
      "logo",
      "description",
      "backgroundColor",
      "textColor",
      "linkColor",
      "contactEmail",
      "contactPhone",
      "whatsappNumber",
      "businessAddress",
      "googleMapsUrl",
      "copyrightText",
      "newsletterTitle",
      "newsletterDescription",
      "newsletterButtonText",
    ] as const;
    for (const k of keys) {
      const v = opt(fd, k);
      if (v !== undefined) (body as Record<string, unknown>)[k] = v;
    }
    body.newsletterEnabled = bool(fd, "newsletterEnabled");
    body.isActive = bool(fd, "isActive");
    setSaving(true);
    const r = await run(() => footerApi.updateSettings(body), "Footer settings saved");
    setSaving(false);
    if (r) settings.setData(r.data);
  };

  return (
    <form onSubmit={save}>
      <FormCard
        title="Settings"
        description="Brand, contact details and colours."
        action={
          <button disabled={saving} className={btn.brand}>
            {saving ? "Saving…" : "Save"}
          </button>
        }
      >
        <ImageUploadField kind="footer" label="Logo" name="logo" defaultValue={s.logo} />
        <Textarea label="Description" name="description" rows={3} defaultValue={s.description} />
        <FormRow>
          <Field label="Contact email" name="contactEmail" type="email" defaultValue={s.contactEmail} />
          <Field label="Contact phone" name="contactPhone" defaultValue={s.contactPhone} />
        </FormRow>
        <FormRow>
          <Field label="WhatsApp number" name="whatsappNumber" defaultValue={s.whatsappNumber} />
          <Field label="Google Maps URL" name="googleMapsUrl" type="url" defaultValue={s.googleMapsUrl} />
        </FormRow>
        <Field label="Business address" name="businessAddress" defaultValue={s.businessAddress} />
        <Field label="Copyright text" name="copyrightText" defaultValue={s.copyrightText} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Background" name="backgroundColor" defaultValue={s.backgroundColor} placeholder="#ffffff" />
          <Field label="Text colour" name="textColor" defaultValue={s.textColor} placeholder="#334155" />
          <Field label="Link colour" name="linkColor" defaultValue={s.linkColor} placeholder="#0e7c86" />
        </div>
        <Toggle label="Newsletter block" name="newsletterEnabled" defaultChecked={s.newsletterEnabled} />
        <FormRow>
          <Field label="Newsletter title" name="newsletterTitle" defaultValue={s.newsletterTitle} />
          <Field label="Button text" name="newsletterButtonText" defaultValue={s.newsletterButtonText} />
        </FormRow>
        <Field label="Newsletter description" name="newsletterDescription" defaultValue={s.newsletterDescription} />
        <Toggle label="Footer active" name="isActive" defaultChecked={s.isActive ?? true} />
      </FormCard>
    </form>
  );
}

// ─── Reorder helper ────────────────────────────────────────

function useReorder<T extends { _id: string; displayOrder: number }>(
  items: T[],
  save: (items: { id: string; displayOrder: number }[]) => Promise<unknown>,
  reload: () => void
) {
  const run = useAdminAction();
  return async (index: number, dir: -1 | 1) => {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    if (await run(() => save(next.map((x, i) => ({ id: x._id, displayOrder: i }))), "Order saved")) reload();
  };
}

function Arrows({ i, n, move }: { i: number; n: number; move: (i: number, d: -1 | 1) => void }) {
  return (
    <span className="flex flex-col">
      <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="px-1 text-[10px] text-slate-400 disabled:opacity-30" aria-label="Move up">
        ▲
      </button>
      <button type="button" disabled={i === n - 1} onClick={() => move(i, 1)} className="px-1 text-[10px] text-slate-400 disabled:opacity-30" aria-label="Move down">
        ▼
      </button>
    </span>
  );
}

// ─── Sections ──────────────────────────────────────────────

function SectionsCard() {
  const run = useAdminAction();
  const list = useAsync(() => footerApi.listSections(), []);
  const [editing, setEditing] = useState<FooterSection | "new" | null>(null);
  const items = [...(list.data ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
  const move = useReorder(items, footerApi.reorderSections, () => void list.reload());

  return (
    <FormCard
      title="Link sections"
      description="Columns of links. The first two show as columns; the rest as a link row."
      action={
        <button type="button" onClick={() => setEditing("new")} className={btn.secondary}>
          <PlusIcon /> Section
        </button>
      }
    >
      {list.loading ? (
        <Loader />
      ) : (
        <ul className="space-y-2">
          {items.map((s, i) => (
            <li key={s._id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Arrows i={i} n={items.length} move={move} />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900">{s.title}</div>
                <div className="line-clamp-1 text-xs text-slate-500">{s.links.map((l) => l.title).join(" · ") || "No links"}</div>
              </div>
              {!s.isActive && <StatusPill tone="neutral">Hidden</StatusPill>}
              <button
                type="button"
                onClick={async () => {
                  // Fresh copy (GET /admin/footer/sections/:id) so links changed elsewhere are not lost.
                  const fresh = await run(() => footerApi.getSection(s._id));
                  if (fresh) setEditing(fresh);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-white"
                aria-label="Edit"
              >
                <EditIcon />
              </button>
              <DeleteButton
                itemLabel={s.title}
                onConfirm={async () => {
                  const ok = await run(() => footerApi.removeSection(s._id), "Section deleted");
                  if (ok) void list.reload();
                  return !!ok;
                }}
              />
            </li>
          ))}
          {!items.length && <li className="text-sm text-slate-500">No sections — the storefront uses its default columns.</li>}
        </ul>
      )}
      {editing && (
        <SectionDialog
          section={editing === "new" ? undefined : editing}
          nextOrder={items.length}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void list.reload();
          }}
        />
      )}
    </FormCard>
  );
}

function SectionDialog({
  section,
  nextOrder,
  onClose,
  onSaved,
}: {
  section?: FooterSection;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const run = useAdminAction();
  const [title, setTitle] = useState(section?.title ?? "");
  const [isActive, setIsActive] = useState(section?.isActive ?? true);
  const [links, setLinks] = useState<Pick<FooterLink, "title" | "url" | "target" | "isActive">[]>(
    [...(section?.links ?? [])]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((l) => ({ title: l.title, url: l.url, target: l.target, isActive: l.isActive }))
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const body = {
      title: title.trim(),
      isActive,
      links: links.filter((l) => l.title.trim() && l.url.trim()).map((l, i) => ({ ...l, displayOrder: i })),
    };
    setSaving(true);
    const r = await run(
      () => (section ? footerApi.updateSection(section._id, body) : footerApi.createSection({ ...body, displayOrder: nextOrder })),
      section ? "Section updated" : "Section created"
    );
    setSaving(false);
    if (r) onSaved();
  };

  return (
    <Modal title={section ? `Edit "${section.title}"` : "New section"} onClose={onClose} wide>
      <div className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Section title" className={inputCls} />
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-brand" /> Visible
        </label>
        {links.map((l, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto_auto]">
            <input
              value={l.title}
              onChange={(e) => setLinks((ls) => ls.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
              placeholder="Label"
              className={inputCls}
            />
            <input
              value={l.url}
              onChange={(e) => setLinks((ls) => ls.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
              placeholder="/shop or https://…"
              className={inputCls}
            />
            <select
              value={l.target}
              onChange={(e) => setLinks((ls) => ls.map((x, j) => (j === i ? { ...x, target: e.target.value as "_self" | "_blank" } : x)))}
              className={inputCls}
            >
              <option value="_self">Same tab</option>
              <option value="_blank">New tab</option>
            </select>
            <button type="button" onClick={() => setLinks((ls) => ls.filter((_, j) => j !== i))} className={btn.danger}>
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLinks((ls) => [...ls, { title: "", url: "", target: "_self", isActive: true }])}
          className={btn.secondary}
        >
          + Add link
        </button>
        <div className="flex justify-end">
          <button type="button" disabled={saving || !title.trim()} onClick={save} className={btn.brand}>
            {saving ? "Saving…" : "Save section"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Social links ──────────────────────────────────────────

function SocialCard() {
  const run = useAdminAction();
  const list = useAsync(() => footerApi.listSocial(), []);
  const [editing, setEditing] = useState<SocialLink | "new" | null>(null);
  const items = [...(list.data ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
  const move = useReorder(items, footerApi.reorderSocial, () => void list.reload());

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      platform: str(fd, "platform") as SocialPlatform,
      url: str(fd, "url"),
      ...(opt(fd, "customIcon") ? { customIcon: opt(fd, "customIcon") } : {}),
      isActive: bool(fd, "isActive"),
    };
    const r = await run(
      () =>
        editing === "new"
          ? footerApi.createSocial({ ...body, displayOrder: items.length })
          : footerApi.updateSocial((editing as SocialLink)._id, body),
      "Social link saved"
    );
    if (r) {
      setEditing(null);
      void list.reload();
    }
  };

  const current = editing && editing !== "new" ? editing : undefined;

  return (
    <FormCard
      title="Social links"
      action={
        <button type="button" onClick={() => setEditing("new")} className={btn.secondary}>
          <PlusIcon /> Link
        </button>
      }
    >
      {list.loading ? (
        <Loader />
      ) : (
        <ul className="space-y-2">
          {items.map((s, i) => (
            <li key={s._id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm">
              <Arrows i={i} n={items.length} move={move} />
              <span className="w-24 font-bold capitalize text-slate-900">{s.platform}</span>
              <span className="min-w-0 flex-1 truncate text-slate-500">{s.url}</span>
              {!s.isActive && <StatusPill tone="neutral">Hidden</StatusPill>}
              <button type="button" onClick={() => setEditing(s)} className="rounded-lg p-2 text-slate-500 hover:bg-white" aria-label="Edit">
                <EditIcon />
              </button>
              <DeleteButton
                itemLabel={s.platform}
                onConfirm={async () => {
                  const ok = await run(() => footerApi.removeSocial(s._id), "Social link deleted");
                  if (ok) void list.reload();
                  return !!ok;
                }}
              />
            </li>
          ))}
          {!items.length && <li className="text-sm text-slate-500">No social links yet.</li>}
        </ul>
      )}
      {editing && (
        <Modal title={current ? "Edit social link" : "New social link"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <select name="platform" defaultValue={current?.platform ?? "facebook"} className={inputCls}>
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {humanize(p)}
                </option>
              ))}
            </select>
            <input name="url" type="url" required defaultValue={current?.url} placeholder="https://facebook.com/…" className={inputCls} />
            <ImageUploadField kind="footer" label="Custom icon (optional)" name="customIcon" defaultValue={current?.customIcon} />
            <Toggle label="Visible" name="isActive" defaultChecked={current?.isActive ?? true} />
            <div className="flex justify-end">
              <button className={btn.brand}>Save</button>
            </div>
          </form>
        </Modal>
      )}
    </FormCard>
  );
}

// ─── Payment logos ─────────────────────────────────────────

function PaymentLogosCard() {
  const run = useAdminAction();
  const list = useAsync(() => footerApi.listPaymentLogos(), []);
  const [editing, setEditing] = useState<PaymentLogo | "new" | null>(null);
  const items = [...(list.data ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      name: str(fd, "name"),
      imageUrl: str(fd, "imageUrl"),
      ...(opt(fd, "altText") ? { altText: opt(fd, "altText") } : {}),
      displayOrder: num(fd, "displayOrder") ?? items.length,
      isActive: bool(fd, "isActive"),
    };
    const r = await run(
      () => (editing === "new" ? footerApi.createPaymentLogo(body) : footerApi.updatePaymentLogo((editing as PaymentLogo)._id, body)),
      "Payment logo saved"
    );
    if (r) {
      setEditing(null);
      void list.reload();
    }
  };

  const current = editing && editing !== "new" ? editing : undefined;

  return (
    <FormCard
      title="Payment logos"
      action={
        <button type="button" onClick={() => setEditing("new")} className={btn.secondary}>
          <PlusIcon /> Logo
        </button>
      }
    >
      {list.loading ? (
        <Loader />
      ) : (
        <ul className="flex flex-wrap gap-3">
          {items.map((p) => (
            <li key={p._id} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 pr-1 text-xs">
              <span className="relative h-8 w-14 overflow-hidden rounded bg-white">
                <SmartImage src={p.imageUrl} alt={p.altText || p.name} fill sizes="56px" className="object-contain" />
              </span>
              <span className={`font-bold ${p.isActive ? "text-slate-900" : "text-slate-400 line-through"}`}>{p.name}</span>
              <button type="button" onClick={() => setEditing(p)} className="rounded-lg p-1.5 text-slate-500 hover:bg-white" aria-label="Edit">
                <EditIcon />
              </button>
              <DeleteButton
                itemLabel={p.name}
                onConfirm={async () => {
                  const ok = await run(() => footerApi.removePaymentLogo(p._id), "Payment logo deleted");
                  if (ok) void list.reload();
                  return !!ok;
                }}
              />
            </li>
          ))}
          {!items.length && <li className="text-sm text-slate-500">No logos — text badges are shown instead.</li>}
        </ul>
      )}
      {editing && (
        <Modal title={current ? `Edit ${current.name}` : "New payment logo"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <input name="name" required defaultValue={current?.name} placeholder="bKash" className={inputCls} />
            <ImageUploadField kind="footer" label="Logo image" name="imageUrl" required defaultValue={current?.imageUrl} />
            <input name="altText" defaultValue={current?.altText} placeholder="Alt text" className={inputCls} />
            <input name="displayOrder" type="number" min={0} defaultValue={current?.displayOrder ?? items.length} className={inputCls} aria-label="Display order" />
            <Toggle label="Visible" name="isActive" defaultChecked={current?.isActive ?? true} />
            <div className="flex justify-end">
              <button className={btn.brand}>Save</button>
            </div>
          </form>
        </Modal>
      )}
    </FormCard>
  );
}
