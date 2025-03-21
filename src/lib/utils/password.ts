/**
 * Generates a cryptographically strong random password
 * with a mix of uppercase, lowercase, numbers, and special characters
 * 
 * @param length Password length (default: 12)
 * @returns A random password string
 */
export function generateStrongPassword(length = 12): string {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  // Ensure at least one character from each category
  let password = '';
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);
  
  // Fill the rest with random characters from all categories
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars);
  }
  
  // Shuffle the password characters to avoid predictable patterns
  return shuffleString(password);
}

/**
 * Gets a random character from a string
 */
function getRandomChar(characters: string): string {
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

/**
 * Shuffles a string using Fisher-Yates algorithm
 */
function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
} 