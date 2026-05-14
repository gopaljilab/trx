import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { C } from "@/components/landing/tokens";
import { insetWell } from "@/app/landing-material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DocCodeBlock } from "@/components/landing/DocCodeBlock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const DOCS_ORDER = [
  "getting-started",
  "commands",
  "configuration",
  "architecture",
  "performance"
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${title} | TRX Docs`,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "docs", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const content = fs.readFileSync(filePath, "utf8");
  
  const currentIndex = DOCS_ORDER.indexOf(slug);
  const prevSlug = currentIndex > 0 ? DOCS_ORDER[currentIndex - 1] : null;
  const nextSlug = currentIndex < DOCS_ORDER.length - 1 ? DOCS_ORDER[currentIndex + 1] : null;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col">
        <Link 
          href="/docs" 
          className="lg:hidden flex items-center gap-2 text-sm text-white/40 hover:text-selection transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Back to Documentation
        </Link>
        
        <article className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:tracking-tight prose-h1:mb-12 prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8 prose-p:text-white/60 prose-p:leading-relaxed prose-li:text-white/60 prose-li:leading-relaxed prose-strong:text-white prose-code:text-selection">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold tracking-tight text-white mb-10 border-b border-white/5 pb-8">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-white mt-20 mb-8 flex items-center gap-3 group">
                  <span className="w-1 h-6 bg-selection/30 rounded-full group-hover:bg-selection transition-colors" style={{ backgroundColor: `${C.selection}44` }} />
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-white mt-12 mb-6">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-white/50 leading-relaxed mb-8 text-[16px]">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-none mb-10 space-y-4 text-white/50 ml-0">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="flex gap-3 text-[16px]">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-selection/40 shrink-0" style={{ backgroundColor: `${C.selection}66` }} />
                  <span>{children}</span>
                </li>
              ),
              code: (props) => {
                const {children, className, ...rest} = props;
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                
                if (isInline) {
                  return (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-[13px] text-selection font-mono" style={{ color: C.selection }}>
                      {children}
                    </code>
                  );
                }

                return (
                  <DocCodeBlock>
                    {children}
                  </DocCodeBlock>
                );
              },
              table: ({ children }) => (
                <div className="my-10 overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
                  <table className="w-full text-sm text-left text-white/70 border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-white/5 text-white/90 uppercase text-[11px] font-bold tracking-widest border-b border-white/10">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-6 py-4">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-6 py-4 border-b border-white/5">
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-selection bg-selection/[0.03] px-8 py-6 my-8 italic text-white/80 rounded-r-xl" style={{ borderColor: C.selection }}>
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => {
                const isInternal = href?.startsWith("./") || (href?.endsWith(".md") && !href?.startsWith("http"));
                let cleanHref = href;
                if (isInternal && href) {
                  cleanHref = "/docs/" + href.replace("./", "").replace(".md", "");
                }
                return (
                  <a href={cleanHref} className="text-selection hover:underline underline-offset-4 decoration-selection/30" style={{ color: C.selection }}>
                    {children}
                  </a>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-12 border-t border-white/5">
        {prevSlug ? (
          <Link href={`/docs/${prevSlug}`} className="group flex flex-col gap-2 items-start text-left">
            <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Previous</span>
            <span className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
              <ChevronLeft size={16} />
              {prevSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </span>
          </Link>
        ) : <div />}

        {nextSlug ? (
          <Link href={`/docs/${nextSlug}`} className="group flex flex-col gap-2 items-end text-right">
            <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Next</span>
            <span className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
              {nextSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              <ChevronRight size={16} />
            </span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
