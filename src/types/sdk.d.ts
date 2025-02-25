export type MatterportSDK = {
	connect: (
		iframe: HTMLIFrameElement | null,
		key: string,
		password?: string
	) => Promise<any>
}
