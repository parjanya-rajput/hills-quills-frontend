"use client"
import { useParams, useRouter } from "next/navigation"
import { useAuthorById } from "@/features/author/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Briefcase, Calendar, User } from "lucide-react"
import Image from "next/image"
import { StatusBadge } from "@/components/molecules/status-badge"
import { StatusAuthor } from "@/types/common"

export default function AuthorDetailPage() {
    const params = useParams()
    const router = useRouter()

    const authorId = params.id as string
    const { author, isLoading: loading, error } = useAuthorById(Number(authorId))

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (loading || !author) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading author details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <p className="text-red-600">Error loading author details</p>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/authors")}
                            className="mt-4"
                        >
                            Back to Authors
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/admin/authors")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Author Details</h1>
                        <p className="text-muted-foreground">
                            View author information and profile
                        </p>
                    </div>
                </div>
            </div>

            {/* Author Profile Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                                {author.profile_photo_url ? (
                                    <Image
                                        src={author.profile_photo_url}
                                        alt={author.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                        <User className="h-12 w-12 text-primary/50" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-3xl mb-2">{author.name}</CardTitle>
                                <StatusBadge
                                    status={author.is_active === 1 ? StatusAuthor.Active : StatusAuthor.Deleted}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm font-medium">Email</span>
                            </div>
                            <p className="text-base pl-6">{author.email || "Not provided"}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Briefcase className="h-4 w-4" />
                                <span className="text-sm font-medium">Profession</span>
                            </div>
                            <p className="text-base pl-6">{author.profession || "Not provided"}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm font-medium">Member Since</span>
                            </div>
                            <p className="text-base pl-6">{formatDate(author.created_at)}</p>
                        </div>
                    </div>

                    {/* About Section */}
                    {author.about && (
                        <div className="space-y-2 pt-4 border-t">
                            <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                            <p className="text-base leading-relaxed">{author.about}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
