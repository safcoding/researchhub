"use client"

import { PartnerForm } from "./partnerForm"
import { Dialog, DialogContent } from "@/components/ui/dialog" 
import { Partner } from "./columns"

interface PartnerFormModalProps {
    isOpen: boolean
    onClose: () => void
    partner?: Partner
}

export function PartnerFormModal({ isOpen, onClose, partner }: PartnerFormModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                <PartnerForm partner={partner} />
            </DialogContent>
        </Dialog>
    )
}