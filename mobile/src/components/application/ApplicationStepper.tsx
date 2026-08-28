import { colors, radii, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export type StepState = 'complete' | 'in_progress' | 'pending';

export interface StepperStep {
    label: string;
    state: StepState;
    countLabel?: string;
}

interface ApplicationStepperProps {
    steps: StepperStep[];
}

export default function ApplicationStepper({ steps }: ApplicationStepperProps) {
    const getStateText = (step: StepperStep) => {
        if (step.state === 'complete') return 'complete';
        if (step.state === 'in_progress') return step.countLabel ? `in progress, ${step.countLabel}` : 'in progress';
        return 'pending';
    }

    return (
        <View style={styles.stepper}>
            {steps.map((step, i) => {
                const isComplete = step.state === 'complete';
                return (
                    <View key={step.label} style={styles.stepGroup}>
                        <View 
                            style={styles.step}
                            accessible={true}
                            accessibilityLabel={`${step.label}: ${getStateText(step)}`}
                        >
                            <View style={[styles.stepCircle, isComplete ? styles.stepComplete : styles.stepUpcoming]}>
                                {isComplete && <Ionicons name="checkmark" size={16} color={colors.textOnDark} />}
                                {!isComplete && step.countLabel && (
                                    <Text style={styles.stepCount}>{step.countLabel}</Text>
                                )}
                                {!isComplete && step.state === 'pending' && <Ionicons name="flag-outline" size={16} color={colors.textOnDark} />}
                            </View>
                            <Text style={styles.stepLabel}>{step.label}</Text>
                        </View>
                        {i < steps.length - 1 && <View style={styles.stepLine} />}
                    </View>
            )})}
        </View>
    );
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    stepper: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: colors.card,
        borderRadius: radii.lg,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm + 6,
        padding: spacing.md,
    },
    step: {
        alignItems: "center",
        flex: 1,
    },
    stepGroup: {
        flexDirection: "row",
        alignItems: "flex-start",
        flex: 1,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    stepComplete: {
        backgroundColor: colors.navyMid,
    },
    stepUpcoming: {
        backgroundColor: colors.accentTealDarker,
    },
    stepCount: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.textOnDark,
    },
    stepLabel: {
        fontSize: 11,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        textAlign: "center",
    },
    stepLine: {
        height: 1,
        backgroundColor: colors.cardBorder,
        flex: 0.5,
        marginTop: spacing.md,
    },
})