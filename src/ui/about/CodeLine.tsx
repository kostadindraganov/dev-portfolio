import React from 'react'
import { CodePart, SyntaxType } from '../../types/Resume'

interface CodeLineProps {
	parts: CodePart[]
	indent?: number
	showCursor?: boolean
}

const typeToClassName: Record<SyntaxType, string> = {
	[SyntaxType.Keyword]: 'text-[#c678dd]',
	[SyntaxType.Variable]: 'text-[#e06c75]',
	[SyntaxType.String]: 'text-[#98c379]',
	[SyntaxType.Comment]: 'text-gray-500 italic',
	[SyntaxType.Default]: 'text-gray-300',
	[SyntaxType.Operator]: 'text-[#56b6c2]',
	[SyntaxType.Function]: 'text-[#61afef]',
	[SyntaxType.Property]: 'text-[#d19a66]',
	[SyntaxType.Punctuation]: 'text-gray-400',
	[SyntaxType.TypeName]: 'text-[#e5c07b]',
	[SyntaxType.Boolean]: 'text-[#d19a66]',
	[SyntaxType.Number]: 'text-[#d19a66]',
}

const Cursor: React.FC = () => (
	<span className="cursor-blink ml-0.5 inline-block h-5 w-2.5 bg-[#e5c07b] align-middle"></span>
)

export const CodeLine = React.forwardRef<HTMLDivElement, CodeLineProps>(
	({ parts, indent = 0, showCursor = false }, ref) => {
		const indentation = '\u00A0\u00A0'.repeat(indent) // using non-breaking spaces for indentation
		return (
			<div ref={ref} className="flex leading-relaxed whitespace-pre-wrap">
				<span className="select-none">{indentation}</span>
				<div className="flex-1">
					{parts.map((part, index) => {
						const content = (
							<span key={index} className={typeToClassName[part.type]}>
								{part.text}
							</span>
						)
						if (part.href) {
							return (
								<a
									key={`${index}-link`}
									href={part.href}
									target="_blank"
									rel="noopener noreferrer"
									className="underline transition-colors hover:text-[#61afef]"
								>
									{content}
								</a>
							)
						}
						return content
					})}
					{showCursor && <Cursor />}
				</div>
			</div>
		)
	},
)
