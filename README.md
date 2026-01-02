# mangi-bevi

Food lover app for everyone

# How to build/develop this app?
## Install everything in cachyOS
`git clone`
`sudo pacman -Syu code`
`paru -S android-studio`
`npm i`
`export ANDROID_HOME=/home/tommy/Android/Sdk`
`npx expo login` (follow the auth)

## To start debugging
Start a device in android studio

`sudo npx expo start --tunnel`

(to be able to install ngrok extension for the first time)

⚠️ next start must be without sudo or the env is not forwarded properly:

`npx expo start --tunnel`


press `a` to debug in android emulator
Happy debugging ☺️


## Recommended vs code extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension equimper.react-native-react-redux
code --install-extension esbenp.prettier-vscode
code --install-extension expo.vscode-expo-tools
code --install-extension hbenl.vscode-test-explorer
code --install-extension jbockle.jbockle-format-files
code --install-extension ms-vscode.powershell
code --install-extension ms-vscode.test-adapter-converter
code --install-extension msjsdiag.vscode-react-native
code --install-extension orta.vscode-jest
code --install-extension pkief.material-icon-theme
code --install-extension redhat.vscode-yaml
code --install-extension streetsidesoftware.code-spell-checker
