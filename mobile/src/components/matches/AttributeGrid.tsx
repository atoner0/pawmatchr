import { View, Text, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { ageLabel, coatLengthLabel, coatTypeLabel, getDogLabel, sheddingLevelLabel, sizeLabel } from "@/constants/dogLabels";
import { colors, radii, spacing, typography } from "@/constants/theme";
import { capitaliseFirst } from "@/lib/formatText";

type Props = {
    match: MatchWithDog;
};

export default function AttributeGrid({ match }: Props) {
    const { dog } = match;

    return (
        <View>
            <View style={styles.boxContainer}>
                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Colour</Text>
                    <Text style={typography.gridValue}>{capitaliseFirst(dog.colour.join(', '))}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Age</Text>
                    <Text style={typography.gridValue}>{getDogLabel(ageLabel, dog.age)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Size</Text>
                    <Text style={typography.gridValue}>{getDogLabel(sizeLabel, dog.size)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Neutered</Text>
                    <Text style={typography.gridValue}>{dog.neutered ? 'Yes' : 'No'}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>House-Trained</Text>
                    <Text style={typography.gridValue}>{dog.house_trained ? 'Yes' : 'No'}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Vaccinated</Text>
                    <Text style={typography.gridValue}>{dog.vaccinated ? 'Yes' : 'No'}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Coat Length</Text>
                    <Text style={typography.gridValue}>{getDogLabel(coatLengthLabel, dog.coat_length)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Coat Type</Text>
                    <Text style={typography.gridValue}>{getDogLabel(coatTypeLabel, dog.coat_type)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={typography.gridLabel}>Shedding</Text>
                    <Text style={typography.gridValue}>{getDogLabel(sheddingLevelLabel, dog.shedding_level)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boxContainer: { 
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: spacing.sm,
    },
    box: {
        width: "31%",
        backgroundColor: colors.card,
        borderRadius: radii.md,
        padding: spacing.sm + 4,
        alignItems: "center",
    },
})