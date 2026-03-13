import { Feed } from "feed";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteURL } from "@/lib/site-url";
import { stripMdxComponents } from "@/lib/strip-mdx";

export async function GET() {
  try {
    const posts = getAllPosts();

    const feed = new Feed({
      title: "Simon's Blog",
      description: "Blog technique sur le développement web",
      id: siteURL,
      link: siteURL,
      language: "fr",
      favicon: `${siteURL}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, Simon`,
      updated: new Date(),
      feedLinks: {
        rss2: `${siteURL}/feed.xml`,
      },
      author: {
        name: "Simon",
      },
    });

    posts.forEach((post) => {
      const postUrl = `${siteURL}/blog/${post.slug}`;

      let imageUrl: string | undefined;
      if (post.icon?.startsWith("http")) {
        imageUrl = post.icon;
      } else if (post.icon?.startsWith("/")) {
        imageUrl = `${siteURL}${post.icon}`;
      }

      let fullContent = post.excerpt;
      try {
        const full = getPostBySlug(post.slug);
        fullContent = stripMdxComponents(full.content);
      } catch {
        // fallback to excerpt
      }

      feed.addItem({
        title: post.title,
        id: postUrl,
        link: postUrl,
        description: post.excerpt,
        content: fullContent,
        author: [
          {
            name: post.authorName || "Simon",
          },
        ],
        date: new Date(post.date),
        image: imageUrl,
      });
    });

    return new Response(feed.rss2(), {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=1200",
      },
    });
  } catch (error) {
    console.error('RSS feed generation failed', error);
    return new Response('Internal server error', { status: 500 });
  }
}
