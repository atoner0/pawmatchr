from semantic.embeddings import get_embedding
from semantic.comparison import cosine_similarity, calculate_semantic_score

dog_description = "Buddy is a relaxed senior dog looking for a home to spend his last years in. Gets along well with children and other dogs, but does not mix well with cats"

adopter_notes1 = "I go hiking most weekends and have a large garden, I currently have a friendly older dog at home and a 2 year old cat"
adopter_notes2 = "I enjoy a chill evening and weekend after work and only have time for short walks, would love an older dog to relax with"
adopter_notes3 = "I have 4 children all under 13 so our house can be pretty loud and busy at times, but would love for the kids to be able to grow up with a dog and provide a home for a rescue"

dog_embedding = get_embedding(dog_description)

for label, notes in [("adopter1", adopter_notes1), ("adopter2", adopter_notes2), ("adopter3", adopter_notes3)]:
    adopter_embedding = get_embedding(notes)
    raw = cosine_similarity(dog_embedding, adopter_embedding)
    scaled = calculate_semantic_score(dog_embedding, adopter_embedding)
    print(f"{label} - Raw: {raw:.4f} | Scaled: {scaled:.4f}")