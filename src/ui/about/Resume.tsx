import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { CodeLine } from './CodeLine'
import { SyntaxType, CodePart } from '../../types/Resume'
import { useTypingEffect } from '../../hooks/useTypingEffect'

interface Line {
	parts: CodePart[]
	indent?: number
}

const leftColumnData: Line[] = [
	{ parts: [{ text: `/**`, type: SyntaxType.Comment }] },
	{ parts: [{ text: ` * Kostadin Draganov`, type: SyntaxType.Comment }] },
	{
		parts: [
			{ text: ` * Senior Software Developer 💻`, type: SyntaxType.Comment },
		],
	},
	{ parts: [{ text: ` */`, type: SyntaxType.Comment }] },
	{ parts: [] },
	{
		parts: [
			{ text: '// A simple utility function 🚀', type: SyntaxType.Comment },
		],
	},
	{
		parts: [
			{ text: 'function ', type: SyntaxType.Keyword },
			{ text: 'getGreeting', type: SyntaxType.Function },
			{ text: '(', type: SyntaxType.Punctuation },
			{ text: 'name', type: SyntaxType.Variable },
			{ text: ') {', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'return ', type: SyntaxType.Keyword },
			{ text: '`Hello, ${', type: SyntaxType.String },
			{ text: 'name', type: SyntaxType.Variable },
			{ text: '}! Welcome to my digital resume.`', type: SyntaxType.String },
			{ text: ';', type: SyntaxType.Punctuation },
		],
	},
	{ parts: [{ text: '}', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'personalInfo ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: '{', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'name', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Kostadin Draganov'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'location', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Sofia, Bulgaria'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'email', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'kostadindraganov@gmail.com'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'phone', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'+359896874137'", type: SyntaxType.String },
		],
	},
	{ parts: [{ text: '};', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{ parts: [{ text: '// ACADEMICS', type: SyntaxType.Comment }] },
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'academics ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: '[', type: SyntaxType.Punctuation },
		],
	},
	{ indent: 1, parts: [{ text: '{', type: SyntaxType.Punctuation }] },
	{
		indent: 2,
		parts: [
			{ text: 'degree', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'B.S. Computer Systems and Technologies'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'university', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'South-West University “Neofit Rilski”'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'graduated', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'May 2009'", type: SyntaxType.String },
		],
	},
	{ indent: 1, parts: [{ text: '},', type: SyntaxType.Punctuation }] },
	{ indent: 1, parts: [{ text: '{', type: SyntaxType.Punctuation }] },
	{
		indent: 2,
		parts: [
			{ text: 'degree', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'B.S. Electronics'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'university', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'South-West University “Neofit Rilski”'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'graduated', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'May 2005'", type: SyntaxType.String },
		],
	},
	{ indent: 1, parts: [{ text: '}', type: SyntaxType.Punctuation }] },
	{ parts: [{ text: '];', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{
		parts: [
			{ text: '// QUALIFICATIONS & CERTIFICATIONS', type: SyntaxType.Comment },
		],
	},
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'qualifications ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: '[', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{
				text: "'Telerik Academy: HTML5, CSS3, JavaScript',",
				type: SyntaxType.String,
			},
		],
	},
	{
		indent: 1,
		parts: [
			{
				text: "'Britanica English Language Certificate: B2',",
				type: SyntaxType.String,
			},
		],
	},
	{
		indent: 1,
		parts: [
			{
				text: "'Microsoft Certified: HTML5 with JavaScript and CSS3',",
				type: SyntaxType.String,
			},
		],
	},
	{
		indent: 1,
		parts: [
			{
				text: "'Microsoft Certified: Virtualization with Hyper-V',",
				type: SyntaxType.String,
			},
		],
	},
	{
		indent: 1,
		parts: [
			{
				text: "'VMware Certified Associate: Workforce Mobility',",
				type: SyntaxType.String,
			},
		],
	},
	{
		indent: 1,
		parts: [
			{ text: "'VMware Certified Associate: Cloud',", type: SyntaxType.String },
		],
	},
	{
		indent: 1,
		parts: [
			{
				text: "'VMware Certified Associate: Data Center Virtualization',",
				type: SyntaxType.String,
			},
		],
	},
	{ parts: [{ text: '];', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{ parts: [{ text: '// LANGUAGES', type: SyntaxType.Comment }] },
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'languages ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: '{', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'bulgarian', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Native'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'english', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Fluent'", type: SyntaxType.String },
		],
	},
	{ parts: [{ text: '};', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{ parts: [{ text: '// SKILLS', type: SyntaxType.Comment }] },
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'skills ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: '{', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'frontend', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Vue.js', 'React.js', 'Angular', 'TypeScript', 'JavaScript (ES7+)', 'HTML5', 'CSS5', 'Sass/Less', 'D3.js', 'GSAP']",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'backend', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Node.js', 'Electron', 'Web3.js', 'GraphQL']",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'devops', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['AWS', 'Docker', 'Git', 'Webpack', 'Gulp']",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'testing', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Vitest', 'Testing-library', 'Playwright', 'Cypress', 'Jest']",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'design', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['UI/UX Design', 'Motion Graphics', 'Adobe Suite', 'Figma']",
				type: SyntaxType.String,
			},
		],
	},
	{ parts: [{ text: '};', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{
		parts: [
			{
				text: '// My preferred tech stack these days 🗺️',
				type: SyntaxType.Comment,
			},
		],
	},
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'favoriteTech ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'Map', type: SyntaxType.TypeName },
			{ text: '([', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: '[', type: SyntaxType.Punctuation },
			{ text: "'frontend'", type: SyntaxType.String },
			{ text: ', ', type: SyntaxType.Punctuation },
			{ text: "'Vue.js'", type: SyntaxType.String },
			{ text: '],', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: '[', type: SyntaxType.Punctuation },
			{ text: "'backend'", type: SyntaxType.String },
			{ text: ', ', type: SyntaxType.Punctuation },
			{ text: "'Node.js'", type: SyntaxType.String },
			{ text: '],', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: '[', type: SyntaxType.Punctuation },
			{ text: "'testing'", type: SyntaxType.String },
			{ text: ', ', type: SyntaxType.Punctuation },
			{ text: "'Playwright'", type: SyntaxType.String },
			{ text: '],', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: '[', type: SyntaxType.Punctuation },
			{ text: "'database'", type: SyntaxType.String },
			{ text: ', ', type: SyntaxType.Punctuation },
			{ text: "'MongoDB'", type: SyntaxType.String },
			{ text: '],', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: '[', type: SyntaxType.Punctuation },
			{ text: "'devops'", type: SyntaxType.String },
			{ text: ', ', type: SyntaxType.Punctuation },
			{ text: "'Docker'", type: SyntaxType.String },
			{ text: '],', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: '[', type: SyntaxType.Punctuation },
			{ text: "'design'", type: SyntaxType.String },
			{ text: ', ', type: SyntaxType.Punctuation },
			{ text: "'Figma'", type: SyntaxType.String },
			{ text: ']', type: SyntaxType.Punctuation },
		],
	},
	{ parts: [{ text: ']);', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{ parts: [{ text: '// PROJECTS & REFERENCES', type: SyntaxType.Comment }] },
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'references ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: '{', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'motionDesign', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'Behance'",
				type: SyntaxType.String,
				href: 'https://www.behance.net/your-profile',
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'webDevelopment', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'CameoGlobal Portfolio'", type: SyntaxType.String, href: '#' },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'startupProjects', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: '[', type: SyntaxType.Punctuation },
			{
				text: "'Webcoin.today'",
				type: SyntaxType.String,
				href: 'https://webcoin.today',
			},
			{ text: ', ', type: SyntaxType.Punctuation },
			{
				text: "'Webhits.io'",
				type: SyntaxType.String,
				href: 'https://webhits.io',
			},
			{ text: ', ', type: SyntaxType.Punctuation },
			{
				text: "'IcoBay.net'",
				type: SyntaxType.String,
				href: 'https://icobay.net',
			},
			{ text: ']', type: SyntaxType.Punctuation },
		],
	},
	{ parts: [{ text: '};', type: SyntaxType.Punctuation }] },
]

const rightColumnData: Line[] = [
	{ parts: [{ text: '// WORK EXPERIENCE 🏗️', type: SyntaxType.Comment }] },
	{ parts: [] },
	{
		parts: [
			{ text: 'class ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience ', type: SyntaxType.TypeName },
			{ text: '{', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'constructor', type: SyntaxType.Function },
			{ text: '(', type: SyntaxType.Punctuation },
			{
				text: '{ company, role, period, tech, summary }',
				type: SyntaxType.Variable,
			},
			{ text: ') {', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'this', type: SyntaxType.Keyword },
			{ text: '.', type: SyntaxType.Punctuation },
			{ text: 'company ', type: SyntaxType.Property },
			{ text: '= company;', type: SyntaxType.Default },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'this', type: SyntaxType.Keyword },
			{ text: '.', type: SyntaxType.Punctuation },
			{ text: 'role ', type: SyntaxType.Property },
			{ text: '= role;', type: SyntaxType.Default },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'this', type: SyntaxType.Keyword },
			{ text: '.', type: SyntaxType.Punctuation },
			{ text: 'period ', type: SyntaxType.Property },
			{ text: '= period;', type: SyntaxType.Default },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'this', type: SyntaxType.Keyword },
			{ text: '.', type: SyntaxType.Punctuation },
			{ text: 'tech ', type: SyntaxType.Property },
			{ text: '= tech;', type: SyntaxType.Default },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'this', type: SyntaxType.Keyword },
			{ text: '.', type: SyntaxType.Punctuation },
			{ text: 'summary ', type: SyntaxType.Property },
			{ text: '= summary;', type: SyntaxType.Default },
		],
	},
	{ indent: 1, parts: [{ text: '}', type: SyntaxType.Punctuation }] },
	{ parts: [{ text: '}', type: SyntaxType.Punctuation }] },
	{ parts: [] },
	{
		parts: [
			{ text: 'const ', type: SyntaxType.Keyword },
			{ text: 'experience ', type: SyntaxType.Variable },
			{ text: '= ', type: SyntaxType.Operator },
			{ text: '[', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'JIMINNY R&D'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Senior Software Developer 2'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'07.2022 - 08.2023'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'tech', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Vue.js', 'TypeScript', 'Chrome Extension MV3', 'D3.js', 'Node.js', 'AWS', 'Docker', 'Vitest', 'Playwright']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'ACRONIS R&D'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Senior Software Developer'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'05.2019 - 07.2022'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'tech', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Vue.js', 'Node.js', 'Electron', 'Socket.io', 'Webpack', 'Scss/Sass']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Webhits OOD'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'Co-founder, CTO, Full Stack Developer'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'12.2017 - 05.2019'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'tech', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Vue.js', 'Nuxt.js', 'React.js', 'Angular.js', 'Node.js', 'Web3.js', 'GraphQL', 'GSAP', 'Vuetify']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Cameo Global, Inc.'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Web Developer'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'01.2014 - 05.2017'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'tech', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Angular JS', 'React.js', 'Aurelia.js', 'MongoDB', 'Node.js', 'jQuery']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Morris & Chapman'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'Multimedia Developer & Website Designer'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'10.2012 - 01.2014'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'summary', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Wrote code from scratch to meet business requirements.', 'Tested websites and identified technical problems.', 'Coded front-end interfaces with HTML5, CSS3, and JS.', 'Resolved cross-browser and usability issues.']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Television “Telecable” AD'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Multimedia Developer'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'03.2009 - 08.2012'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'summary', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Digital setup of news, TV shows, and commercials.', 'Supported live events with video/audio equipment.', 'Designed video commercials using After Effects.']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'“Nedelnik Press”'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Web Developer'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'02.2007 - 09.2008'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'summary', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Developed and maintained unique website designs.', 'Executed advanced SEO campaigns.', 'Created and developed new websites.']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'Cable Television “Telecom Group” AD'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'Senior System Administrator - Linux'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'06.2005 - 02.2007'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'summary', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Performed CMTS router system administration (Linux).', 'Administered systems for cable modems and digital TV.', 'Maintained software for digital television access control.']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '}),', type: SyntaxType.Punctuation }] },
	{
		indent: 1,
		parts: [
			{ text: 'new ', type: SyntaxType.Keyword },
			{ text: 'WorkExperience', type: SyntaxType.TypeName },
			{ text: '({', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'company', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "'Cable Television “Telecom Group” AD'",
				type: SyntaxType.String,
			},
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'role', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'Senior Technician, Base Station'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'period', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{ text: "'02.2004 - 06.2005'", type: SyntaxType.String },
			{ text: ',', type: SyntaxType.Punctuation },
		],
	},
	{
		indent: 2,
		parts: [
			{ text: 'summary', type: SyntaxType.Property },
			{ text: ': ', type: SyntaxType.Punctuation },
			{
				text: "['Maintained and renovated cable/satellite equipment.', 'Developed and launched digital cable television.', 'Developed access control systems for digital TV.']",
				type: SyntaxType.String,
			},
		],
	},
	{ indent: 1, parts: [{ text: '})', type: SyntaxType.Punctuation }] },
	{ parts: [{ text: '];', type: SyntaxType.Punctuation }] },
]

const headerData = leftColumnData.slice(0, 4)
const restOfLeftColumnData = leftColumnData.slice(4)

interface ResumeProps {
	onTypingComplete?: () => void
}

export const Resume: React.FC<ResumeProps> = ({ onTypingComplete }) => {
	const [leftTypingComplete, setLeftTypingComplete] = useState(false)
	const [mounted, setMounted] = useState(false)
	const rightColumnRef = useRef<HTMLDivElement>(null)
	const lastElementRef = useRef<HTMLDivElement>(null)

	const handleLeftComplete = useCallback(() => {
		setLeftTypingComplete(true)
	}, [])

	const handleAllComplete = useCallback(() => {
		onTypingComplete?.()
	}, [onTypingComplete])

	useEffect(() => {
		setMounted(true)
	}, [])

	const typingSpeed = 5

	// Memoize the right column data to prevent infinite re-renders
	const rightColumnDataToUse = useMemo(() => {
		return leftTypingComplete ? rightColumnData : []
	}, [leftTypingComplete])

	const displayedLeftLines = useTypingEffect(
		mounted ? restOfLeftColumnData : [],
		typingSpeed,
		handleLeftComplete,
	)
	const displayedRightLines = useTypingEffect(
		mounted ? rightColumnDataToUse : [],
		typingSpeed,
		handleAllComplete,
	)

	const showRightCursor =
		leftTypingComplete && displayedRightLines.length < rightColumnData.length

	useEffect(() => {
		if (
			leftTypingComplete &&
			displayedRightLines.length === 1 &&
			displayedRightLines[0].parts.length === 0
		) {
			setTimeout(() => {
				rightColumnRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}, 100)
		} else if (
			displayedLeftLines.length > 0 ||
			displayedRightLines.length > 0
		) {
			lastElementRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}
	}, [displayedLeftLines, displayedRightLines, leftTypingComplete])

	return (
		<div className="overflow-x-auto p-4 sm:p-6">
			<div className="flex flex-col lg:flex-row lg:gap-8">
				{/* Left Column */}
				<div className="w-full lg:w-1/2">
					{/* Header Section */}
					<div className="mb-8 flex flex-col items-center gap-8 sm:flex-row">
						<Image
							src="/images/global/KostadinDraganov.webp"
							alt="Kostadin Draganov"
							width={224}
							height={224}
							className="profile-image-animation w-48 flex-shrink-0 rounded-lg border-4 border-[#0d1117] object-cover shadow-lg md:w-56"
							priority={false}
						/>
						<div>
							{headerData.map((line, lineIndex) => (
								<CodeLine
									key={`header-${lineIndex}`}
									parts={line.parts}
									indent={line.indent}
								/>
							))}
						</div>
					</div>

					{/* Typing Content */}
					{displayedLeftLines.map((line, lineIndex) => (
						<CodeLine
							ref={
								!leftTypingComplete &&
								lineIndex === displayedLeftLines.length - 1
									? lastElementRef
									: null
							}
							key={`left-${lineIndex}`}
							parts={line.parts}
							indent={line.indent}
							showCursor={
								!leftTypingComplete &&
								lineIndex === displayedLeftLines.length - 1
							}
						/>
					))}
				</div>
				{/* Right Column */}
				<div className="w-full lg:w-1/2" ref={rightColumnRef}>
					{displayedRightLines.map((line, lineIndex) => (
						<CodeLine
							ref={
								showRightCursor && lineIndex === displayedRightLines.length - 1
									? lastElementRef
									: null
							}
							key={`right-${lineIndex}`}
							parts={line.parts}
							indent={line.indent}
							showCursor={
								showRightCursor && lineIndex === displayedRightLines.length - 1
							}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
