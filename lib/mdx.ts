import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { MDXComponents } from "@/components/MDXComponents";

export async function renderMDX(source: string) {
  const { content } = await compileMDX({
    source,
    components: MDXComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark-dimmed",
              keepBackground: true,
            },
          ],
        ],
      },
    },
  });

  return content;
}
