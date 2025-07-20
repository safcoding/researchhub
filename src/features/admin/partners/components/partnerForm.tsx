"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addPartner,  editPartner } from "../server/partners"
import { useFormStatus, useFormState } from "react-dom"
import { useState, useEffect } from "react"
import imageCompression from "browser-image-compression"
import { Partner } from "./columns"
import Image from "next/image"

interface FormState {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

export function PartnerForm({partner}: {partner?: Partner}){
    const [formState, action] = useFormState(
        partner == null ? addPartner : editPartner.bind(null, partner.partner_id),
        { message: "", errors: {}} as FormState
    )
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isCompressing, setIsCompressing] = useState(false)

    useEffect(() => {
        if (formState.errors && Object.keys(formState.errors).length > 0) {
            setImagePreview(null)
            const fileInput = document.getElementById('image') as HTMLInputElement
            if (fileInput) {
                fileInput.value = ''
            }
        }
    }, [formState.errors])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsCompressing(true)
            
            const options = {
                maxSizeMB: 1, 
                maxWidthOrHeight: 1920, 
                useWebWorker: true,
                fileType: 'image/webp' as const,
                quality: 0.85
            }

            const compressedFile = await imageCompression(file, options)
        
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(new File([compressedFile], file.name, {
                type: compressedFile.type,
                lastModified: Date.now()
            }))
            
            if (e.target) {
                e.target.files = dataTransfer.files
            }
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target?.result as string)
            reader.readAsDataURL(compressedFile)
            
        } catch (error) {
            console.error('Error compressing image:', error)
        } finally {
            setIsCompressing(false)
        }
    }

    return (
        <form action={action} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Partner Name</Label>
                <Input type="text" id="name" name="name" required defaultValue={partner?.name || ""} />
                {formState.errors?.name && (
                    <div className="text-destructive text-sm">{formState.errors.name[0]}</div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Partner  Logo</Label>
                <Input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    required={!partner}
                    onChange={handleImageChange}
                />
                {isCompressing && (
                    <p className="text-sm text-blue-600">Compressing image...</p>
                )}
                
                <p className="text-xs text-gray-500">
                    Images will be automatically compressed to under 1MB
                </p>
                
                {imagePreview && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Preview:</p>
                        <Image 
                            src={imagePreview} 
                            alt="Image preview" 
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}
                
                {partner?.image && !imagePreview && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">Current image:</p>
                        <Image 
                            src={partner.image} 
                            alt="Current event image" 
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                )}
                
                {formState.errors?.image && (
                    <div className="text-destructive text-sm">{formState.errors.image[0]}</div>
                )}
            </div>

            <SubmitButton/>
        </form>
    )
}

function SubmitButton(){
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
    )
}