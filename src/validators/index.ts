/**
 * Validates a participant's name to ensure safety and fit within the UI.
 * @param name The name to validate
 * @returns boolean indicating if name is valid
 */
export function validateParticipantName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, error: "Name cannot be empty!" };
  }
  
  if (trimmed.length > 18) {
    return { isValid: false, error: "Name must be 18 characters or less!" };
  }
  
  // Safe alphanumeric regex + standard emojis
  const nameRegex = /^[a-zA-Z0-9\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: "Name contains unsupported special characters!" };
  }
  
  return { isValid: true };
}

/**
 * Validates a list of participants for a spin action.
 * @param list Array of participant names
 */
export function validateParticipantList(list: string[]): { isValid: boolean; error?: string } {
  if (!list || !Array.isArray(list)) {
    return { isValid: false, error: "Invalid participant list format!" };
  }
  
  if (list.length < 2) {
    return { isValid: false, error: "At least 2 players are required to spin the wheel!" };
  }
  
  if (list.length > 24) {
    return { isValid: false, error: "Too many players! Maximum limit is 24 players." };
  }
  
  return { isValid: true };
}
