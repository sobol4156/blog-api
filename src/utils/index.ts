/**
 * Generates a random username with a "user-" prefix.
 * @returns {string} A unique username string.
 */
export const genUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);

  const username = usernamePrefix + randomChars;

  return username;
};

/**
 * Generates a URL-friendly slug from a given title.
 * Appends random characters to ensure uniqueness.
 * @param {string} title - The input string to convert to a slug.
 * @returns {string} A unique slug string.
 */
export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]\s-/g, '')
    .replace(/\s+/g, '')
    .replace(/\-+/g, '')

  const randomChars = Math.random().toString(36).slice(2)
  const uniqueSlug = `${slug}-${randomChars}`

  return uniqueSlug
}
