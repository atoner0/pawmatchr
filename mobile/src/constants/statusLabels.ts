import { ApplicationStatus } from "@/types/applicationSchema"
import { BookingStatus, BookingType } from "@/types/bookingSchema"

export const bookingStatusLabels: Record<BookingStatus, string> = {
    booked: "Booked",
    completed: "Completed",
    cancelled: "Cancelled",
}

export const bookingTypeLabels: Record<BookingType, string> = {
    initial_meet: "Initial Meet",
    home_check: "Home Check",
    pet_introduction: "Pet Introduction",

}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    adopted: "Adopted",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
}