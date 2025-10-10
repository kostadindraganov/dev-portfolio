'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Resume } from '../../../ui/about/Resume'

const AboutPage = () => {
	const [isTypingComplete, setIsTypingComplete] = useState(false)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (isTypingComplete) {
			// Wait a moment after typing is done, then scroll to the bottom
			setTimeout(() => {
				window.scrollTo({
					top: document.body.scrollHeight,
					behavior: 'smooth',
				})
			}, 200)
		}
	}, [isTypingComplete])

	const handleTypingComplete = useCallback(() => {
		setIsTypingComplete(true)
	}, [])

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] p-4 text-gray-300 sm:p-8 md:p-6">
			<div className="max-w-8xl mx-auto w-full overflow-hidden rounded-lg border border-gray-700 bg-[#161b22]/50 shadow-2xl backdrop-blur-sm">
				{/* Window Header */}
				<header className="flex items-center bg-[#0d1117] p-3">
					<div className="flex space-x-2">
						<span className="h-3 w-3 rounded-full bg-red-500"></span>
						<span className="h-3 w-3 rounded-full bg-yellow-500"></span>
						<span className="h-3 w-3 rounded-full bg-green-500"></span>
					</div>
					<div className="flex-grow text-center text-sm text-gray-400">
						kostadin-draganov-resume.js
					</div>
				</header>

				{/* Editor Body */}
				<main className="font-mono text-sm md:text-base">
					{mounted && <Resume onTypingComplete={handleTypingComplete} />}
				</main>
			</div>

			{isTypingComplete && (
				<div className="mt-10 text-center">
					<a
						href="/kostadin-draganov-cv.pdf" // NOTE: Replace with the actual path to your PDF
						download
						className="glowing-btn"
					>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						Download CV
					</a>
				</div>
			)}
		</div>
	)
}

export default AboutPage
