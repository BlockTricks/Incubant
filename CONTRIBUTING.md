# Contributing to Incubant

Thank you for your interest in contributing to Incubant! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/Incubant.git
   cd Incubant
   ```
3. **Set up the development environment**
   ```bash
   npm install
   cd frontend && npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Smart Contracts (Clarity)

1. **Write contracts** in `contracts/`
2. **Check syntax**
   ```bash
   npm run check
   ```
3. **Write tests** in `tests/`
4. **Run tests**
   ```bash
   npm test
   ```

### Frontend (Next.js)

1. **Make changes** in `frontend/`
2. **Run dev server**
   ```bash
   cd frontend && npm run dev
   ```
3. **Lint code**
   ```bash
   npm run lint
   ```

## Commit Guidelines

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

Example:
```
feat: add milestone verification UI
fix: resolve theme toggle hydration issue
docs: update deployment instructions
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** (if applicable)
5. **Create a pull request** with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots (for UI changes)

## Code Style

- **Clarity**: Follow Clarity style guide
- **TypeScript/React**: Use ESLint and Prettier
- **Format code** before committing:
  ```bash
  npm run format
  ```

## Testing

- Write tests for all new features
- Ensure existing tests still pass
- Aim for good test coverage

## Questions?

Open an issue or reach out to the maintainers.

Thank you for contributing! 🚀

