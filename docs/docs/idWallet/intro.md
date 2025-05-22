---
sidebar_position: 1
---

# ID Wallet

## Technical Spec Overview

The table below summarizes the different standards supported by this Wallet SDK

| Component                                      | Standard                                                                                                                                       | Purpose                                                                                                                     |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Data format and validation rules to express VC | [SD-JWT VC (draft-ietf-oauth-sd-jwt-vc-08)](https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-08.html)                                | Enables selective disclosure and cryptographic binding of claims in a Verifiable Credential.                                |
| VC issuance                                    | [OpenID for Verifiable Credential Issuance (Implementors Draft v1)](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html) | Defines how an Issuer and a Wallet perform the issuance flow (pre-authorized code flow, credential offer/response).         |
| Holder binding                                 | SD-JWT VC                                                                                                                                      | Ensures the Verifiable Credential is bound to the holder's wallet.                                                          |
| VC presentation                                | [OpenID for Verifiable Presentations (OID4VP 20)](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)                         | Describes how a Holder presents credentials (Verifiable Presentations) to a Verifier, including request and response flows. |
| VC Revocation                                  | [OAuth 2.0 Credential Status List (draft-ietf-oauth-status-list-05)](https://www.ietf.org/archive/id/draft-ietf-oauth-status-list-05.html)     | Defines a status list mechanism for revocation checks (active/revoked) so Verifiers can ascertain a credential's validity.  |
| Decentralized Identifiers                      | [did:web](https://w3c-ccg.github.io/did-method-web/)                                                                                           | Specifies a method for hosting DID documents on HTTPS web domains, enabling domain-based DID resolution for key material.   |
| Cryptographic Suites                           | P-256 (secp256r1), ES256 (JWT)                                                                                                                 | Establishes Elliptic Curve Digital Signature (ECDSA) requirements for signing and signature validation (SHA-256 hashes).    |

## Other features

| Component      | Feature          | Description                              |
| -------------- | ---------------- | ---------------------------------------- |
| Storage        | Secure Storage   | Secure storage of credentials            |
| Key Management | iOS Keychain     | Secure key management system for iOS     |
| Key Management | Android Keystore | Secure key management system for Android |
