import { useState } from "react"
import { SlideForm, StoryFormState } from "@/features/web-story/component/story-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MAX_SLIDES } from "@/types/constant"
import { Status } from "@/types/common"
import { useCreateStory } from "@/features/web-story/hooks"
import { PREVIEW_STORY_IMAGE } from "@/types/common"
import { useAuthorId } from "@/features/author/hooks/useAuthorId"

const StoryFormStateInitial = {
    cover_image: PREVIEW_STORY_IMAGE,
    title: '',
    category: undefined,
    region: undefined,
    slides: [] as SlideForm[],
    tags: [] as string[],
} as StoryFormState

export const useCreateStoryFormAuthor = () => {
    const [formData, setFormData] = useState<StoryFormState>(StoryFormStateInitial)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const authorId = useAuthorId();

    const {createStory, isCreating} = useCreateStory();

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleReset = () => {
        setFormData(StoryFormStateInitial)
    }

    const validateForm = () => {
        if (!formData.title) {
            toast.error("Title is required")
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
        if (formData.slides.length === 0) {
            toast.error("At least one slide is required")
            return false
        }
        if (formData.slides.length > MAX_SLIDES) {
            toast.error("Maximum 15 slides allowed")
            return false
        }
        if (!formData.cover_image) {
            toast.error("Cover image is required")
            return false
        }
        formData.slides.forEach((slide) => {
            if (!slide.image) {
                toast.error("Slide image is required for slide " + slide.id)
                return false
            }
            if (!slide.caption) {
                toast.error("Slide caption is required for slide " + slide.id)
                return false
            }
            if (slide.caption.length > 100) {
                toast.error("Slide caption must be 100 characters or less for slide " + slide.id)
                return false
            }
            if (!slide.duration) {
                toast.error("Slide time is required for slide " + slide.id)
                return false
            }
            if (slide.duration < 1 || slide.duration > 30) {
                toast.error("Slide time must be between 1-30 seconds for slide " + slide.id)
                return false
            }
        })

        return true
    }

    const handlePublish = async () => {
        if (!validateForm()) {
            return
        }
        try {
            await createStory(authorId!, formData.title, formData.region!, formData.category!, formData.tags, formData.slides, formData.cover_image.file!, Status.Pending)
            toast.success("Story will be published after review")
            router.push("/author/stories")
        } catch (error) {
            console.log(error);
            toast.error("Failed to publish story")
        }
    }

    const handleSaveDraft = async () => {
        if (!validateForm()) {
            return
        }
        try {
            await createStory(authorId!, formData.title, formData.region!, formData.category!, formData.tags, formData.slides, formData.cover_image.file!, Status.Draft)
            toast.success("Story saved as draft")
            router.push("/author/stories")
        } catch (error) {
            toast.error("Failed to save story as draft")
        }
    }

    return { formData, handleChange, handleReset, handlePublish, handleSaveDraft, isSubmitting }
}