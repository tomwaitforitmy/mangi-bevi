#!/usr/bin/env fish

#Usage:
# chmod +x scripts/prerelease.fish
# ./scripts/prerelease.fish patch
# ./scripts/prerelease.fish minor
# ./scripts/prerelease.fish            # prompts interactively
# ./scripts/prerelease.fish patch --check-deps   # opt-in dependency check
#Or via npm:
# npm run prerelease -- patch
# npm run prerelease -- minor
# npm run prerelease            # prompts interactively
# npm run prerelease -- patch --check-deps


set -l bump_type $argv[1]
set -l check_deps false

# allow --check-deps anywhere in the args
for arg in $argv
    if test "$arg" = "--check-deps"
        set check_deps true
    end
end

# strip flags to find the actual bump type argument
set -l positional
for arg in $argv
    if test "$arg" != "--check-deps"
        set positional $positional $arg
    end
end
set bump_type $positional[1]

# ask if not provided or invalid
if not contains -- $bump_type patch minor major
    echo "Choose version bump type:"
    echo "  1) patch"
    echo "  2) minor"
    echo "  3) major"
    read -P "Enter 1, 2, or 3: " choice
    switch $choice
        case 1
            set bump_type patch
        case 2
            set bump_type minor
        case 3
            set bump_type major
        case '*'
            echo "Invalid choice. Aborting."
            exit 1
    end
end

echo "→ Running tests..."
npm test
if test $status -ne 0
    echo "✗ Tests failed. Aborting release."
    exit 1
end
echo "✓ Tests passed."

if test "$check_deps" = true
    echo "→ Checking Expo dependency versions..."
    npx expo install --check
    if test $status -ne 0
        echo "✗ expo install --check reported issues. Review before continuing."
        exit 1
    end
    echo "⚠ Dependencies were checked/updated — remember to rebuild and test your dev client before submitting!"
end

echo "→ Bumping $bump_type version..."
npm version $bump_type --no-git-tag-version
if test $status -ne 0
    echo "✗ Version bump failed."
    exit 1
end

set -l new_version (node -p "require('./package.json').version")
echo "✓ Version bumped to $new_version"

# sync into app.json (skip this block if you migrate to app.config.js instead)
node -e "
  const fs = require('fs');
  const app = require('./app.json');
  app.expo.version = '$new_version';
  fs.writeFileSync('./app.json', JSON.stringify(app, null, 2) + '\n');
"
echo "✓ Synced version into app.json"

echo "→ Committing and pushing..."
git add -A
git commit -m "chore: bump version to $new_version"
git push

echo "✓ Prerelease steps complete. Version: $new_version"