export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
    });
};

export const formatSlot = (isoString: string): string => {
    return new Date(isoString).toLocaleString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
};