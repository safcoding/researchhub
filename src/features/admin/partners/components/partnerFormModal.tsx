"use client"

import { PartnerForm } from "./partnerForm"
import { Dialog, DialogContent } from "@/components/ui/dialog" 
import { Partner } from "./columns"
import { DialogTitle } from "@radix-ui/react-dialog"

interface PartnerFormModalProps {
    isOpen: boolean
    onClose: () => void
    partner?: Partner
    onSuccess?: () => void
}

export function PartnerFormModal({ isOpen, onClose, partner, onSuccess }: PartnerFormModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogTitle/>
                <PartnerForm partner={partner} onSuccess={onSuccess} />
            </DialogContent>
        </Dialog>
    )
}