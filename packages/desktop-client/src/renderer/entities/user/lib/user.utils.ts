export const getInitials = (
  displayName: string | undefined,
  userEmail: string | undefined,
) => {
  if (displayName) {
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return userEmail?.slice(0, 2).toUpperCase() || "??";
};
