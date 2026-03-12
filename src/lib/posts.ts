import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  excerpt: string;
  icon: string | null;
  author: string | null;
  authorName: string | null;
  readingTime: number;
  draft: boolean;
  devOnly: boolean;
};

export type PostData = PostSummary & {
  content: string;
};

const getPostData = (filename: string) => {
  const slug = filename.replace(/\.mdx$/, "");
  const fileContents = fs.readFileSync(
    path.join(postsDirectory, filename),
    "utf8",
  );
  const { data, content } = matter(fileContents);

  const dateStr = data.date as string;
  const formattedDate = new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    slug,
    content,
    frontmatter: {
      title: data.title as string,
      date: dateStr,
      formattedDate,
      excerpt: data.excerpt as string,
      icon: (data.icon as string) || null,
      author: (data.author as string) || null,
      authorName: (data.authorName as string) || null,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      draft: (data.draft as boolean) || false,
      devOnly: (data.devOnly as boolean) || false,
    },
  };
};

const isPostVisible = (frontmatter: { draft: boolean; devOnly: boolean }) => {
  if (frontmatter.draft) return false;
  if (frontmatter.devOnly && process.env.VERCEL_ENV === "production")
    return false;
  return true;
};

export function getAllPosts(): PostSummary[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .flatMap((f) => {
      try {
        const { slug, frontmatter } = getPostData(f);
        return [{ slug, ...frontmatter }];
      } catch (e) {
        console.error(`Failed to parse ${f}:`, e);
        return [];
      }
    })
    .filter((p) => isPostVisible(p))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): PostData {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid slug: "${slug}"`);
  }
  const { content, frontmatter } = getPostData(`${slug}.mdx`);
  if (!isPostVisible(frontmatter)) {
    throw new Error(`Post "${slug}" is not available`);
  }
  return { slug, ...frontmatter, content };
}

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: "github-dark",
        keepBackground: true,
        onVisitLine(node: any) {
          if (node.children.length === 0)
            node.children = [{ type: "text", value: " " }];
        },
        onVisitHighlightedLine(node: any) {
          node.properties.className = [
            ...(node.properties.className || []),
            "line--highlighted",
          ];
        },
        onVisitHighlightedWord(node: any) {
          node.properties.className = ["word--highlighted"];
        },
      },
    ],
    [rehypeAutolinkHeadings, { properties: { className: ["anchor"] } }],
    () => (tree: any) => {
      const traverse = (node: any) => {
        if (!node?.children) return;
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          const isTitle =
            child.type === "element" &&
            (child.properties?.["data-rehype-pretty-code-title"] !==
              undefined ||
              child.properties?.["dataRehypePrettyCodeTitle"] !== undefined);

          if (isTitle) {
            const titleValue = (function getText(n: any): string {
              return n.type === "text"
                ? n.value
                : n.children?.map(getText).join("") || "";
            })(child);

            const preNode = node.children.slice(i + 1).find((n: any) => {
              if (n.tagName === "pre") return true;
              const findInnerPre = (inner: any): any =>
                inner.tagName === "pre" || inner.children?.find(findInnerPre);
              return findInnerPre(n);
            });

            if (preNode) {
              const targetPre =
                preNode.tagName === "pre"
                  ? preNode
                  : (function findPre(n: any): any {
                      return n.tagName === "pre"
                        ? n
                        : n.children?.map(findPre).find(Boolean);
                    })(preNode);

              if (targetPre) targetPre.properties["data-title"] = titleValue;
              node.children.splice(i, 1);
              i--;
            }
          } else traverse(child);
        }
      };
      traverse(tree);
    },
  ] as any[],
};
