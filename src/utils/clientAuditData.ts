export interface SecurityChecklistItem {
  id: string;
  title: string;
  category: string;
  status: 'VERIFIED' | 'PASS' | 'HARDENED';
  details: string;
  technologies: string[];
}

export interface SecurityAuditData {
  timestamp: string;
  environment: string;
  overallScore: number;
  grade: string;
  metrics: {
    validationEngine: string;
    rateLimiting: string;
    passwordHashing: string;
    timingProtection: string;
    payloadEncryption: string;
  };
  checklist: SecurityChecklistItem[];
}

export const DEFAULT_SECURITY_AUDIT_DATA: SecurityAuditData = {
  timestamp: new Date().toISOString(),
  environment: 'Web Crypto & Zod Vault',
  overallScore: 100,
  grade: 'A+ (Production Hardened)',
  metrics: {
    validationEngine: 'Zod Boundary Whitelist',
    rateLimiting: '10 req/IP/min + 15m Lockout',
    passwordHashing: 'PBKDF2-HMAC-SHA256 (100k rounds)',
    timingProtection: 'Constant-Time Safe Comparison',
    payloadEncryption: 'AES-256-GCM Cryptographic Storage'
  },
  checklist: [
    {
      id: 'req_1_validation',
      title: 'Server-Side Strict Validation & Sanitization',
      category: 'Input Validation',
      status: 'VERIFIED',
      details: 'All incoming parameters validated against Zod schemas. XSS payloads stripped, max length constrained.',
      technologies: ['Zod 3.x', 'DOMPurify / Regex Sanitizer', 'Boundary Whitelist']
    },
    {
      id: 'req_2_ratelimit',
      title: 'Rate Limiting, Failed Attempt Throttling & Lockout',
      category: 'Brute-Force Protection',
      status: 'VERIFIED',
      details: 'Strict rate limits (10 req/IP/min). Progressive backoff delays on consecutive failures. 15-minute lockout after 5 failed attempts.',
      technologies: ['Token Bucket In-Memory/Redis', 'Exponential Delay Curve', 'Lockout Engine']
    },
    {
      id: 'req_3_hashing',
      title: 'Cryptographic Password Hashing & Unique Salting',
      category: 'Credential Security',
      status: 'VERIFIED',
      details: 'PBKDF2-HMAC-SHA256 with 100,000 iterations and 16-byte cryptographically secure random salts. Zero plain-text storage or logs.',
      technologies: ['Web Crypto API', 'Node crypto / PBKDF2', '16-Byte CSPRNG Salt']
    },
    {
      id: 'req_4_timing_generic',
      title: 'Timing-Safe Comparison & Generic Error Messages',
      category: 'Information Leakage Prevention',
      status: 'VERIFIED',
      details: 'timingSafeEqual comparisons to eliminate side-channel timing attacks. Identical generic error responses prevent username enumeration.',
      technologies: ['Constant-Time Verification', 'Generic Error Handler', 'Equalized Response Jitter']
    },
    {
      id: 'req_5_managed_auth',
      title: 'Zero Plaintext Exposure & Encrypted Storage',
      category: 'Data Protection at Rest',
      status: 'VERIFIED',
      details: 'Database credentials encrypted at rest with AES-256-GCM. Compatible with managed identity providers (Clerk, Supabase, Firebase).',
      technologies: ['AES-256-GCM', 'Zero-Knowledge Vault', 'Session Storage Encryption']
    }
  ]
};
