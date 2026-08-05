import { ChecklistSection } from "@/types/checklist";

export const readinessChecklistSections: ChecklistSection[] = [
    { 
        title: "Home Readiness",
        items: [
            { id: "home_1", label: "I have secured a safe outdoor space (garden fencing, no escape routes) if applicable" },
            { id: "home_2", label: "I have checked my tenancy agreement/landlord permission allows a dog (if renting)" },
            { id: "home_3", label: "Everyone in my household has agreed to and is prepared for this adoption" },
            { id: "home_4", label: "I understand the shelter will carry out a home visit before final approval" }
        ],
    },
    {
        title: "Budget Awareness",
        info: "Owning a dog is a long-term financial commitment. UK charities estimate a dog costs at least £6,200 over their lifetime (increasing for larger breeds, potentially reaching £18,800) with typical annual costs of £2,000 covering food, insurance, grooming, and routine vet care. Around 40% UK pet owners report worrying about unexpected vet bills, so it's worth budgeting for the unplanned as well as the routine",
        items: [
            { id: "budget_1", label: "I understand the estimated annual cost of dog ownership" },
            { id: "budget_2", label: "I have budgeted for unexpected veterinary expenses, not just routine costs" },
            { id: "budget_3", label: "I have considered pet insurance" },
            { id: "budget_4", label: "I am aware of any additional costs specific to this dog's known medical needs" }
        ],
    },
    {
        title: "Time Commitment",
        items: [
            { id: "time_1", label: "I can commit to the daily exericse and mental stimulation this dog needs" },
            { id: "time_2", label: "I have a plan for the dog's care during work hours or if I travel" },
            { id: "time_3", label: "I understand that settling in, training, and bonding can take weeks to months, especially for a rescue dog" },
            { id: "time_4", label: "I am prepared to seek professional support if behavioural issues arise, rather than assuming I should manage alone" }
        ]
    }
];