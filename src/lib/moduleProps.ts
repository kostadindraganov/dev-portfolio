import { stegaClean } from 'next-sanity'
import { dev } from './env'

export default function ({
	_type,
	options,
	_key,
	...props
}: Partial<Sanity.Module>) {
	// Only pass through safe DOM attributes to avoid React "Unknown prop" warnings
	const allowedPropNames = new Set([
		'className',
		'style',
		'role',
		'title',
		'tabIndex',
	] as const)

	const safeProps = Object.fromEntries(
		Object.entries(props as Record<string, unknown>).filter(([key]) => {
			if (allowedPropNames.has(key as any)) return true
			if (key.startsWith('data-')) return true
			if (key.startsWith('aria-')) return true
			return false
		}),
	)

	return {
		id: stegaClean(options?.uid) || 'module-' + _key,
		'data-module': _type,
		hidden: !dev && options?.hidden,
		...safeProps,
	}
}
