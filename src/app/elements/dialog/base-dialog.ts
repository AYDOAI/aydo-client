export abstract class BaseDialogComponent {
	public componentIndex!: number;
	public destroy!: () => void;
	public close(): void {
		this.destroy();
	}
}
