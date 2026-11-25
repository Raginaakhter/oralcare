"use client";

import React, { useState } from "react";
import Link from "next/link";
import { adminBlogApi, productsApi, type AdminBlogPost, type BlogPostInput, type BlogSection } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import { SmartImage } from "@/components/SmartImage";
import { AdminHeader, StatusPill, PlusIcon, EditIcon, SearchIcon } from "../../AdminHeader";
import { DeleteButton } from "../../DeleteButton";
import { Loader, Modal, Pagination, btn, inputCls, useAdminAction } from "../../AdminShell";
import { ImageUploadField } from "../../ImageUploadField";

export default function BlogAdminPage() {
  const run = useAdminAction();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("");
  const [published, setPublished] = useState<"" | "true" | "false">("");
  const [editing, setEditing] = useState<AdminBlogPost | "new" | null>(null);
  const list = useAsync(
    () =>
      adminBlogApi.list({
        page,
        limit: 20,
        search: applied || undefined,
        isPublished: published === "" ? undefined : published === "true",
      }),
    [page, applied, published]
  );

  const toggle = async (p: AdminBlogPost, field: "isPublished" | "isFeatured") => {
    if (await run(() => adminBlogApi.update(p._id, { [field]: !p[field] }), "Post updated")) void list.reload();
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AdminHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin-dashboard" }, { label: "Content" }, { label: "Blog" }]}
        title="Blog / Health Tips"
        description="Articles for /blog and the homepage “Stories & Smile Tips” section. Only published posts are visible."
        actions={
          <button onClick={() => setEditing("new")} className={btn.primary}>
            <PlusIcon /> New Post
          </button>
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
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title…" className={`${inputCls} pl-10`} />
        </div>
        <select
          value={published}
          onChange={(e) => {
            setPublished(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
          className={`${inputCls} w-auto`}
        >
          <option value="">All posts</option>
          <option value="true">Published</option>
          <option value="false">Drafts</option>
        </select>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70">
        {list.loading ? (
          <Loader />
        ) : (
          <ul className="divide-y divide-slate-100">
            {(list.data?.items ?? []).map((p) => (
              <li key={p._id} className="flex flex-wrap items-center gap-4 p-4">
                <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {p.coverImage && <SmartImage src={p.coverImage} alt="" fill sizes="80px" className="object-contain" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900">{p.title}</div>
                  <div className="text-xs text-slate-500">
                    {p.tag ? `${p.tag} · ` : ""}
                    {p.author} · {p.readMinutes} min · {p.isPublished && p.publishedAt ? `published ${formatDate(p.publishedAt)}` : "draft"}
                  </div>
                </div>
                <button onClick={() => toggle(p, "isPublished")}>
                  <StatusPill tone={p.isPublished ? "success" : "neutral"}>{p.isPublished ? "Published" : "Draft"}</StatusPill>
                </button>
                <button onClick={() => toggle(p, "isFeatured")}>
                  <StatusPill tone={p.isFeatured ? "accent" : "neutral"}>{p.isFeatured ? "Featured" : "Not featured"}</StatusPill>
                </button>
                {p.isPublished && (
                  <Link href={`/blog/${p.slug}`} target="_blank" className="text-xs font-bold text-brand-dark hover:underline">
                    View ↗
                  </Link>
                )}
                <button
                  onClick={async () => {
                    const fresh = await run(() => adminBlogApi.get(p._id));
                    if (fresh) setEditing(fresh);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Edit">
                  <EditIcon />
                </button>
                <DeleteButton
                  itemLabel={p.title}
                  onConfirm={async () => {
                    const ok = await run(() => adminBlogApi.remove(p._id), "Post deleted");
                    if (ok) void list.reload();
                    return !!ok;
                  }}
                />
              </li>
            ))}
            {!list.data?.items.length && <li className="p-10 text-center text-sm text-slate-500">No posts yet.</li>}
          </ul>
        )}
        {list.data && list.data.totalPages > 1 && (
          <Pagination page={list.data.page} totalPages={list.data.totalPages} total={list.data.total} onChange={setPage} />
        )}
      </div>

      {editing && (
        <PostEditor
          post={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void list.reload();
          }}
        />
      )}
    </div>
  );
}

function PostEditor({ post, onClose, onSaved }: { post?: AdminBlogPost; onClose: () => void; onSaved: () => void }) {
  const run = useAdminAction();
  const products = useAsync(() => productsApi.list({ limit: 100, sort: "newest" }), []);
  const [sections, setSections] = useState<BlogSection[]>(post?.sections.length ? post.sections : [{ heading: "", content: "" }]);
  const [saving, setSaving] = useState(false);

  const setSection = (i: number, patch: Partial<BlogSection>) =>
    setSections((ss) => ss.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const val = (k: string) => String(fd.get(k) ?? "").trim();
    const body: BlogPostInput = {
      title: val("title"),
      excerpt: val("excerpt"),
      author: val("author"),
      ...(val("slug") ? { slug: val("slug") } : {}),
      ...(val("tag") ? { tag: val("tag") } : {}),
      ...(val("authorRole") ? { authorRole: val("authorRole") } : {}),
      ...(val("coverImage") ? { coverImage: val("coverImage") } : {}),
      ...(val("accent") ? { accent: val("accent") } : {}),
      ...(val("metaTitle") ? { metaTitle: val("metaTitle") } : {}),
      ...(val("metaDescription") ? { metaDescription: val("metaDescription") } : {}),
      isPublished: fd.get("isPublished") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      recommendedProducts: fd.getAll("recommendedProducts").map(String),
      sections: sections
        .filter((s) => s.heading.trim() && s.content.trim())
        .map((s) => ({ heading: s.heading.trim(), content: s.content.trim(), ...(s.tip?.trim() ? { tip: s.tip.trim() } : {}) })),
    };
    setSaving(true);
    const r = await run(() => (post ? adminBlogApi.update(post._id, body) : adminBlogApi.create(body)), post ? "Post updated" : "Post created");
    setSaving(false);
    if (r) onSaved();
  };

  const selected = new Set(post?.recommendedProducts ?? []);

  return (
    <Modal title={post ? `Edit: ${post.title}` : "New post"} onClose={onClose} wide>
      <form onSubmit={save} className="space-y-4">
        <Text name="title" label="Title" required defaultValue={post?.title} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Text name="slug" label="Slug" defaultValue={post?.slug} hint="Auto-generated from the title if empty." />
          <Text name="tag" label="Tag" defaultValue={post?.tag} hint="e.g. Daily Habits, Whitening" />
          <Text name="author" label="Author" required defaultValue={post?.author} />
          <Text name="authorRole" label="Author role" defaultValue={post?.authorRole} />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-slate-700">
            Excerpt<span className="ml-1 text-rose-500">*</span>
          </span>
          <textarea name="excerpt" required minLength={10} maxLength={500} rows={2} defaultValue={post?.excerpt} className={`${inputCls} h-auto py-2`} />
        </label>
        <ImageUploadField kind="content" label="Cover image" name="coverImage" defaultValue={post?.coverImage} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-slate-700">Accent colour</span>
          <select name="accent" defaultValue={post?.accent ?? "emerald"} className={inputCls}>
            <option value="emerald">Green</option>
            <option value="blue">Blue</option>
          </select>
        </label>

        <fieldset className="space-y-3 rounded-2xl bg-slate-50 p-3">
          <legend className="px-1 text-xs font-black uppercase tracking-wider text-slate-500">Sections</legend>
          {sections.map((s, i) => (
            <div key={i} className="space-y-2 rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <input value={s.heading} onChange={(e) => setSection(i, { heading: e.target.value })} placeholder={`Section ${i + 1} heading`} className={inputCls} />
                <button type="button" onClick={() => setSections((ss) => ss.filter((_, j) => j !== i))} className={btn.danger} aria-label="Remove section">
                  ✕
                </button>
              </div>
              <textarea value={s.content} onChange={(e) => setSection(i, { content: e.target.value })} rows={4} placeholder="Content" className={`${inputCls} h-auto py-2`} />
              <input value={s.tip ?? ""} onChange={(e) => setSection(i, { tip: e.target.value })} placeholder="Dentist tip (optional)" className={inputCls} />
            </div>
          ))}
          <button type="button" onClick={() => setSections((ss) => [...ss, { heading: "", content: "" }])} className={btn.secondary}>
            + Add section
          </button>
        </fieldset>

        <fieldset>
          <span className="mb-1.5 block text-xs font-bold text-slate-700">Recommended products</span>
          {products.loading ? (
            <Loader label="Loading products…" />
          ) : (
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {(products.data?.items ?? []).map((p) => (
                <label key={p._id} className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" name="recommendedProducts" value={p._id} defaultChecked={selected.has(p._id)} className="accent-brand" />
                  {p.productName}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <Text name="metaTitle" label="SEO title" defaultValue={post?.metaTitle} />
          <Text name="metaDescription" label="SEO description" defaultValue={post?.metaDescription} />
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPublished" defaultChecked={post?.isPublished ?? false} className="h-4 w-4 accent-brand" /> Published
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" defaultChecked={post?.isFeatured ?? false} className="h-4 w-4 accent-brand" /> Featured on /blog
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={btn.secondary}>
            Cancel
          </button>
          <button disabled={saving} className={btn.brand}>
            {saving ? "Saving…" : "Save post"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Text({ name, label, required, defaultValue, hint }: { name: string; label: string; required?: boolean; defaultValue?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <input name={name} required={required} defaultValue={defaultValue ?? ""} className={inputCls} />
      {hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}
