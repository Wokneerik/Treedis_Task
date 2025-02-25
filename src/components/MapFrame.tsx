'use client'

import { MatterportSDK } from '@/types/sdk'
import { useEffect, useRef } from 'react'

declare global {
	interface Window {
		MP_SDK: MatterportSDK
	}
}

const MapFrame = () => {
	const SDK_KEY = process.env.NEXT_PUBLIC_MATTERPORT_SDK_KEY ?? ''

	const showcaseRef = useRef<HTMLIFrameElement | null>(null)

	useEffect(() => {
		const iframe = showcaseRef.current
		if (!iframe) return

		const handleIframeLoad = async () => {
			try {
				console.log('Iframe loaded, trying to connect SDK')

				if (!iframe.contentWindow) {
					console.error('iframe.contentWindow is null')
					return
				}

				const mpSdk = await iframe.contentWindow.MP_SDK.connect(
					iframe,
					SDK_KEY,
					'25.2.2'
				)

				console.log('SDK Connected successfully!', mpSdk)
			} catch (error) {
				console.error('Failed to connect to Matterport SDK:', error)
			}
		}

		iframe.addEventListener('load', handleIframeLoad)

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
		</main>
	)
}

export default MapFrame
