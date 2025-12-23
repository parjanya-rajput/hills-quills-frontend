"use client"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/molecules/header"
import { Footer } from "@/components/molecules/footer"
import { useArticleById } from "@/features/article/hooks"
import ArticleDetailContent from "@/features/article/component/article-detail/content"
import { AuthorCard } from "@/features/article/component/article-detail/author"
import ArticleDetailHeader from "@/features/article/component/article-detail/header"

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  // Get the selected article from Redu

  const articleId = params.id as string
  const { article, isLoading: loading, error } = useArticleById(Number(articleId))


  if (loading || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  
    return (
    <div className="min-h-screen bg-white">
      <ArticleDetailHeader  article={article!} />
      <div className="grid grid-cols-3 gap-4 my-10">
        <div className="col-span-2">
          <ArticleDetailContent content={article!.content} />
        </div>
        <div className="col-span-1">
          <AuthorCard name={article!.author_name} profile_photo_url={article!.author_profile_photo_url!} profession={article!.author_profession!} about={article!.author_about!} role={'role'} />
        </div>
      </div>

      <Footer />
    </div>
    )
}
