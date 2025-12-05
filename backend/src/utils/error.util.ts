// src/utils/error.util.ts

/**
 * API-এর জন্য কাস্টম এরর ক্লাস যা HTTP স্ট্যাটাস কোড ধারণ করে।
 */
export class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    // TypeScript/Babel Inheritance Fix
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
