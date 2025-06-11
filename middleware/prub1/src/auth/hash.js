import bcrypt from 'bcrypt';

export const hashPassword = async (plain) => {
  const saltRounds = 12;                 // cost >10 según OWASP 2025 :contentReference[oaicite:2]{index=2}
  return bcrypt.hash(plain, saltRounds);
};

export const comparePassword = async (plain, hash) =>
  bcrypt.compare(plain, hash);
