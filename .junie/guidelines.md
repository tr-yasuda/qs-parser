# Project Guidelines

## Introduction

This document provides development guidelines for the project. All contributors are expected to follow these guidelines.

## Coding Standards

### General Rules

- Code should be clear, readable, and well-commented.
- Variable and function names should be descriptive and reflect their purpose.
- Follow the DRY (Don't Repeat Yourself) principle.
- Use Biome for code formatting and linting (`npm run format` or `pnpm run format`).
- Follow the formatting rules defined in biome.json (spaces for indentation, single quotes, etc.).

### TypeScript Specific Rules

- Make full use of TypeScript's type system.
- Avoid using the `any` type; use more specific types instead.
- Use `type` instead of `interface` for defining custom types.
- Use arrow functions for all function definitions.
- Use spread syntax (`{...obj}`) instead of `Object.assign()` for object copying and merging.
- Use `\d` instead of `[0-9]` and `\D` instead of `[^0-9]` in regular expressions.
- Use `\w` instead of `[A-Za-z0-9_]` and `\W` instead of `[^A-Za-z0-9_]` in regular expressions.
- Use `.` for character classes matching everything (e.g., `[\w\W]`, `[\d\D]`, or `[\s\S]` with s flag).
- Use concise regular expression quantifiers:
  - `x?` for `x{0,1}` (zero or one occurrence)
  - `x*` for `x{0,}` (zero or more occurrences)
  - `x+` for `x{1,}` (one or more occurrences)
  - `x{N}` for `x{N,N}` (exactly N occurrences)
- Always handle exceptions properly:
  - Never silently catch exceptions without logging or handling them
  - Use `console.error` to log exceptions with descriptive messages
  - Include the exception object in the log for debugging purposes
  - Consider adding context information to help diagnose the issue
- Keep cognitive complexity low:
  - Cognitive complexity is a measure of how hard it is to understand the control flow of code
  - Functions with high cognitive complexity are difficult to read, understand, test, and modify
  - Break down complex functions into smaller, more focused functions
  - Extract repeated or complex logic into helper functions
  - Limit the depth of nesting in control structures (if, for, while, etc.)
  - Consider using early returns to reduce nesting
  - Aim for functions that do one thing well

## Workflow

### Git Workflow

- Develop each feature in its own branch.
- Commit messages should be clear and descriptive.
- Ensure your code passes all tests before creating a pull request.

### Review Process

- All code changes need to be reviewed.
- Respond promptly to review comments.
- Code reviews should be constructive and respectful.

## Testing

- Write tests for new code using Vitest.
- Tests should be organized in describe/it blocks for clarity.
- Use the expected API for assertions (e.g., `expect(result).toBe(true)`).
- Include test cases for both valid and invalid inputs.
- Test files should be placed in the `tests` directory with a `.test.ts` extension.
- Run tests using `npm test` or `pnpm test`.
- Strive to maintain high test coverage.

## Documentation

- Update documentation as needed with code changes.
- API changes should be properly documented.
- User-facing documentation should be clear and kept up to date.

## Continuous Integration

- All pull requests must pass the CI pipeline.
- CI failures should be addressed promptly.
- The CI pipeline includes:
  - Type checking with TypeScript
  - Linting with Biome
  - Running tests with Vitest

## Contributing

- Check existing issues and pull requests before contributing.
- For significant changes, open an issue for discussion first.
- Suggestions for improving the codebase are always welcome.
