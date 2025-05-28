# Verifiable Digital Credentials (VDCs) 🪪

Welcome to **Verifiable Digital Credentials (VDCs)**, the easiest and most secure way to handle verifiable digital credentials in your apps and services! 🚀

In the fast-evolving world of digital identity management, dealing with various standards like **SD-JWT**, **mDL (ISO)**, and **W3C VCDM** can be overwhelming for developers. Our mission is simple: **to make it easy, fast, and secure** for you to issue, verify, and manage digital credentials without getting lost in the weeds of complex protocols. 💡

Ready to start building the future of digital identity? 🛠️ Let’s get started! 🚀

## Features 🌟

### 🏭 **Batteries Included**

Everything you need for modern identity management is included out of the box! Whether you're building an **Issuer**, **Verifier**, or **Holder (ID Wallet)**, this library has it all. No need to deal with multiple dependencies or configurations—just plug and play! ⚡

### 🛡️ **Secure by Design**

Security is at the core of everything we do. This library is built with **Zero Trust Architecture** and **best security practices** to ensure your credentials are safe, no matter what. 🔐

- Built-in protection against common attack vectors 🛡️
- Regular external security audits to ensure ongoing safety 🔍
- Automatic application of security best practices 🏅

### 🎯 **Type-Safe**

Built with **TypeScript** in mind, this library provides **comprehensive types**, ensuring your code is as safe and predictable as possible. 💎 You'll get full **type-safety** for your objects and APIs, making development smoother and error-free.

- **Comprehensive TypeScript types** for better developer experience 📝
- Detailed **error messages** to help you troubleshoot faster 🛠️

### 🪶 **Lightweight**

Fast, minimal, and efficient. This library is designed to be as lightweight as possible, meaning no unnecessary bloat—just what you need to get the job done quickly and efficiently. ⚡

## Why Choose VDCs? 🤔

- **Easy to Use**: No need to study complex standards or protocols—just use the simple API and get started immediately. 🎉
- **Highly Secure**: You can trust this library to protect your data with top-notch security practices. 🔒
- **Scalable**: Whether you're building a small app or an enterprise-level solution, VDCs scales with your needs. 📈
- **Developer-Friendly**: With intuitive APIs and detailed TypeScript types, you’ll spend more time coding and less time debugging. 💻

## Getting Started 🏁

[Verifiable Digital Credentials Docs](https://vdcs.js.org/)

## Security and Privacy 🛡️

VDCs are built with Security by Design, and Privacy by Design principles at their core. We prioritize safeguarding sensitive user data and upholding privacy.

- 🔑 Secure Key and Data Management: We facilitate secure handling of sensitive key materials and data. The SDK is designed to easily integrate with platform-specific secure storage (like Secure Enclave, Keystore, or HSMs) to minimize key exposure risks and protect data at rest.
- 📉 Data Minimization & Selective Disclosure: We fully support Selective Disclosure. This empowers users to share only the minimum necessary information required for any given verification, significantly reducing data exposure and enhancing user privacy.
- 🔗 Unlinkability: We strive to implement features that support unlinkability, helping to prevent correlation of user activities across different verification services. This protects users from being tracked or profiled based on their credential usage.
- 🛡️ Continuous Security Audits: We conduct regular external security audits to continuously validate and strengthen the library's security posture.
- 🚨 Transparent Vulnerability Handling: We are committed to transparency. We address all reports seriously and work to resolve them swiftly.

## Core Dependencies 📦

- [@sd-jwt/core](https://github.com/openwallet-foundation/sd-jwt-js) - Provides core SD-JWT functionality for selective disclosure
- [@mdoc/mdl](https://github.com/openwallet-foundation-labs/mdl-js) - Implements the mDL (ISO) specification

## Contributing 🤝

We welcome contributions! If you find a bug, want to add a feature, or just have feedback, please feel free to open an issue or create a pull request. 🚀

Detailed instructions can be found in the [Contribution Guide](CONTRIBUTING.md).

## License 📜

This project is licensed under the Apache 2.0 License.

## Stay Updated 🚨

We’re committed to keeping this library secure and up-to-date. To stay informed about new releases and security updates, please star us on GitHub.
