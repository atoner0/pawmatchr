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