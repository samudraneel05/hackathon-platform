"use server";

import { hash, compare } from "bcrypt";

/**
 * Hashes a password using bcrypt
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/**
 * Verifies a password against a hash
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns True if the password matches the hash, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}
