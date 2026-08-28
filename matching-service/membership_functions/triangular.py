import numpy as np

def triangular(x: float, a: float, b: float, c: float) -> float:
    """
    Triangular membership function using if-else statements.
    - a: where membership starts rising
    - b: the peak (full membership)
    - c: where the membership returns to 0
    """
    if x ==b:
        return 1.0
    
    if x <= a or x >= c:
        return 0.0
    elif x < b:
        return (x - a) / (b - a)
    else:
        return (c - x) / (c - b)
    
def triangular_batch(x: np.ndarray, a: float, b: float, c: float) -> np.ndarray:
    """
    Vectorised triangular membership function

    Denominators are guarded to avoid divide-by-zero warnings when a == b or b == c
        Resulting values are never selected in those cases
    """
    ### AI-assisted (Claude) - Vectorisation from scalar triangular function ###
    x = np.asarray(x, dtype=float)

    # guard to not divide by 0, 1.0 may be "wrong" but doesn't matter, result won't be selected in final output
    rising_denom = (b - a) if (b - a) != 0 else 1.0
    falling_denom = (c - b) if (c - b) != 0 else 1.0

    rising = (x - a) / rising_denom
    falling = (c - x) / falling_denom

    #if x is left of peak, use the rising formula, otherwise use falling 
    result = np.where(x < b, rising, falling)
    #zero anything outside of a or c
    result = np.where((x <= a) | (x >= c), 0.0, result)
    #force peak to be 1.0
    result = np.where(x == b, 1.0, result)

    return result