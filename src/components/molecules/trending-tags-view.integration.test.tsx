import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { TrendingTagsView } from './trending-tags-view';
import { useTrendingTags } from '@/features/article/hooks';

// Wrapper component using the real hook (integration)
function TrendingTagsPage() {
  const { data: trendingTags } = useTrendingTags();
  return (
    <div>
      <TrendingTagsView trendingTags={trendingTags} handleTagClick={() => {}} />
    </div>
  );
}

describe('TrendingTagsView Integration', () => {
  describe('Data Fetching + Rendering', () => {
    it('renders tags from API and duplicates for seamless scroll', async () => {
      const apiTags = ['React', 'Next.js', 'TypeScript', 'Vitest'];

      server.use(
        http.get('*/tags/trending', () => {
          return HttpResponse.json({ data: apiTags, message: 'Success', code: 200 });
        })
      );

      render(<TrendingTagsPage />);

      // Assert each API tag appears twice (due to duplication for scroll)
      for (const tag of apiTags) {
        const badges = await screen.findAllByText(`#${tag}`);
        expect(badges).toHaveLength(2);
      }
    });

    it('uses fallback tags when API returns empty array', async () => {
      server.use(
        http.get('*/tags/trending', () => {
          return HttpResponse.json({ data: [], message: 'Success', code: 200 });
        })
      );

      render(<TrendingTagsPage />);

      const hillFarming = await screen.findAllByText('#Hill Farming');
      expect(hillFarming.length).toBeGreaterThan(0);
    });

    it('uses fallback tags when API fails', async () => {
      server.use(
        http.get('*/tags/trending', () => {
          return HttpResponse.json({ message: 'Server Error', code: 500 }, { status: 500 });
        })
      );

      render(<TrendingTagsPage />);

      const hillFarming = await screen.findAllByText('#Hill Farming');
      expect(hillFarming.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation', () => {
    it('each tag links to its tag page', async () => {
      server.use(
        http.get('*/tags/trending', () => {
          return HttpResponse.json({ data: ['Uttarakhand'], message: 'Success', code: 200 });
        })
      );

      render(<TrendingTagsPage />);

      // Wait for tag to render
      await screen.findAllByText('#Uttarakhand');

      // Check generated link href
      const tagLinks = screen.getAllByRole('link', { name: /#uttarakhand/i });
      expect(tagLinks[0]).toHaveAttribute('href', '/tags/Uttarakhand');
    });

    it('clicking tag uses link', async () => {
      const user = userEvent.setup();
      server.use(
        http.get('*/tags/trending', () => {
          return HttpResponse.json({ data: ['TestTag'], message: 'Success', code: 200 });
        })
      );

      render(<TrendingTagsPage />);

      await screen.findAllByText('#TestTag');
      const tagLink = screen.getAllByRole('link', { name: /#testtag/i })[0];

      expect(tagLink).toHaveAttribute('href', '/tags/TestTag');
      await user.click(tagLink); // Next.js handles actual navigation; we just verify href
    });
  });
});