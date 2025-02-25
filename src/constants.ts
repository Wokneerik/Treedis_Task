import { Mattertag, TagPosition } from './types/sdk'

export const tagPosition: TagPosition = {
	x: 10,
	y: 0.2,
	z: -1,
}

export const tagData: Mattertag = {
	label: 'Office',
	description: 'Office Area',
	anchorPosition: tagPosition,
	stemVector: { x: 0, y: 1.4, z: 0 },
	color: { r: 0, g: 255, b: 0 },
	stemHeight: 2.0,
	size: {
		diameter: 8,
		height: 8,
	},
}
