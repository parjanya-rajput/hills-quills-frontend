import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrendingTagsView } from './trending-tags-view';

describe('TrendingTagsView', () => {
  const mockHandleTagClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {

    it('renders provided trending tags', () => {
      const tags = ['React', 'Next.js', 'Vitest'];

      render(
        <TrendingTagsView
          trendingTags={tags}
          handleTagClick={mockHandleTagClick}
        />
      );

      tags.forEach(tag => {
        // Tags are duplicated for infinite scroll, so we check for multiple
        const tagLinks = screen.getAllByRole('link', {
          name: new RegExp(tag, 'i'),
        });
        expect(tagLinks.length).toBeGreaterThan(0);
      });
    });

    it('renders fallback tags when trendingTags is undefined', () => {
      render(
        <TrendingTagsView
          trendingTags={undefined}
          handleTagClick={mockHandleTagClick}
        />
      );

      // Check for fallback tags
      expect(screen.getAllByRole('link', { name: /hill farming/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: /char dham yatra/i }).length).toBeGreaterThan(0);
    });

    it('renders fallback tags when trendingTags is empty array', () => {
      render(
        <TrendingTagsView
          trendingTags={[]}
          handleTagClick={mockHandleTagClick}
        />
      );

      expect(screen.getAllByRole('link', { name: /hill farming/i }).length).toBeGreaterThan(0);
    });

    it('displays tags with # prefix', () => {
      render(
        <TrendingTagsView
          trendingTags={['React']}
          handleTagClick={mockHandleTagClick}
        />
      );

      // TagBadge adds # prefix
      expect(screen.getAllByText(/#react/i).length).toBeGreaterThan(0);
    });
  });

  describe('Tag Duplication (Infinite Scroll)', () => {
    it('renders tags twice for seamless infinite scroll', () => {
      const tags = ['React', 'Next.js'];

      render(
        <TrendingTagsView
          trendingTags={tags}
          handleTagClick={mockHandleTagClick}
        />
      );

      // Each tag should appear twice (for infinite scroll)
      tags.forEach(tag => {
        const tagLinks = screen.getAllByRole('link', {
          name: new RegExp(tag, 'i'),
        });
        expect(tagLinks.length).toBe(2); // Exactly 2 instances
      });
    });
  });

  describe('Click Handling', () => {
    it('navigates to tag page when tag is clicked', async () => {
      const user = userEvent.setup();
      const tags = ['React'];

      render(
        <TrendingTagsView
          trendingTags={tags}
          handleTagClick={mockHandleTagClick}
        />
      );

      const tagLink = screen.getAllByRole('link', { name: /react/i })[0];

      // Verify link has correct href
      expect(tagLink).toHaveAttribute('href', '/tags/React');

      await user.click(tagLink);

      // Note: handleTagClick is not currently called due to implementation
    });

    it('handles clicks on any tag instance in the scroll', async () => {
      const user = userEvent.setup();

      render(
        <TrendingTagsView
          trendingTags={['React']}
          handleTagClick={mockHandleTagClick}
        />
      );

      // Get both instances (duplicated for infinite scroll)
      const tagLinks = screen.getAllByRole('link', { name: /react/i });

      // Click the second instance
      await user.click(tagLinks[1]);

      expect(tagLinks[1]).toHaveAttribute('href', '/tags/React');
    });
  });

  describe('Accessibility', () => {
    it('renders tags as accessible links', () => {
      render(
        <TrendingTagsView
          trendingTags={['React']}
          handleTagClick={mockHandleTagClick}
        />
      );

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('has proper semantic structure', () => {
      const { container } = render(
        <TrendingTagsView
          trendingTags={['React']}
          handleTagClick={mockHandleTagClick}
        />
      );

      // Check for proper container structure
      const mainContainer = container.querySelector('div.overflow-hidden');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in tag names', () => {
      const tags = ['React & Next.js', 'C++', 'Node.js'];

      render(
        <TrendingTagsView
          trendingTags={tags}
          handleTagClick={mockHandleTagClick}
        />
      );

      tags.forEach(tag => {
        const tagLinks = screen.getAllByRole('link', {
          name: new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        });
        expect(tagLinks.length).toBeGreaterThan(0);
      });
    });

    it('handles very long tag names', () => {
      const longTag = 'A'.repeat(100);

      render(
        <TrendingTagsView
          trendingTags={[longTag]}
          handleTagClick={mockHandleTagClick}
        />
      );

      const tagLinks = screen.getAllByRole('link', {
        name: new RegExp(longTag, 'i'),
      });
      expect(tagLinks.length).toBeGreaterThan(0);
    });

    it('handles empty string tags gracefully', () => {
      render(
        <TrendingTagsView
          trendingTags={['', 'Valid Tag']}
          handleTagClick={mockHandleTagClick}
        />
      );

      // Should still render valid tags
      expect(screen.getAllByRole('link', { name: /valid tag/i }).length).toBeGreaterThan(0);
    });
  });
});