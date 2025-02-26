export const handleTeleport = async (
	mpSdkInstance: any,
	officeTag: string | null
) => {
	if (mpSdkInstance && officeTag) {
		try {
			await mpSdkInstance.Mattertag.navigateToTag(
				officeTag,
				mpSdkInstance.Mattertag.Transition.INSTANT
			)
		} catch (error) {
			console.error('Error during teleport:', error)
		}
	}
}
