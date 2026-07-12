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
