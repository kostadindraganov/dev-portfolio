import { useQueryState } from 'nuqs'

export const useBlogFilters = () => {
	const [category, setCategory] = useQueryState('category', {
		defaultValue: 'All',
	})

	const [author, setAuthor] = useQueryState('author')

	return {
		category,
		author,
		setCategory,
		setAuthor,
	}
}

export const usePortfolioFilters = () => {
	const { category, setCategory, author, setAuthor } = useBlogFilters()
	return { category, setCategory, author, setAuthor }
}
