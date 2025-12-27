import { render, screen } from '@testing-library/react'
import { Skeleton, SkeletonText, SkeletonCard } from '../Skeleton'

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('should render with default styles', () => {
      render(<Skeleton />)

      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-gray-700/50')
    })

    it('should apply custom className', () => {
      render(<Skeleton className="custom-class" />)

      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('custom-class')
    })

    it('should render with custom dimensions', () => {
      render(<Skeleton className="w-10 h-10" />)

      const skeleton = screen.getByRole('presentation')
      expect(skeleton).toHaveClass('w-10', 'h-10')
    })
  })

  describe('SkeletonText', () => {
    it('should render default 3 lines', () => {
      render(<SkeletonText />)

      const lines = screen.getAllByRole('presentation')
      expect(lines).toHaveLength(3)
    })

    it('should render custom number of lines', () => {
      render(<SkeletonText lines={5} />)

      const lines = screen.getAllByRole('presentation')
      expect(lines).toHaveLength(5)
    })

    it('should make last line shorter by default', () => {
      render(<SkeletonText lines={3} />)

      const lines = screen.getAllByRole('presentation')
      expect(lines[2]).toHaveClass('w-3/4') // Last line should be shorter
    })

    it('should apply custom className', () => {
      render(<SkeletonText className="custom-text" />)

      const container = screen.getByRole('presentation').parentElement
      expect(container).toHaveClass('custom-text')
    })
  })

  describe('SkeletonCard', () => {
    it('should render card skeleton structure', () => {
      render(<SkeletonCard />)

      const card = screen.getByRole('presentation')
      expect(card).toHaveClass('p-4', 'rounded-lg', 'bg-gray-900', 'border', 'border-gray-700')

      // Should contain avatar skeleton and text skeleton
      const skeletons = screen.getAllByRole('presentation')
      expect(skeletons.length).toBeGreaterThan(1)
    })

    it('should apply custom className', () => {
      render(<SkeletonCard className="custom-card" />)

      const card = screen.getByRole('presentation')
      expect(card).toHaveClass('custom-card')
    })
  })
})
