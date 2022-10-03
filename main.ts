import { Editor, MarkdownView, Plugin } from "obsidian";
import { parseCode, parseMarkdown } from "src/parseMarkdown";
import { BASIC_VIEW_TYPE, BasicView } from "src/basicView";
import { CodepencilSettings, DEFAULT_SETTINGS, SettingTab } from "src/settings";

function debounce(func: Function, timeout = 300) {
	let timer: NodeJS.Timer;
	return (...args: any[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

export default class Codepencil extends Plugin {
	settings: CodepencilSettings;
	file: string;

	async activateBasicView(view: MarkdownView) {
		this.app.workspace.detachLeavesOfType(BASIC_VIEW_TYPE);
		const { leaf, data } = view;
		const root = parseMarkdown(data);
		const code = parseCode(root.children);

		this.app.workspace.createLeafBySplit(leaf).setViewState({
			type: BASIC_VIEW_TYPE,
			active: false,
			state: { code },
		});
	}

	async updateBasicView(view: MarkdownView) {
		if (this.file === view.file.name) {
			this.app.workspace
				.getLeavesOfType(BASIC_VIEW_TYPE)
				.forEach((leaf) => {
					if (leaf.view instanceof BasicView) {
						const root = parseMarkdown(view.data);
						const code = parseCode(root.children);
						leaf.setViewState({
							type: BASIC_VIEW_TYPE,
							state: { code },
						});
					}
				});
		}
	}

	async onload() {
		await this.loadSettings();
		this.registerView(BASIC_VIEW_TYPE, (leaf) => new BasicView(leaf));

		this.addCommand({
			id: "open-codepencil",
			name: "Open codepencil view",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.file = view.file.name;
				this.activateBasicView(view);
			},
		});

		const debouncedUpdateBasicView = debounce((view: MarkdownView) =>
			this.updateBasicView(view)
		);

		this.registerEvent(
			this.app.workspace.on("editor-change", (editor, view) => {
				debouncedUpdateBasicView(view);
			})
		);

		this.addSettingTab(new SettingTab(this.app, this));

		console.log("📝 Loaded codepencil");
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(BASIC_VIEW_TYPE);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
