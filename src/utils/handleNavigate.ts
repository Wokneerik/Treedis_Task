export const handleNavigate = async (
	mpSdkInstance: any,
	tagPosition: { x: number; y: number; z: number }
) => {
	if (!mpSdkInstance || !tagPosition) {
		console.error('mpSdkInstance or tagPosition is missing')
		return
	}

	try {
		const startPose = await mpSdkInstance.Camera.getPose()
		const startSweepId = startPose.sweep

		const modelData = await mpSdkInstance.Model.getData()

		const sweepGraph = await mpSdkInstance.Sweep.createGraph({
			enabled: true,
			connectNeighbors: true,
			baseModelId: modelData.sid,
			mode: 'neighbor',
			maxNeighborDistance: 10,
			onlyConnectEnabled: false,
		})

		const startSweep = sweepGraph.vertex(startSweepId)

		const sweepsData: Record<string, any> = {}

		await mpSdkInstance.Sweep.data.subscribe({
			onAdded: (index: string, item: any) => {
				sweepsData[index] = item
			},
			onUpdated: (index: string, item: any) => {
				sweepsData[index] = item
			},
			onRemoved: (index: string) => {
				delete sweepsData[index]
			},
		})

		await new Promise(resolve => setTimeout(resolve, 500))

		const allSweepIds: string[] = Object.keys(sweepsData)
		const pathVertices: string[] = []

		for (const sweepId of allSweepIds) {
			if (!sweepsData[sweepId].position) continue

			const dx = sweepsData[sweepId].position.x - tagPosition.x
			const dy = sweepsData[sweepId].position.y - tagPosition.y
			const dz = sweepsData[sweepId].position.z - tagPosition.z
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

			if (distance <= 2) {
				pathVertices.push(sweepId)
			}
		}

		if (pathVertices.length === 0) {
			console.error('No sweep found near the tag position')
			sweepGraph.dispose()
			return
		}

		console.log(
			`Navigating from ${startSweepId} to sweeps: ${pathVertices.join(', ')}`
		)

		const aStarRunner = await mpSdkInstance.Graph.createAStarRunner(
			sweepGraph,
			startSweep,
			sweepGraph.vertex(pathVertices[0])
		)

		const pathResult = aStarRunner.exec()
		const path: string[] = pathResult.path.map(
			(vertex: { data: { sid: string } }) => vertex.data.sid
		)

		console.log('Path vertices:', path)

		const moveToNextPoint = async (currentIndex: number) => {
			if (currentIndex >= path.length - 1) return

			const currentSweepId = path[currentIndex]
			const nextSweepId = path[currentIndex + 1]
			if (!currentSweepId || !nextSweepId) return

			console.log(`Moving to sweep: ${nextSweepId}`)

			const currentPosition = sweepsData[currentSweepId].position
			const nextPosition = sweepsData[nextSweepId].position

			const dx = currentPosition.x - nextPosition.x
			const dz = currentPosition.z - nextPosition.z
			const yaw = Math.atan2(dx, dz)

			const rotation = {
				x: 0,
				y: (yaw * 180) / Math.PI,
			}

			try {
				await mpSdkInstance.Sweep.moveTo(nextSweepId, {
					transition: mpSdkInstance.Sweep.Transition.FLY,
					transitionTime: 1000,
					rotation: rotation,
				})

				await new Promise(resolve => setTimeout(resolve, 1200))

				await moveToNextPoint(currentIndex + 1)
			} catch (error) {
				console.error('Error during point movement:', error)
			}
		}

		await moveToNextPoint(0)

		sweepGraph.dispose()
	} catch (error) {
		console.error('Error during navigation:', error)
	}
}
