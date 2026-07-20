import numpy as np

def trapezoidal(x: float, a: float, b: float, c: float, d: float) -> float:
    """
    Trapezoidal membership function using if-else statements.
    - a: where the membership starts to rise
    - b: where membership becomes 1
    - c: where membership starts to fall
    - d: where membership returns to 0
    """
    if x <= a or x >= d:
        return 0.0
    elif a < x < b:
        return (x - a) / (b - a)
    elif b <= x <= c:
        return 1.0
    elif c < x < d:
        return (d - x) / (d - c)
    else:
        return 0.0
    
def trapezoidal_batch(x: np.ndarray, a: float, b: float, c: float, d: float) -> np.ndarray:
    """
    Vectorised trapezoidal membership function
    - x <= a or x >= d -> 0
    - a < x < b -> rising
    - b <= x <= c -> 1
    - c < x < d -> falling

    Denominators are guarded to avoid divide-by-zero warnings when a == b or c == d
        Resulting values are never selected in those cases
    """
    x = np.asarray(x, dtype=float)

    rising_denom = (b - a) if (b - a) != 0 else 1.0
    falling_denom = (d - c) if (d - c) != 0 else 1.0

    rising = (x - a) / rising_denom
    falling = (d - x) / falling_denom

    conditions = [
        (x <= a) | (x >= d),
        (x > a) & (x < b),
        (x >= b) & (x <= c),
        (x > c) & (x < d),
    ]

    choices = [0.0, rising, 1.0, falling]

    return np.select(conditions, choices, default=0.0)