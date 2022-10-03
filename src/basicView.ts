import { ItemView, ViewStateResult, WorkspaceLeaf } from "obsidian";

export const BASIC_VIEW_TYPE = "codepencil-basic-view";

export interface BasicViewState {
	code: {
		html: string;
		css: string;
		js: string;
	};
	filename: string;
}

export class BasicView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	async setState(
		state: BasicViewState,
		result: ViewStateResult
	): Promise<void> {
		await super.setState(state, result);

		const container = this.containerEl.children[1];
		container.empty();

		const html = container.createDiv();
		html.innerHTML = state.code.html;
		container.createEl("script", {
			text: state.code.js,
		});
		container.createEl("style", {
			text: state.code.css,
		});
	}

	getViewType() {
		return BASIC_VIEW_TYPE;
	}

	getDisplayText() {
		return `Render`;
	}

	getIcon(): string {
		return "checkmark";
	}

	async onOpen() {}

	async onClose() {}
}
