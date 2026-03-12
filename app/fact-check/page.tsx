import type { Metadata } from "next";
import Link from "next/link";
import { getFactCheckStories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Fact Check | Byte Bulletin",
  description: "Verify viral claims with evidence-led explainers focused on India-first misinformation trends.",
};

function verdictClass(verdict: string) {
  switch (verdict) {
    case "True":
      return "bg-[#1f6a3b] text-[#e4ffef]";
    case "False":
      return "bg-[#8b1f1f] text-[#ffecec]";
    case "Misleading":
      return "bg-[#8a4a11] text-[#fff1df]";
    default:
      return "bg-[#33475b] text-[#e7f1fc]";
  }
}

export default async function FactCheckPage() {
  const checks = await getFactCheckStories(20);

  return (
    <main className="mx-auto max-w-[88rem] px-5 py-12 sm:px-7 lg:px-10">
      <div className="border-b border-border pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Byte Bulletin Verify</p>
        <h1 className="mt-2 text-5xl">Fact Check</h1>
        <p className="mt-2 max-w-3xl text-muted">
          Evidence-first checks for viral claims, policy rumors, and manipulated narratives relevant to Indian readers.
        </p>
      </div>

      <section className="mt-10 grid auto-rows-fr gap-6 md:grid-cols-2">
        {checks.map((check) => (
          <article key={check.slug} className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${verdictClass(check.verdict)}`}>
                {check.verdict}
              </span>
              <span className="text-sm text-muted">{check.publishedAt}</span>
            </div>
            <h2 className="mt-3 text-3xl leading-tight">{check.title}</h2>
            <p className="mt-3 text-base text-muted">Claim: {check.claim}</p>
            <p className="mt-3 text-base text-[#2c3f50]">{check.summary}</p>
            <p className="mt-3 text-base text-muted">{check.explanation}</p>
            <div className="mt-auto space-y-2 pt-5">
              {check.evidence.map((item) => (
                <a
                  key={`${check.slug}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base font-semibold text-brand hover:underline"
                >
                  Source: {item.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm font-semibold text-brand hover:underline">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
