import * as React from 'react'
/**
 * A custom React hook that returns a boolean indicating whether or not the user
 * has scrolled to the bottom of the page (within a given offset).
 *
 * @param {number} offset - The number of pixels above the bottom of the page that
 * should still be considered "at the bottom".
 * @return {boolean} True if the user has scrolled to the bottom of the page,
 * within the given offset. False otherwise.
 */
export function useAtBottom(offset = 0) {
    const [isAtBottom, setIsAtBottom] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsAtBottom(
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - offset
            )
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [offset])

    return isAtBottom
}
