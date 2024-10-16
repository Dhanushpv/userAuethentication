# generateotp-ts

A TypeScript library for generating and verifying One-Time Passwords (OTPs) using JSON Web Tokens (JWT).

## Features

- Generate n-digit OTPs
- Set custom expiration time for OTPs
- Verify OTPs with tokens
- Encode and decode OTPs using JWT

## Installation

Install `generateotp-ts` using npm:

```bash
npm install generateotp-ts
```

## Usage

Import and use the `generateOtp` and `verifyOtp` functions in your TypeScript or JavaScript project:

```typescript
import { generateOtp, verifyOtp } from "generateotp-ts";

// Generate a 6-digit OTP with a 5-minute expiration time
const { otp, token } = generateOtp(6, "5m");

console.log("Generated OTP:", otp);
console.log("Token:", token);

// Verify the OTP with the token
const isValidOtp = verifyOtp(otp, token);

console.log("Is OTP valid?", isValidOtp);
```

### generateOtp()

The `generateOtp()` function generates an n-digit OTP and returns an object containing the generated OTP and its corresponding JWT-encoded token.

Function signature:

```typescript
function generateOtp(
  digits: number,
  expiration: string | number | undefined = undefined,
  secret: string = ""
): { otp: number; token: string };
```

### verifyOtp()

The `verifyOtp()` function verifies the provided OTP against the JWT-encoded token and returns `true` if it's valid, or `false` if it's invalid or expired.

Function signature:

```typescript
function verifyOtp(otp: number, token: string, secret: string = ""): boolean;
```
