from schemas import Adopter, Dog

def home_type_compatibility(adopter: Adopter, dog: Dog) -> tuple[float, str | None]:
    """
    Dog's activity level and size both determine how demanding a home type is required.

    If dog activity level is high/very high OR dog size is large/giant:
        Detached = 1.0, Semi-detached = 0.75, Apartment = 0.0

    If dog activity level is medium/moderate OR dog size is medium:
        Detached = 1.0, Semi-detached = 1.0, Apartment = 0.5

    If dog activity level is low AND dog size is small:
        All home types = 1.0
    """
    if dog.activity_level in ("high", "very_high") or dog.size in ("large", "giant"):
        if adopter.home_type == "detached":
            return 1.0, None
        elif adopter.home_type == "semi-detached":
            return 0.75, None
        else:
            return 0.0, None
        
    elif dog.activity_level in ("medium", "moderate") or dog.size == "medium":
        if adopter.home_type in ("detached", "semi-detached"):
            return 1.0, None
        else:
            return 0.5, None
    
    else: #low activity, small size
        return 1.0, None