"use client"
import { useParams } from "next/navigation"
import { useStoryById } from "@/features/web-story/hooks"
import { WebStoryViewer } from "@/features/web-story/component/web-story-viewer"


const StoryDetailPage = () => {
    const params = useParams()
    const {story, isLoading, error} = useStoryById(Number(params.id))

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return <WebStoryViewer onClose={() => {}} story={story!} />
}

export default StoryDetailPage;