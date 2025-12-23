import { useAuth } from "@/features/auth/hooks/useAuth"
import { UserRole } from "@/types/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const useAuthorLogin = () => {
    const { login, isLoading } = useAuth()
    const router = useRouter()

    const handleAuthor = async (email: string, password: string) => {
        try {
            await login({ email, password, userType: UserRole.AUTHOR })
            router.push("/author/articles")
        } catch (err) {
            toast.error("Author login failed: " + err)
        }
    }
    return { handleAuthor, isLoading }
}