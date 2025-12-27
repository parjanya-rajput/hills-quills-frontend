import { http, HttpResponse } from 'msw';
import { Article } from '@/features/article/types';
import { Category, Region, Status } from '@/types/common';

// Mock data factory for articles
export const createMockArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 1,
  author_id: 1,
  title: 'Test Article Title',
  content: 'Test article content goes here...',
  category: Category.Culture,
  region: Region.Almora,
  image: { previewUrl: '/images/test.jpg' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  publish_date: new Date().toISOString(),
  status: Status.Approved,
  ...overrides,
});

export const createMockArticles = (count: number): Article[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockArticle({
      id: i + 1,
      title: `Test Article ${i + 1}`,
    })
  );
};

// Response helpers
const wrapResponse = <T>(data: T) => ({
  data,
  message: 'Success',
  code: 200,
});

const wrapPaginatedResponse = <T>(data: T[], hasNext = false, nextCursor = 0) => ({
  data,
  message: 'Success',
  code: 200,
  pagination: {
    hasNext,
    nextCursor,
  },
});

// Default trending tags
const defaultTrendingTags = [
  'React',
  'Next.js',
  'TypeScript',
  'Vitest',
  'Testing',
  'Uttarakhand',
  'Tourism',
  'Culture',
];

// Default handlers
export const handlers = [

  // Tags endpoints

  // GET /tags/trending
  http.get('*/tags/trending', () => {
    return HttpResponse.json(wrapResponse(defaultTrendingTags));
  }),

  // Articles endpoints

  // GET /articles/approved/latest (Paginated)
  http.get('*/articles/approved/latest', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json(wrapPaginatedResponse(createMockArticles(limit)));
  }),

  // GET /articles/approved/top
  http.get('*/articles/approved/top', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json(wrapResponse(createMockArticles(limit)));
  }),

  // GET /articles/approved/:id
  http.get('*/articles/approved/:id', ({ params }) => {
    const { id } = params;

    return HttpResponse.json(
      wrapResponse({
        ...createMockArticle({ id: Number(id) }),
        tags: ['react', 'nextjs'],
        author_name: 'John Doe',
        author_email: 'john@example.com',
        author_profile_photo_url: '/images/author.jpg',
        author_about: 'A passionate writer',
        author_profession: 'Journalist',
      })
    );
  }),

  // GET /articles/view/:id (with author info)
  http.get('*/articles/view/:id', ({ params }) => {
    const { id } = params;

    return HttpResponse.json(
      wrapResponse({
        ...createMockArticle({ id: Number(id) }),
        tags: ['react', 'nextjs'],
        author_name: 'John Doe',
        author_email: 'john@example.com',
        author_profile_photo_url: '/images/author.jpg',
        author_about: 'A passionate writer',
        author_profession: 'Journalist',
      })
    );
  }),

  // GET /articles/approved/region-set
  http.get('*/articles/approved/region-set', () => {
    return HttpResponse.json(wrapResponse(createMockArticles(6)));
  }),

  // GET /articles/approved/category/:category
  http.get('*/articles/approved/category/:category', ({ params, request }) => {
    const { category } = params;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json(
      wrapResponse(
        createMockArticles(limit).map((a) => ({
          ...a,
          category: category as Category,
        }))
      )
    );
  }),

  // GET /articles/approved/region/:region
  http.get('*/articles/approved/region/:region', ({ params, request }) => {
    const { region } = params;
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json(
      wrapResponse(
        createMockArticles(limit).map((a) => ({
          ...a,
          region: region as Region,
        }))
      )
    );
  }),

  // GET /articles/approved/tag/:tag
  http.get('*/articles/approved/tag/:tag', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json(wrapResponse(createMockArticles(limit)));
  }),

  // GET /articles/all
  http.get('*/articles/all', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json(wrapResponse(createMockArticles(limit)));
  }),

  // POST /articles
  http.post('*/articles', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json(
      wrapResponse(
        createMockArticle({
          id: Math.floor(Math.random() * 1000),
          title: body.title as string,
          content: body.content as string,
          category: body.category as Category,
          region: body.region as Region,
          status: Status.Draft,
        })
      ),
      { status: 201 }
    );
  }),

  // PATCH /articles/:id/status
  http.patch('*/articles/:id/status', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json(
      wrapResponse(
        createMockArticle({
          id: Number(id),
          status: body.status as Status,
        })
      )
    );
  }),

  // DELETE /articles/:id
  http.delete('*/articles/:id', () => {
    return HttpResponse.json(wrapResponse({ deleted: true }));
  }),

  // Web Stories endpoints

  // GET /web-stories
  http.get('*/web-stories', () => {
    return HttpResponse.json(
      wrapResponse([
        {
          id: 1,
          title: 'Test Web Story 1',
          cover_image: '/images/story1.jpg',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Test Web Story 2',
          cover_image: '/images/story2.jpg',
          created_at: new Date().toISOString(),
        },
      ])
    );
  }),
];