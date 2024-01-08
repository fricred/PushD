# PushD

## Description

PushD is a lightweight npm package designed to automatically generate and update code documentation during the pre-push Git hook. This ensures that your project's documentation remains up-to-date with every code push, enhancing code maintainability and team collaboration.

## Features

- **Automatic Documentation**: Automatically generates documentation for your codebase during the pre-push stage in Git.
- **Easy to Integrate**: Seamlessly integrates with your existing Git workflow.
- **Customizable**: Offers customization options to fit your specific documentation needs.

# Install

```
npm install @fricred/pushd --save-dev
```

# Usage

Edit `package.json > prepare` script and run it once:

```sh
npm pkg set scripts.prepare="@fricred/pushd install"
npm run prepare
```

After installation, configure PushD in your project's pre-push Git hook. Here's a simple example of how to set it up:

# Example configuration code

## Contributing

Contributions to PushD are welcome! Please read our contributing guidelines to get started.

## License

PushD is ISC licensed.
