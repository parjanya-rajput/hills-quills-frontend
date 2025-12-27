import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeaturedArticle } from './featured-article';
import { Article } from '@/features/article/types';
import { Category, Region, Status } from '@/types/common';

// Mock article data
const mockArticle: Article = {
  id: 1,
  author_id: 1,
  title: 'Exploring the Hills of Uttarakhand',
  content: 'Lorem ipsum dolor sit amet...',
  category: Category.Culture,
  region: Region.Chamoli,
  image: {
    previewUrl: '/images/test-article.jpg',
  },
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  updated_at: new Date().toISOString(),
  publish_date: new Date().toISOString(),
  status: Status.Approved,
};

describe('FeaturedArticle', () => {
  describe('Loading State', () => {
    it('renders loading skeleton when article is undefined', () => {
      const { container } = render(<FeaturedArticle article={undefined} />);

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('does not render article content when loading', () => {
      render(<FeaturedArticle article={undefined} />);

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('renders article title', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(
        screen.getByRole('heading', { name: mockArticle.title })
      ).toBeInTheDocument();
    });

    it('renders article image with correct alt text', () => {
      render(<FeaturedArticle article={mockArticle} />);

      const image = screen.getByRole('img', { name: mockArticle.title });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('test-article.jpg')
      );
    });

    it('renders fallback image when previewUrl is empty', () => {
      const articleWithNoImage: Article = {
        ...mockArticle,
        image: { previewUrl: '' },
      };

      render(<FeaturedArticle article={articleWithNoImage} />);

      const image = screen.getByRole('img', { name: mockArticle.title });
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('placeholder.svg')
      );
    });

    it('renders article region', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByText(mockArticle.region)).toBeInTheDocument();
    });

    it('renders relative time (e.g., "2 days ago")', () => {
      render(<FeaturedArticle article={mockArticle} />);

      // formatDistanceToNow returns something like "2 days ago"
      expect(screen.getByText(/ago/i)).toBeInTheDocument();
    });

    it('renders category badge', () => {
      render(<FeaturedArticle article={mockArticle} />);

      expect(screen.getByText(mockArticle.category.toLocaleUpperCase())).toBeInTheDocument();
    });

    it('renders clock icon', () => {
      const { container } = render(<FeaturedArticle article={mockArticle} />);

      // Lucide icons render as SVG
      const clockIcon = container.querySelector('svg.lucide-clock');
      expect(clockIcon).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('renders link to article detail page', () => {
      render(<FeaturedArticle article={mockArticle} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/articles/${mockArticle.id}`);
    });

    it('navigates to correct URL when clicked', async () => {
      const user = userEvent.setup();

      render(<FeaturedArticle article={mockArticle} />);

      const link = screen.getByRole('link');
      await user.click(link);

      // Link should have correct href (actual navigation is handled by Next.js)
      expect(link).toHaveAttribute('href', '/articles/1');
    });
  });

  describe('Accessibility', () => {
    it('has accessible heading', () => {
      render(<FeaturedArticle article={mockArticle} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(mockArticle.title);
    });

    it('image has alt text', () => {
      render(<FeaturedArticle article={mockArticle} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', mockArticle.title);
    });

    it('link wraps the entire article card', () => {
      render(<FeaturedArticle article={mockArticle} />);

      const link = screen.getByRole('link');
      expect(link).toContainElement(screen.getByRole('heading'));
      expect(link).toContainElement(screen.getByRole('img'));
    });
  });

  describe('Edge Cases', () => {
    it('handles very long title', () => {
      const longTitleArticle: Article = {
        ...mockArticle,
        title: 'A'.repeat(200),
      };

      render(<FeaturedArticle article={longTitleArticle} />);

      expect(screen.getByRole('heading')).toHaveTextContent('A'.repeat(200));
    });

    it('handles article created just now', () => {
      const recentArticle: Article = {
        ...mockArticle,
        created_at: new Date().toISOString(),
      };

      render(<FeaturedArticle article={recentArticle} />);

      // Should show "less than a minute ago" or similar
      expect(screen.getByText(/less than|seconds|minute/i)).toBeInTheDocument();
    });

    it('handles article created long ago', () => {
      const oldArticle: Article = {
        ...mockArticle,
        created_at: new Date(
          Date.now() - 365 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 year ago
      };

      render(<FeaturedArticle article={oldArticle} />);

      expect(screen.getByText(/year|months/i)).toBeInTheDocument();
    });

    it('handles different categories', () => {
      const categories = [Category.Culture, Category.Tourism, Category.Politics, Category.Health] as const;

      categories.forEach((category) => {
        const articleWithCategory: Article = {
          ...mockArticle,
          category,
        };

        const { unmount } = render(
          <FeaturedArticle article={articleWithCategory} />
        );
        expect(screen.getByText(category.toLocaleUpperCase())).toBeInTheDocument();
        unmount();
      });
    });

    it('handles different regions', () => {
      const regions = [Region.Haridwar, Region.Almora] as const;

      regions.forEach((region) => {
        const articleWithRegion: Article = {
          ...mockArticle,
          region,
        };

        const { unmount } = render(
          <FeaturedArticle article={articleWithRegion} />
        );
        expect(screen.getByText(region)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Styling', () => {
    it('has overflow hidden for image zoom effect', () => {
      const { container } = render(<FeaturedArticle article={mockArticle} />);

      const imageContainer = container.querySelector('.overflow-hidden');
      expect(imageContainer).toBeInTheDocument();
    });

    it('has rounded corners', () => {
      const { container } = render(<FeaturedArticle article={mockArticle} />);

      const card = container.querySelector('.rounded-xl');
      expect(card).toBeInTheDocument();
    });

    it('has hover transition classes', () => {
      const { container } = render(<FeaturedArticle article={mockArticle} />);

      const card = container.querySelector('.transition-all');
      expect(card).toBeInTheDocument();
    });
  });
});