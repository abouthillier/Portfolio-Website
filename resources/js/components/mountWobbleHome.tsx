import { createRoot } from 'react-dom/client'
import WobbleCanvas from './WobbleCanvas'

export function mountWobbleHome(container: HTMLElement): () => void {
	const root = createRoot(container)

	root.render(
		<WobbleCanvas
			gradientStart="#0e7490"
			gradientEnd="#06b6d4"
			alpha={0.1}
			lineWidth={0.005}
			className="block h-full min-h-screen w-full"
		/>
	)

	const cleanup = () => {
		root.unmount()
	}

	return cleanup
}
