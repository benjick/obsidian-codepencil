import { fromMarkdown } from "mdast-util-from-markdown";
import { frontmatter } from "micromark-extension-frontmatter";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { Code as CodeContent, Content } from "mdast-util-from-markdown/lib";

export function parseMarkdown(doc: string) {
	const tree = fromMarkdown(doc, {
		extensions: [frontmatter(["yaml", "toml"])],
		mdastExtensions: [frontmatterFromMarkdown(["yaml", "toml"])],
	});
	return tree;
}

export interface Code {
	html: string;
	css: string;
	js: string;
}

export function parseCode(content: Content[]): Code {
	const code = content.filter((i) => i.type === "code") as CodeContent[];
	const css = code
		.filter((i) => i.lang === "css")
		.map((i) => i.value)
		.join("\n\n");
	const html = code
		.filter((i) => i.lang === "html")
		.map((i) => i.value)
		.join("\n\n");
	const js = code
		.filter((i) => i.lang && ["js", "javascript"].includes(i.lang))
		.map((i) => i.value)
		.join("\n\n");

	return {
		html,
		css,
		js,
	};
}
