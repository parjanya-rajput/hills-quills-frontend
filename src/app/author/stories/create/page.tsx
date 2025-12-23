'use client';

import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';
import StoryForm from '../../../../features/web-story/component/story-form';
import { useCreateStoryFormAuthor } from '@/features/web-story/hooks/useCreateStoryFormAuthor';


export default function CreateStoryPage() {
  const { formData, handleChange, handleReset, handlePublish, handleSaveDraft, isSubmitting } = useCreateStoryFormAuthor()


  return (
    <div className="mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Story</h1>
        <p className="text-muted-foreground">
          Create engaging visual stories with photos and captions. Each slide will be displayed in
          9:16 aspect ratio.
        </p>
      </div>

      <StoryForm formData={formData} handleChange={handleChange} />

      {/* Actions */}
      <div className="flex  space-x-3 pt-6">
      <Button type="button" onClick={handlePublish} disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          Publish Story
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>

        <Button type="button" variant="destructive" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
