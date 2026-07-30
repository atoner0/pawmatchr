import { useState, useRef } from "react"
import { useForm, Controller, Resolver } from "react-hook-form"
import { Text, Pressable, View, StyleSheet } from "react-native"
import { livingSituationSchema, householdSchema, routineSchema, experienceSchema, prefSchema, QuestionnaireInput } from "@/types/questionnaireSchema"
import { zodResolver } from "@hookform/resolvers/zod"



export default function QuestionnaireScreen() {
    const [step, setStep] = useState(0)

    const stepSchemas = [
        livingSituationSchema,
        householdSchema,
        routineSchema,
        experienceSchema,
        prefSchema,
    ]

    const stepRef = useRef(step)
    stepRef.current = step

    function stepResolver(values: any, context: any, options: any) {
        return zodResolver(stepSchemas[stepRef.current] as any)(values, context, options)
    }

    const { control, handleSubmit, watch, formState: { errors } } = useForm<QuestionnaireInput>({
        resolver: stepResolver as unknown as Resolver<QuestionnaireInput>,
        defaultValues: {
            home_type: undefined,
            home_location: undefined,
            outdoor_space: undefined,
            current_pets: false,
            current_pet_type: [],
            current_pet_count: undefined,
            children: false,
            youngest_child_age: undefined,
            hours_alone: undefined,
            activity_level: undefined,
            training_commitment: undefined,
            first_time_owner: false,
            multi_pet_exp: undefined,
            multi_pet_exp_level: undefined,
            age_pref: [],
            gender_pref: undefined,
            size_pref: [],
            shedding_pref: undefined,
            pref_notes: "",
        },
    })

    const totalSteps = stepSchemas.length

    const handleNext = handleSubmit(() => {
        setStep((s) => Math.min(s + 1, totalSteps - 1))
    })

    const handleBack = () => {
        setStep((s) => Math.max(s - 1, 0))
    }

    const onSubmit = (data: QuestionnaireInput) => {

    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>Section {step + 1} of {totalSteps}</Text>

            {step === 0 && <View>{}</View>}
            {step === 1 && <View>{}</View>}
            {step === 2 && <View>{}</View>}
            {step === 3 && <View>{}</View>}
            {step === 4 && <View>{}</View>}

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24 }}>
                { step > 0 && (
                    <Pressable onPress={handleBack}>
                        <Text>Back</Text>
                    </Pressable>
                )}

                {step < totalSteps - 1 ? (
                    <Pressable onPress={handleNext}>
                        <Text>Next</Text>
                    </Pressable>
                ) : (
                    <Pressable onPress={handleSubmit(onSubmit)}>
                        <Text>Submit</Text>
                    </Pressable>
                )}
            </View>
        </View>
    )
}

