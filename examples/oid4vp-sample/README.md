# OID4VP NestJS Sample Harness

This is a sample NestJS application designed to demonstrate and test the integration of the `@vdcs/oid4vp-nestjs` package.

It serves as a "harness" to verify that the module imports correctly, configuration is passed properly, and services can be injected and invoked.

## Prerequisites

* Node.js (v18+)
* The `Verifiable-Digital-Credentials` repository cloned locally.

## Setup & Installation

Because `@vdcs/oid4vp-nestjs` is currently in active development, this sample is configured to use the **local version** of the package via `npm link`, rather than pulling from the npm registry.

### 1. Prepare the Library

First, you must build the library source code so the sample app can consume it.

Navigate to the package directory in the main repository:

```bash
cd path/to/Verifiable-Digital-Credentials/packages/oid4vp-nestjs
````

Install dependencies and build:

```bash
npm install
npm run build
```

Register the package for linking:

```bash
npm link
```

### 2\. Setup the Sample App

Navigate to this project's directory:

```bash
cd path/to/oid4vp-sample
```

Install dependencies:

```bash
npm install
```

Link the local library:

```bash
npm link @vdcs/oid4vp-nestjs
```

## Running the Application

Start the development server:

```bash
npm run start:dev
```

You should see logs indicating that `Oid4VpModule` dependencies are initialized and routes are mapped (e.g., `/oid4vp/request`).

## Verification

To verify the integration, make a GET request to the root endpoint:

```bash
curl http://localhost:3000/
```

**Expected Result:**
You should receive a `501 Not Implemented` (or `500 Internal Server Error` in dev mode) response. This confirms:

1.  The module was imported successfully.
2.  The service was injected into the controller.
3.  The controller successfully called the service method (which is currently stubbed).
