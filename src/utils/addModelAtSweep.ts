export const addModelAtSweep = async (mpSdk: any) => {
	try {
		const [sceneObject] = await mpSdk.Scene.createObjects(1)

		const lights = sceneObject.addNode()
		lights.addComponent('mp.lights')

		const initial = {
			enabled: true,
			color: {
				r: 0.5,
				g: 0.5,
				b: 0.5,
			},
			intensity: 1.8,
		}

		lights.addComponent('mp.ambientLight', initial)

		lights.obj3D.rotation.y = Math.PI

		lights.start()

		const modelNode = sceneObject.addNode()

		const fbxComponent = modelNode.addComponent(
			mpSdk.Scene.Component.FBX_LOADER,
			{
				url: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/fbx/stanford-bunny.fbx',
			}
		)

		fbxComponent.inputs.localScale = {
			x: 0.00004,
			y: 0.00004,
			z: 0.00004,
		}

		modelNode.obj3D.position.set(-13.53368091583252, 0.3, -2.535879611968994)

		modelNode.obj3D.rotation.y = Math.PI

		modelNode.start()
	} catch (error) {
		console.error('Error creating model at sweep:', error)
	}
}
