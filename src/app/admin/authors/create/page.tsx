'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

import { Save } from 'lucide-react';
import { useCreateAuthorForm } from '@/features/author/hooks/useCreateAuthorForm';
import AuthorForm from '@/features/author/components/author-form';


export default function AuthorCreateForm() {
    const { formData, handleChange, handleReset, handlePublish, isCreating } = useCreateAuthorForm()

    return (
        <>
            <div className="space-y-6">
                <AuthorForm
                    data={formData}
                    onChange={handleChange}
                />

                <div className="flex items-left  gap-3">
                    <Button onClick={handlePublish} disabled={isCreating}>
                        {isCreating ? 'Publishing...' : 'Publish'}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isCreating}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </>
    );
}
