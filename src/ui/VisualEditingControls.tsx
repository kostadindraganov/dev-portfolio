import { draftMode } from 'next/headers'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { SanityLive } from '@/sanity/lib/live'
import { groq } from 'next-sanity'
import { VisualEditing } from 'next-sanity/visual-editing'
import DraftModeControls from './DraftModeControls'

export default async function VisualEditingControls() {
	const globalModules = await fetchSanityLive({
		query: groq`*[_type == 'global-module']{
			_id,
			path,
			excludePaths[]
		}`,
	})

	return (
		<>
			<SanityLive />

			{(await draftMode()).isEnabled && (
				<>
					<VisualEditing />
					<DraftModeControls globalModules={globalModules} />
				</>
			)}
		</>
	)
}
