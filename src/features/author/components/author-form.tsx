import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePicker } from '@/components/molecules/image-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageFile } from '@/types/common';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Briefcase, FileText, Lock } from 'lucide-react';

export interface AuthorFormProps {
    data: AuthorFormState;
    onChange: (field: string, value: any) => void;
    previewImageUrl?: string;
}

export interface AuthorFormState {
    name: string;
    imageFile: ImageFile;
    about: string;
    profession: string;
    email: string;
    password: string;
}

const AuthorFormStateInitial = {
    name: "",
    imageFile: undefined,
    about: "",
    profession: "",
    email: "",
    password: "",
}

const AuthorForm = ({
    data,
    onChange,
}: AuthorFormProps) => {
    const { name, imageFile, about, profession, email, password } = data;

    return (
        <div className="space-y-6">
            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-6">
                        {/* Profile Photo - Left Side */}
                        <div className="space-y-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">Profile Photo</Label>
                            </div>
                            <div className="w-32">
                                <ImagePicker
                                    value={imageFile}
                                    onChange={(imageFile) => onChange('imageFile', imageFile)}
                                    ariaLabel="Upload profile photo"
                                    aspectRatio="1/1"
                                />
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                PNG or JPG up to ~5MB. Square format works best.
                            </p>
                        </div>

                        {/* Form Fields - Right Side */}
                        <div className="flex-1 space-y-4">
                            {/* Name */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                                </div>
                                <Input
                                    id="name"
                                    placeholder="Enter the author's name"
                                    value={name}
                                    onChange={(e) => onChange('name', e.target.value)}
                                    required
                                    className="bg-background"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => onChange('email', e.target.value)}
                                    placeholder="Enter the author's email"
                                    className="bg-background"
                                />
                            </div>

                            {/* Profession */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="profession" className="text-sm font-medium">Profession</Label>
                                </div>
                                <Input
                                    id="profession"
                                    value={profession}
                                    onChange={(e) => onChange('profession', e.target.value)}
                                    placeholder="Enter the author's profession"
                                    className="bg-background"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
                <CardContent className="space-y-4">
                    {/* About */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="about" className="text-sm font-medium">About</Label>
                        </div>
                        <Textarea
                            id="about"
                            value={about}
                            onChange={(e) => onChange('about', e.target.value)}
                            placeholder="Write a brief bio about the author"
                            rows={4}
                            className="resize-none bg-background"
                        />
                        <p className="text-muted-foreground text-xs">
                            A brief biography that will appear on the author's profile
                        </p>
                    </div>

                    {/* Password */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => onChange('password', e.target.value)}
                            placeholder="Enter a secure password"
                            className="bg-background"
                        />
                        <p className="text-muted-foreground text-xs">
                            Must be at least 8 characters long
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthorForm;