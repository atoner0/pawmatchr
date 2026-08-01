import { View, Text, StyleSheet } from "react-native";
import { MatchWithDog } from "@/types/match";
import { ageLabel, coatLengthLabel, coatTypeLabel, getDogLabel, sheddingLevelLabel, sizeLabel } from "@/constants/dogLabels";

type Props = {
    match: MatchWithDog;
};

export default function AttributeGrid({ match }: Props) {
    const { dog } = match;

    return (
        <View>
            <View style={styles.boxContainer}>
                <View style={styles.box}>
                    <Text style={styles.boxTitle}>Colour</Text>
                    <Text style={styles.boxText}>{dog.colour.join(', ')}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={styles.boxTitle}>Age</Text>
                    <Text style={styles.boxText}>{getDogLabel(ageLabel, dog.age)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={styles.boxTitle}>Size</Text>
                    <Text style={styles.boxText}>{getDogLabel(sizeLabel, dog.size)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={styles.boxTitle}>Coat Length</Text>
                    <Text style={styles.boxText}>{getDogLabel(coatLengthLabel, dog.coat_length)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={styles.boxTitle}>Coat Type</Text>
                    <Text style={styles.boxText}>{getDogLabel(coatTypeLabel, dog.coat_type)}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={styles.boxTitle}>Shedding</Text>
                    <Text style={styles.boxText}>{getDogLabel(sheddingLevelLabel, dog.shedding_level)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boxContainer: { 
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    box: {
        width: "31%",
        backgroundColor: "#fff8f0",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    boxTitle: {
        fontSize: 14,
    },
    boxText: {
        fontSize: 14,
        fontWeight: "700"
    },
})