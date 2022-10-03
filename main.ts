import { Editor, MarkdownView, Plugin } from "obsidian";
import { parseCode, parseMarkdown } from "src/parseMarkdown";
import { BASIC_VIEW_TYPE, BasicView } from "src/basicView";
import { CodepencilSettings, DEFAULT_SETTINGS, SettingTab } from "src/settings";

export default class Codepencil extends Plugin {
	settings: CodepencilSettings;

	async activateBasicView(view: MarkdownView) {
		this.app.workspace.detachLeavesOfType(BASIC_VIEW_TYPE);
		const { leaf, data } = view;
		const root = parseMarkdown(data);
		const code = parseCode(root.children);

		this.app.workspace.createLeafBySplit(leaf).setViewState({
			type: BASIC_VIEW_TYPE,
			active: false,
			state: { code, filename: "foo" },
		});
	}

	async onload() {
		await this.loadSettings();
		this.registerView(BASIC_VIEW_TYPE, (leaf) => new BasicView(leaf));

		this.addCommand({
			id: "open-codepencil",
			name: "Open codepencil view",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.activateBasicView(view);
			},
		});

		this.addSettingTab(new SettingTab(this.app, this));
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
