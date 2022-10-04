import Codepencil from "main";
import { PluginSettingTab, App, Setting, SplitDirection } from "obsidian";

export interface CodepencilSettings {
	split: SplitDirection;
}

export const DEFAULT_SETTINGS: CodepencilSettings = {
	split: "vertical",
};

export class SettingTab extends PluginSettingTab {
	plugin: Codepencil;

	constructor(app: App, plugin: Codepencil) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Codepencil settings" });

		new Setting(containerEl)
			.setName("Panel split direction")
			.setDesc("Which direction to split the new panel into")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						vertical: "Vertically",
						horizontal: "Horizontally",
					})
					.setValue(this.plugin.settings.split)
					.onChange(async (value: SplitDirection) => {
						this.plugin.settings.split = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
