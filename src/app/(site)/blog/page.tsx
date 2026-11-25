import { PageHero } from "@/components/SiteShell";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SparkIcon } from "@/components/icons";
import { getBlogPosts } from "@/lib/api/server";
import { BlogBrowser } from "./BlogBrowser";

export const metadata = {
  title: "Oral Care Articles & Smile Tips - OralCareBD",
  description: "Dentist-approved guides, product recommendations and expert advice for a healthier smile.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts({ limit: 50 });

  return (
    <>
      <PageHero
        title="Oral Care Articles & Smile Tips"
        subtitle="Dentist-approved guides, product recommendations and expert advice for a healthier smile."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Articles & Blog" }]}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <BlogBrowser posts={posts.items} />

        <section className="mt-16 rounded-3xl bg-gradient-to-r from-brand via-brand to-brand-blue-dark p-8 sm:p-12 text-center text-white shadow-xl shadow-brand/20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <SparkIcon className="h-3.5 w-3.5" />
            Weekly Dental Guide
          </span>
          <h3 className="mt-3 text-2xl font-black sm:text-3xl">Never Miss an Oral Health Tip</h3>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-white/90">
            Get dentist-verified advice, product comparisons and member-only discounts in your inbox.
          </p>
          <div className="mt-6 flex justify-center">
            <NewsletterForm source="blog" variant="onBrand" />
          </div>
        </section>
      </main>
    </>
  );
}
