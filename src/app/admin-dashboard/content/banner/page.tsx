import Image from "next/image";
import Link from "next/link";
import {
  AdminHeader,
  AdminButton,
  StatusPill,
  PlusIcon,
  EditIcon,
  EyeIcon,
} from "../../AdminHeader";
import { DeleteButton } from "../../DeleteButton";
import { heroSlides } from "./data";

export const metadata = { title: "Hero Banner — Admin — OralCareBD" };

export default function BannerPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-dashboard" },
          { label: "Content" },
          { label: "Banner / Hero" },
        ]}
        title="Hero Banner"
        description={`${heroSlides.filter((s) => s.published).length} of ${heroSlides.length} slides live on homepage.`}
        actions={
          <>
            <AdminButton icon={<EyeIcon />}>Preview Live</AdminButton>
            <Link
              href="/admin-dashboard/content/banner/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              <PlusIcon />
              Add Slide
            </Link>
          </>
        }
      />

      {/* Carousel settings card */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-soft via-white to-brand-blue-soft p-6 ring-1 ring-emerald-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
              Carousel Settings
            </div>
            <h3 className="mt-1 text-base font-black text-slate-900">
              Auto-rotate every 6.5s · Fade transition
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Global settings apply to all slides. Edit individual slides below.
            </p>
          </div>
          <button className="rounded-xl border border-white bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-brand hover:text-brand-dark">
            Edit Settings
          </button>
        </div>
      </div>

      {/* Slide cards */}
      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60"
          >
            {/* Image preview */}
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <Image
                src={slide.img}
                alt={slide.alt}
                fill
                sizes="(min-width:1536px) 33vw, (min-width:1024px) 50vw, 100vw"
                style={{ objectPosition: slide.objectPosition }}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/85 via-slate-900/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur ring-1 ring-white/20">
                  {slide.tag}
                </span>
                <div className="mt-2 text-sm font-black text-white drop-shadow sm:text-base">
                  {slide.titleLine1}
                </div>
                <div className="text-sm font-black text-brand drop-shadow sm:text-base">
                  {slide.titleLine2}
                </div>
              </div>
              <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-black text-slate-900 shadow backdrop-blur">
                {i + 1}
              </div>
            </div>

            {/* Meta */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs text-slate-500">
                    {slide.description}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusPill tone={slide.published ? "success" : "neutral"}>
                      {slide.published ? "Published" : "Draft"}
                    </StatusPill>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      Order: {slide.order}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Primary CTA</div>
                  <div className="mt-0.5 truncate font-bold text-slate-900">{slide.ctaLabel}</div>
                  <div className="truncate font-mono text-[10px] text-slate-500">{slide.ctaHref}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Secondary</div>
                  <div className="mt-0.5 truncate font-bold text-slate-900">{slide.secondaryLabel}</div>
                  <div className="truncate font-mono text-[10px] text-slate-500">{slide.secondaryHref}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/admin-dashboard/content/banner/${i}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark"
                >
                  <EditIcon />
                  Edit Slide
                </Link>
                <DeleteButton itemLabel={`Slide: ${slide.titleLine1}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
