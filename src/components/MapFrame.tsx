'use client'

import { tagData, tagPosition } from '@/constants'
import { MatterportSDK } from '@/types/sdk'
import { addModelAtSweep } from '@/utils/addModelAtSweep'
import { handleNavigate } from '@/utils/handleNavigate'
import { handleTeleport } from '@/utils/handleTeleport'
import { useEffect, useRef, useState } from 'react'
import Menu from './Menu'

declare global {
	interface Window {
		MP_SDK: MatterportSDK
	}
}

const SDK_KEY = process.env.NEXT_PUBLIC_MATTERPORT_SDK_KEY ?? ''

const MapFrame = () => {
	const showcaseRef = useRef<HTMLIFrameElement | null>(null)
	const [officeTag, setOfficeTag] = useState<string | null>(null)
	const [mpSdkInstance, setMpSdkInstance] = useState<MatterportSDK | null>(null)

	useEffect(() => {
		const iframe = showcaseRef.current
		if (!iframe) return

		const handleIframeLoad = async () => {
			try {
				if (!iframe.contentWindow) {
					console.error('iframe.contentWindow is null')
					return
				}

				const mpSdk = await iframe.contentWindow.MP_SDK.connect(
					iframe,
					SDK_KEY,
					'25.2.2'
				)

				const tag = await mpSdk.Mattertag.add([tagData])
				setOfficeTag(tag[0])
				await mpSdk.Mattertag.editColor(tag[0], { r: 0, g: 122, b: 0 }, true)

				addModelAtSweep(mpSdk)

				setMpSdkInstance(mpSdk)
			} catch (error) {
				console.error('Failed to connect to Matterport SDK:', error)
			}
		}

		iframe.addEventListener('load', handleIframeLoad)

		const script = document.createElement('script')
		script.src =
			'https://static.matterport.com/showcase-sdk/2.0.1-0-g64e7e88/sdk.js'
		script.async = true
		script.onload = handleIframeLoad
		document.body.appendChild(script)

		return () => {
			iframe.removeEventListener('load', handleIframeLoad)
		}
	}, [])

	return (
		<main style={{ height: '100vh', width: '100vw' }}>
			<iframe
				ref={showcaseRef}
				id='showcase'
				src={`/bundle/showcase.html?m=m72PGKzeknR&applicationKey=${SDK_KEY}&play=1`}
				width='100%'
				height='100%'
				allowFullScreen
			/>
			<Menu
				onTeleport={() => handleTeleport(mpSdkInstance, officeTag)}
				onNavigate={() => handleNavigate(mpSdkInstance, tagPosition)}
			/>
		</main>
	)
}

export default MapFrame
