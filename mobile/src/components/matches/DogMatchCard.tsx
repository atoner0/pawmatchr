import { ScrollView, View, Text, StyleSheet } from "react-native";
import MatchHeader from "./MatchHeader";
import AttributeGrid from "./AttributeGrid";
import CompatibilitySection from "./CompatibilitySection";
import RoutineSection from "./RoutineSection";
import TagList from "./TagList";
import { MatchWithDog } from "@/types/match";

type Props = {
    match: MatchWithDog;
}

export default function DogMatchCard({ match }: Props) {
    const { dog } = match;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <MatchHeader match={match}/>
            <AttributeGrid match={match}/>

            <View style={styles.box}>
                <Text style={styles.heading}>Description</Text>
                <Text style={styles.descriptionText}>{dog.description}</Text>
            </View>

            <CompatibilitySection match={match}/>
            <RoutineSection match={match}/>

            {(dog.medical_issues.length > 0 || dog.behavioural_flags.length > 0 || dog.known_triggers.length > 0) && (
                <View style={styles.box}>
                <Text style={styles.heading}>Things to Know</Text>
                <TagList label="Medical Issues" tags={dog.medical_issues}/>
                <TagList label="Behavioural Issues" tags={dog.behavioural_flags}/>
                <TagList label="Known Triggers" tags={dog.known_triggers}/>
            </View>
        )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    box: {
        backgroundColor: "#fff8f0",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    heading: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
    },
})
