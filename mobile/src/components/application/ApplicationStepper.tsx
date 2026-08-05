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
    return (
        <View style={styles.stepper}>
            {steps.map((step, i) => (
                <View key={step.label} style={styles.stepGroup}>
                    <View style={styles.step}>
                        <View style={[
                            styles.stepCircle,
                            step.state === 'complete' && styles.stepComplete,
                            step.state === 'in_progress' && styles.stepInProgress,
                        ]}>
                            {step.state === 'complete' && <Ionicons name="checkmark" size={16} color="#fff" />}
                            {step.state === 'in_progress' && step.countLabel && (
                                <Text style={styles.stepCount}>{step.countLabel}</Text>
                            )}
                            {step.state === 'pending' && <Ionicons name="flag-outline" size={16} />}
                        </View>
                        <Text style={styles.stepLabel}>{step.label}</Text>
                    </View>
                    {i < steps.length - 1 && <View style={styles.stepLine} />}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    stepper: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#fdf3e8",
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 14,
        padding: 16,
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
        borderWidth: 1.5,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    stepComplete: {
        backgroundColor: "#2d6a4f",
        borderColor: "#2d6a4f",
    },
    stepInProgress: {
        backgroundColor: "#9bbf9e",
        borderColor: "#9bbf9e",
    },
    stepCount: {
        fontSize: 11,
        fontWeight: "700",
        color: "#fff",
    },
    stepLabel: {
        fontSize: 11,
        color: "#555",
        marginTop: 4,
        textAlign: "center",
    },
    stepLine: {
        height: 1,
        backgroundColor: "#ccc",
        flex: 0.5,
        marginTop: 16,
    },
})