import { useState, useRef } from "react"
import { useForm, Controller, Resolver } from "react-hook-form"
import { Text, Pressable, View, StyleSheet, TextInput } from "react-native"
import { livingSituationSchema, householdSchema, routineSchema, experienceSchema, prefSchema, QuestionnaireInput } from "@/types/questionnaireSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dropdown } from "@/components/Dropdown"
import { activityLevelOptions, agePrefOptions, genderPrefOptions, homeLocationOptions, homeTypeOptions, hoursAloneOptions, multiPetLevelOptions, outdoorSpaceOptions, petCountOptions, petTypeOptions, sheddingPrefOptions, sizePrefOptions, trainingCommitmentOptions, youngestChildOptions } from "@/constants/questionnaireOptions"
import { YesNoToggle } from "@/components/YesNoToggle"
import { MultiCheckbox } from "@/components/MultiCheckbox"
import { apiFetch } from "@/lib/api"
import { useRouter } from "expo-router"
import { QuestionnaireResponse } from "@/types/adopter"



export default function QuestionnaireScreen() {
    const [step, setStep] = useState(0)
    const [error, setError] = useState("");

    const router = useRouter()

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

    const onSubmit = async (data: QuestionnaireInput) => {
        try {
            const response = await apiFetch<QuestionnaireResponse>('/adopter/questionnaire', {
                method: 'PUT',
                body: JSON.stringify(data)
            })

            router.replace('/(protected)/matches')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
            setError(errorMessage);
        }
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>Section {step + 1} of {totalSteps}</Text>

            {step === 0 && (
                <View>
                    <Controller
                        control={control}
                        name="home_type"
                        render={({ field }) => (
                            <Dropdown
                                label="What type of house do you live in?"
                                options={homeTypeOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.home_type?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="home_location"
                        render={({ field }) => (
                            <Dropdown
                                label="What type of area do you live in?"
                                options={homeLocationOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.home_location?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="outdoor_space"
                        render={({ field }) => (
                            <Dropdown
                                label="How would you describe your outdoor space (may be shared or private)?"
                                options={outdoorSpaceOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.outdoor_space?.message}
                            />
                        )}
                    />
                </View>)}
            {step === 1 && (
                <View>
                    <Controller
                        control={control}
                        name="current_pets"
                        render={({ field }) => (
                            <YesNoToggle
                                label="Do you currently own any pets?"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {watch("current_pets") && (
                        <Controller
                            control={control}
                            name="current_pet_type"
                            render={({ field }) => (
                                <MultiCheckbox
                                    label="What kind of pet do you own? (You can select multiple)"
                                    options={petTypeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.current_pet_type?.message}
                                />
                            )}
                        />
                    )}

                    {watch("current_pets") && (    
                        <Controller
                            control={control}
                            name="current_pet_count"
                            render={({ field }) => (
                                <Dropdown
                                    label="How many pets do you currently own?"
                                    options={petCountOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.current_pet_count?.message}
                                />
                            )}
                        />
                    )}

                    <Controller
                        control={control}
                        name="children"
                        render={({ field }) => (
                            <YesNoToggle
                                label="Do you currently have any children?"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {watch("children") && (    
                        <Controller
                            control={control}
                            name="youngest_child_age"
                            render={({ field }) => (
                                <Dropdown
                                    label="How old is your youngest child?"
                                    options={youngestChildOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.youngest_child_age?.message}
                                />
                            )}
                        />
                    )}

                </View>
            )}

            {step === 2 && (
                <View>
                    <Controller
                        control={control}
                        name="hours_alone"
                        render={({ field }) => (
                            <Dropdown
                                label="On average, how many hours a day would you be leaving a pet alone?"
                                options={hoursAloneOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.hours_alone?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="activity_level"
                        render={({ field }) => (
                            <Dropdown
                                label="On average per day, how would you describe your activity level?"
                                options={activityLevelOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.activity_level?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="training_commitment"
                        render={({ field }) => (
                            <Dropdown
                                label="What level of training are you willing to commit to?"
                                options={trainingCommitmentOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.training_commitment?.message}
                            />
                        )}
                    />
                </View>
            )}

            {step === 3 && (
                <View>
                    <Controller
                        control={control}
                        name="first_time_owner"
                        render={({ field }) => (
                            <YesNoToggle
                                label="Have you owned a dog before?"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {watch("first_time_owner") === false && (    
                        <Controller
                            control={control}
                            name="multi_pet_exp"
                            render={({ field }) => (
                                <YesNoToggle
                                    label="Have you ever owned multiple dogs at the same time?"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    )}

                    {watch("multi_pet_exp") && (    
                        <Controller
                            control={control}
                            name="multi_pet_exp_level"
                            render={({ field }) => (
                                <Dropdown
                                    label="How would you describe your experience owning multiple dogs?"
                                    options={multiPetLevelOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.multi_pet_exp_level?.message}
                                />
                            )}
                        />
                    )}
                </View>
            )}

            {step === 4 && (
                <View>
                    <Controller
                        control={control}
                        name="age_pref"
                        render={({ field }) => (
                            <MultiCheckbox
                                label="What age range would you prefer? (You can select multiple)"
                                options={agePrefOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.age_pref?.message}
                                noneValue="none"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="gender_pref"
                        render={({ field }) => (
                            <Dropdown
                                label="What gender would you prefer?"
                                options={genderPrefOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.gender_pref?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="size_pref"
                        render={({ field }) => (
                            <MultiCheckbox
                                label="What size of dog would you prefer? (You can select multiple)"
                                options={sizePrefOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.size_pref?.message}
                                noneValue="none"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="shedding_pref"
                        render={({ field }) => (
                            <Dropdown
                                label="What is the highest shedding level you would be comfortable with?"
                                options={sheddingPrefOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.shedding_pref?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="pref_notes"
                        render={({ field }) => (
                            <View>
                                <Text>Tell us about your home life and what you're looking for in a dog</Text>
                                <TextInput
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    multiline
                                    placeholder="e.g., your daily routine, your home/neighbourhood, your experience with dogs, and the personality/temperament you're hoping for"
                                />
                            </View>
                        )}
                    />
                </View>
            )}

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

            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        </View>
    )
}

