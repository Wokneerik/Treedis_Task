export type MatterportSDK = {
	connect: (
		iframe: HTMLIFrameElement | null,
		key: string,
		password?: string
	) => Promise<any>
}

export type Mattertag = {
	label: string
	description?: string
	anchorPosition: { x: number; y: number; z: number }
	stemVector?: { x: number; y: number; z: number }
	color?: { r: number; g: number; b: number }
	stemHeight?: number
	size?: { diameter: number; height: number }
}

export interface TagPosition {
	x: number
	y: number
	z: number
}
