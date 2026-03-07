'use client'

export default function CSS({ code }: { code?: string }) {
	if (!code) return null

	return (
		/* eslint-disable-next-line react/no-unknown-property */
		<style jsx>{`
			${code}
		`}</style>
	)
}
