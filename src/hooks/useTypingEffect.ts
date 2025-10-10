import { useState, useEffect, useRef } from 'react'
import { CodePart } from '../types/Resume'

interface Line {
	parts: CodePart[]
	indent?: number
}

export const useTypingEffect = (
	allLines: Line[],
	typingSpeed: number = 17,
	onComplete?: () => void,
) => {
	const [lines, setLines] = useState<Line[]>([])
	const timeoutRef = useRef<number | null>(null)
	const onCompleteRef = useRef(onComplete)

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		setLines([])

		if (allLines.length === 0) {
			return // Nothing to type
		}

		let lineIndex = 0
		let partIndex = 0
		let charIndex = 0

		const type = () => {
			if (lineIndex >= allLines.length) {
				onCompleteRef.current?.()
				return
			}

			const currentLineData = allLines[lineIndex]

			// FIX: Handle empty lines which would otherwise cause a crash
			if (!currentLineData.parts || currentLineData.parts.length === 0) {
				const nextLines = allLines.slice(0, lineIndex + 1)
				setLines(nextLines)
				lineIndex++
				timeoutRef.current = window.setTimeout(type, typingSpeed)
				return
			}

			const currentPartData = currentLineData.parts[partIndex]

			// Build up the lines to be displayed
			const nextLines: Line[] = allLines.slice(0, lineIndex)

			const currentLineInProgress: Line = {
				indent: currentLineData.indent,
				parts: [...currentLineData.parts.slice(0, partIndex)],
			}

			const currentPartInProgress: CodePart = {
				type: currentPartData.type,
				text: currentPartData.text.substring(0, charIndex + 1),
			}
			currentLineInProgress.parts.push(currentPartInProgress)
			nextLines.push(currentLineInProgress)

			setLines(nextLines)

			charIndex++
			// OPTIMIZATION: Use >= to avoid an extra tick at the end of each part
			if (charIndex >= currentPartData.text.length) {
				charIndex = 0
				partIndex++
				if (partIndex >= currentLineData.parts.length) {
					partIndex = 0
					lineIndex++
				}
			}

			timeoutRef.current = window.setTimeout(type, typingSpeed)
		}

		timeoutRef.current = window.setTimeout(type, 500)

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [allLines, typingSpeed])

	useEffect(() => {
		onCompleteRef.current = onComplete
	}, [onComplete])

	return lines
}
