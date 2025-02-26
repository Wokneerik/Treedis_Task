type Position = { x: number; y: number; z: number }

export const addSphereInPath = async (
	mpSdkInstance: any,
	path: string[],
	sweepsData: Record<string, { position: Position }>
) => {
	const spheres: any[] = []
	const sphereSpacing = 0.5

	for (let i = 0; i < path.length - 1; i++) {
		const currentSweepId = path[i]
		const nextSweepId = path[i + 1]

		if (!currentSweepId || !nextSweepId) continue

		const currentPosition = sweepsData[currentSweepId].position
		const nextPosition = sweepsData[nextSweepId].position

		if (!currentPosition || !nextPosition) continue

		const direction = {
			x: nextPosition.x - currentPosition.x,
			y: nextPosition.y - currentPosition.y,
			z: nextPosition.z - currentPosition.z,
		}

		const segmentLength = Math.sqrt(
			direction.x ** 2 + direction.y ** 2 + direction.z ** 2
		)

		const unitDirection = {
			x: direction.x / segmentLength,
			y: direction.y / segmentLength,
			z: direction.z / segmentLength,
		}

		for (let d = 0; d < segmentLength; d += sphereSpacing) {
			const newPosition = {
				x: currentPosition.x + unitDirection.x * d,
				y: 0.3,
				z: currentPosition.z + unitDirection.z * d,
			}

			const [newSceneObject] = await mpSdkInstance.Scene.createObjects(1)
			const newModelNode = newSceneObject.addNode()

			const newSphereComponent = await newModelNode.addComponent(
				mpSdkInstance.Scene.Component.GLTF_LOADER,
				{
					url: '/models/sphere-blue.glb',
				}
			)

			newSphereComponent.inputs.localScale = {
				x: 0.0005,
				y: 0.0005,
				z: 0.0005,
			}

			newModelNode.obj3D.position.set(
				newPosition.x,
				newPosition.y,
				newPosition.z
			)
			newModelNode.start()

			spheres.push(newModelNode)
		}
	}
}
