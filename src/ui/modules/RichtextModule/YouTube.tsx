import * as React from 'react'

function extractYouTubeId(input?: string): string | null {
	if (!input) return null
	// Common URL patterns
	const patterns = [
		/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
		/v=([A-Za-z0-9_-]{11})/,
		/^([A-Za-z0-9_-]{11})$/,
	]
	for (const re of patterns) {
		const m = input.match(re)
		if (m) return m[1] || m[0]
	}
	return null
}

export default function YouTube({ value }: { value: any }) {
	const id: string | null =
		value?.id ||
		extractYouTubeId(value?.url || value?.videoId || value?.videoID)

	if (!id) return null

	return (
		<div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-950 md:[grid-column:bleed]">
			<iframe
				className="h-full w-full"
				src={`https://www.youtube-nocookie.com/embed/${id}`}
				title={value?.title || 'YouTube video'}
				loading="lazy"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
			/>
		</div>
	)
}
