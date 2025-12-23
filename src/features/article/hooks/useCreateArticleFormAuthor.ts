import { useState } from "react"
import { ArticleFormState } from "@/features/article/component/article-form"
import { createArticle } from "@/features/article/services"
import { Status } from "@/types/common"
import { useCreateArticle } from "@/features/article/hooks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PREVIEW_ARTICLE_IMAGE } from "@/types/common"
import { useAuthorId } from "@/features/author/hooks/useAuthorId"

const ArticleFormStateInitial = {
    title: "",
    imageFile: PREVIEW_ARTICLE_IMAGE,
    tags: [] as string[],
    region: undefined,
    category: undefined,
    content: "",
} as ArticleFormState

export const useCreateArticleFormAuthor = () => {
    const [formData, setFormData] = useState<ArticleFormState>(ArticleFormStateInitial)
    const router = useRouter()
    const authorId = useAuthorId()

    const [createArticle, isCreating] = useCreateArticle();

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleReset = () => {
        setFormData(ArticleFormStateInitial)
    }

    const validateForm = () => {
        if (!formData.title) {
            toast.error("Title is required")
            return false
        }
        if (!formData.content) {
            toast.error("Content is required")
            return false
        }
        if (!formData.category) {
            toast.error("Category is required")
            return false
        }
        if (!formData.region) {
            toast.error("Region is required")
            return false
        }
        if (!formData.imageFile) {
            toast.error("Image is required")
            return false
        }
        return true
    }

    const handlePublish = async() => {
        if (!validateForm()) {
            return
        }
        try {
            await createArticle(formData.title, formData.content, authorId!, formData.tags, Status.Pending, formData.category! , formData.region!, formData.imageFile!)
            toast.success("Article sent to admin for review successfully.")
            router.push("/author/articles")
        } catch (error) {
            toast.error("Failed to publish article")
        }
    }

    const handleSaveDraft = async () => {
        if (!validateForm()) {
            return
        }
        try {
            await createArticle(formData.title, formData.content, authorId!, formData.tags, Status.Draft, formData.category!, formData.region!, formData.imageFile!)
            toast.success("Article saved as draft")
            router.push("/author/articles")
        } catch (error) {
            toast.error("Failed to save article as draft")
        }
    }

    return { formData, handleChange, handleReset, handlePublish, handleSaveDraft, isCreating }
}