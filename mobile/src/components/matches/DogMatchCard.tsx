import { ScrollView, View, Text, StyleSheet } from "react-native";
import MatchHeader from "./MatchHeader";
import AttributeGrid from "./AttributeGrid";
import CompatibilitySection from "./CompatibilitySection";
import RoutineSection from "./RoutineSection";
import TagList from "./TagList";
import { MatchWithDog } from "@/types/match";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { ReactNode } from "react";

type Props = {
    match: MatchWithDog;
    footer?: ReactNode;
}

export default function DogMatchCard({ match, footer }: Props) {
    const { dog } = match;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <MatchHeader match={match}/>
            <AttributeGrid match={match}/>

            <View style={styles.section}>
                <Text style={typography.sectionTitle}>Description</Text>
                <View style={styles.box}>
                   <Text style={typography.body}>{dog.description}</Text> 
                </View>
            </View>

            <CompatibilitySection match={match}/>
            <RoutineSection match={match}/>

            {(dog.medical_issues.length > 0 || dog.behavioural_flags.length > 0 || dog.known_triggers.length > 0 || dog.medical_notes || dog.behavioural_notes || dog.trigger_notes) && (
                <View style={styles.section}>
                    <Text style={typography.sectionTitle}>Things to Know</Text>
                    <View style={styles.box}>
                        <TagList label="Medical Issues" tags={dog.medical_issues} notes={dog.medical_notes} />
                        <TagList label="Behavioural Issues" tags={dog.behavioural_flags} notes={dog.behavioural_notes} />
                        <TagList label="Known Triggers" tags={dog.known_triggers} notes={dog.trigger_notes} />
                    </View>
                </View>
        )}

        {footer}
        </ScrollView>
    );
}

/*** AI assisted (Claude) - styling generated based on mock up designs ***/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
        gap: spacing.md,
    },
    section: {
        gap: spacing.sm,
    },
    box: {
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.sm + 4,
    },
})
