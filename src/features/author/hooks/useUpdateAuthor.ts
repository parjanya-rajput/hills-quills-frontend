import { useState } from "react"
import { dequal } from 'dequal';
import { useDeepCompareCallback, useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare"
import { toast } from "sonner"
import { PREVIEW_AUTHOR_IMAGE } from "@/types/common"
import { useUpdateAuthor } from ".";
import { Author, AuthorUpdates } from "../types";
import { AuthorFormState } from "../components/author-form";


export const useUpdateAuthorForm = (author?: Author) => {
    const [isLoading, setIsLoading] = useState(true)
    const { updateAuthor, isLoading: isUpdating } = useUpdateAuthor()

    const [formData, setFormData] = useState<AuthorFormState>({
        name: author?.name || "",
        email: author?.email || "",
        profession: author?.profession || "",
        about: author?.about || "",
        imageFile: PREVIEW_AUTHOR_IMAGE,
        password: "",
    })

    useDeepCompareEffect(() => {
        if (!author) {
            return
        }
        setFormData({
            name: author.name,
            email: author.email,
            profession: author.profession || "",
            about: author.about || "",
            imageFile: author.profile_photo_url
                ? { previewUrl: author.profile_photo_url, file: undefined }
                : PREVIEW_AUTHOR_IMAGE,
            password: "",
        })
        setIsLoading(false)
    }, [author])

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleReset = () => {
        if (!author) {
            return
        }
        setFormData({
            name: author.name,
            email: author.email,
            profession: author.profession || "",
            about: author.about || "",
            imageFile: author.profile_photo_url
                ? { previewUrl: author.profile_photo_url, file: undefined }
                : PREVIEW_AUTHOR_IMAGE,
            password: "",
        })
    }

    const hasChanges = useDeepCompareMemo(() => {
        if (author?.name !== formData.name) {
            return true
        }
        if (author?.email !== formData.email) {
            return true
        }
        if (author?.profession !== formData.profession) {
            return true
        }
        if (author?.about !== formData.about) {
            return true
        }
        if (author?.profile_photo_url !== formData.imageFile?.previewUrl) {
            return true
        }
        if (formData.password) {
            return true
        }
        return false
    }, [formData, author])

    const handleUpdate = useDeepCompareCallback(async () => {
        if (!author) return

        // Validation
        if (!formData.name.trim()) {
            toast.error("Name is required")
            return
        }
        if (!formData.email.trim()) {
            toast.error("Email is required")
            return
        }

        const updatedAuthor: AuthorUpdates = {
            imageFile: undefined,
        }

        if (formData.imageFile?.file && formData.imageFile.previewUrl !== author?.profile_photo_url) {
            updatedAuthor.imageFile = formData.imageFile
        }
        if (formData.name !== author.name) {
            updatedAuthor.name = formData.name
        }
        if (formData.email !== author.email) {
            updatedAuthor.email = formData.email
        }
        if (formData.profession !== author.profession) {
            updatedAuthor.profession = formData.profession
        }
        if (formData.about !== author.about) {
            updatedAuthor.about = formData.about
        }
        if (formData.password) {
            updatedAuthor.password = formData.password
        }

        // Check if there are any actual changes (excluding the initial imageFile: undefined)
        const hasUpdates = Object.entries(updatedAuthor).some(([key, value]) => {
            if (key === 'imageFile') return value !== undefined
            return value !== undefined
        })

        if (hasUpdates) {
            try {
                await updateAuthor(author.id, updatedAuthor)
                toast.success("Author updated successfully")
            } catch (error: any) {
                toast.error("Failed to update author", error?.message)
            }
        }
    }, [author, formData])

    return { formData, handleChange, isLoading, isUpdating, handleUpdate, handleReset, hasChanges }
}