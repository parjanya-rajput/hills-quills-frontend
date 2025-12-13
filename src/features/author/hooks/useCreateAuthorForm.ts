import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PREVIEW_ARTICLE_IMAGE } from "@/types/common"
import { AuthorFormState } from "../components/author-form"
import { useCreateAuthor } from "."


const AuthorFormStateInitial = {
    name: "",
    imageFile: PREVIEW_ARTICLE_IMAGE,
    email: "",
    profession: "",
    about: "",
    password: "",
} as AuthorFormState

export const useCreateAuthorForm = () => {
    const [formData, setFormData] = useState<AuthorFormState>(AuthorFormStateInitial)
    const router = useRouter()

    const [createAuthor, isCreating] = useCreateAuthor();

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleReset = () => {
        setFormData(AuthorFormStateInitial)
    }

    const validateForm = () => {
        if (!formData.name) {
            toast.error("Name is required")
            return false
        }
        if (!formData.email) {
            toast.error("Email is required")
            return false
        }
        if (!formData.profession) {
            toast.error("Profession is required")
            return false
        }
        if (!formData.about) {
            toast.error("About is required")
            return false
        }
        if (!formData.imageFile) {
            toast.error("Image is required")
            return false
        }
        return true
    }

    const handlePublish = async () => {
        if (!validateForm()) {
            return
        }
        try {
            await createAuthor(formData.name, formData.email, formData.profession, formData.about, formData.password, formData.imageFile!)
            toast.success("Author created successfully")
            router.push("/admin/authors")
        } catch (error) {
            toast.error("Failed to create author")
        }
    }

    return { formData, handleChange, handleReset, handlePublish, isCreating }
}