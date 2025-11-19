import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@database/db';
import { User } from '@database/schemas/user';
import { AuthRequest } from '@shared/types/api';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export async function registerUser(authRequest: AuthRequest): Promise<User> {
    const { email, password } = authRequest;

    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
        [email, passwordHash]
    );

    return newUser.rows[0] as User;
}

export async function loginUser(authRequest: AuthRequest): Promise<{ user: User, token: string }> {
    const { email, password } = authRequest;

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return { user, token };
}

export function verifyToken(token: string): { id: string, email: string } | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
        return decoded;
    } catch (error) {
        return null;
    }
}
