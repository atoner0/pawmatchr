import { useState, useRef } from "react"
import { useForm, Controller, Resolver } from "react-hook-form"
import { Text, Pressable, View, StyleSheet, TextInput, ScrollView } from "react-native"
import { livingSituationSchema, householdSchema, routineSchema, experienceSchema, prefSchema, QuestionnaireInput } from "@/types/questionnaireSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dropdown } from "@/components/questionnaire/Dropdown"
import { activityLevelOptions, agePrefOptions, genderPrefOptions, homeLocationOptions, homeTypeOptions, hoursAloneOptions, multiPetLevelOptions, outdoorSpaceOptions, petCountOptions, petTypeOptions, sheddingPrefOptions, sizePrefOptions, trainingCommitmentOptions, youngestChildOptions } from "@/constants/questionnaireOptions"
import { YesNoToggle } from "@/components/questionnaire/YesNoToggle"
import { MultiCheckbox } from "@/components/questionnaire/MultiCheckbox"
import { apiFetch } from "@/lib/api"
import { useRouter } from "expo-router"
import { QuestionnaireResponse } from "@/types/adopter"
import { colors, radii, spacing, typography } from "@/constants/theme"
import { SafeAreaView } from "react-native-safe-area-context"

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

    const sectionLabels=["Living Situation", "Household", "Routine", "Experience", "Preferences"]

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

            router.replace('/(protected)/(drawer)/(tabs)/matches/swipe')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
            setError(errorMessage);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.progressHeader}>
                <View style={styles.progressLabelRow}>
                    <Text style={styles.sectionActive}>Section {step + 1}</Text>
                    <Text style={styles.sectionName}>{sectionLabels[step]}</Text>
                </View>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, {width: `${((step + 1) / totalSteps) * 100}%`}]}/>
                </View>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                {step === 0 && (
                    <View style={styles.stepBlock}>
                        <Controller
                            control={control}
                            name="home_type"
                            render={({ field }) => (
                                <Dropdown
                                    title="Home Type"
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
                                    title="Home Location"
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
                                    title="Outdoor Space"
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
                    <View style={styles.stepBlock}>
                        <Controller
                            control={control}
                            name="current_pets"
                            render={({ field }) => (
                                <YesNoToggle
                                    title="Current Pets"
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
                                        title="Current Pet Type"
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
                                        title="Current Pet Count"
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
                                    title="Children"
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
                                        title="Youngest Child Age"
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
                    <View style={styles.stepBlock}>
                        <Controller
                            control={control}
                            name="hours_alone"
                            render={({ field }) => (
                                <Dropdown
                                    title="Hours Alone"
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
                                    title="Activity Level"
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
                                    title="Training Commitment"
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
                    <View style={styles.stepBlock}>
                        <Controller
                            control={control}
                            name="first_time_owner"
                            render={({ field }) => (
                                <YesNoToggle
                                    title="First Time Owner"
                                    label="Have you owned a dog before?"
                                    value={!field.value}
                                    onChange={(hasOwned) => field.onChange(!hasOwned)}
                                />
                            )}
                        />

                        {watch("first_time_owner") === false && (    
                            <Controller
                                control={control}
                                name="multi_pet_exp"
                                render={({ field }) => (
                                    <YesNoToggle
                                        title="Multi Pet Experience"
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
                                        title="Multi Pet Experience Level"
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
                    <View style={styles.stepBlock}>
                        <Controller
                            control={control}
                            name="age_pref"
                            render={({ field }) => (
                                <MultiCheckbox
                                    title="Age Preference"
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
                                    title="Gender Preference"
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
                                    title="Size Preference"
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
                                    title="Shedding Preference"
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

                <View style={styles.buttonRow}>
                    { step > 0 && (
                        <Pressable 
                            accessibilityLabel={"Back button"}
                            accessibilityRole="button"
                            onPress={handleBack} 
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </Pressable>
                    )}

                    {step < totalSteps - 1 ? (
                        <Pressable 
                            accessibilityLabel={"Next button"}
                            accessibilityRole="button"
                            onPress={handleNext} 
                            style={[styles.nextButton, step === 0 && styles.nextButtonFull]}
                        >
                            <Text style={typography.button}>Next</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            accessibilityLabel={"Submit button"}
                            accessibilityRole="button" 
                            onPress={handleSubmit(onSubmit)} 
                            style={[styles.nextButton, step === 0 && styles.nextButtonFull]}
                        >
                            <Text style={typography.button}>Submit</Text>
                        </Pressable>
                    )}
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </ScrollView>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    progressHeader: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
    },
    progressLabelRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    sectionActive: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    sectionName: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    progressTrack: {
        height: 3,
        backgroundColor: colors.cardBorder,
        borderRadius: radii.sm,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: colors.navyDark,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xl,
    },
    stepBlock: {
        gap: spacing.md,
    },
    notesBlock: {
        gap: spacing.sm,
    },
    notesInput: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.sm + 4,
        minHeight: 100,
        fontSize: 14,
        color: colors.textPrimary,
        textAlignVertical: "top",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacing.lg,
        gap: spacing.sm,
    },
    backButton: {
        paddingVertical: spacing.sm + 6,
        paddingHorizontal: spacing.md,
    },
    backButtonText: {
        color: colors.textSecondary,
        fontSize: 15,
        fontWeight: "600",
    },
    nextButton: {
        flex: 1,
        backgroundColor: colors.navyMid,
        borderRadius: radii.pill,
        paddingVertical: spacing.sm + 6,
        alignItems: "center",
    },
    nextButtonFull: {
        flex: 1,
    },
    errorText: {
        color: colors.danger,
        textAlign: "center",
        marginTop: spacing.sm,
    }
})

