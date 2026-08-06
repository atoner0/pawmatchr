import { View, Text, StyleSheet } from "react-native";



export default function CatIntegrationSection() {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settling your new dog in with your cat</Text>

            <Text style={styles.intro}>
                Shelters don't run a pre-adoption meeting between a resident cat and an adoptable dog. Cats are far more sensitive to unfamiliar, high-stress environments, so this introduction happens gradually at home, after adoption.
            </Text>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Keep them separated at first</Text>
                <Text style={styles.blockText}>
                    Start with your dog and cat in different rooms, doors shut so they can't see each other. This gives both animals time to settle before anything more direct.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Swap scents before anything visual</Text>
                <Text style={styles.blockText}>
                    Exchange bedding or a blanket between them for the first week, continuing until both stay relaxed around the other's scent.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Introduce visually through a barrier</Text>
                <Text style={styles.blockText}>
                    Once scent swapping is going well, let them see each other through a baby gate or puppy pen. Keep these sessions quiet, calm, and short, with supervision at all times.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Always give your cat an escape route</Text>
                <Text style={styles.blockText}>
                    A high, dog-free space your cat can retreat to matters more here than almost anything else, as it lets them control the pace of the introduction.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Expect this to take time</Text>
                <Text style={styles.blockText}>
                    A positive relationship is more likely with a gradual approach, often a week or more, sometimes longer. Let your cat set the pace rather than rushing to a shared space.
                </Text>
            </View>

            <View style={styles.block}>
                <Text style={styles.blockTitle}>Watch for stress, not just hissing</Text>
                <Text style={styles.blockText}>
                    A cat hiding, refusing to eat, or avoiding the litter tray is a sign to slow down, just as important a cue as growling or swatting.
                </Text>
            </View>

        </View>
        
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 8,
    },
    intro: {
        fontSize: 14,
        lineHeight: 20,
        color: "#333",
        marginBottom: 16,
    },
    block: {
        marginBottom: 14,
    },
    blockTitle: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 3,
    },
    blockText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#555",
    },
});
