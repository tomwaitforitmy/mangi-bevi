# mangi-bevi

Food lover app for everyone

# How to build/develop this app?

`git clone`

## Install everything in cachyOS
`sudo pacman -Syu code`
`paru -S android-studio`

## Install everything in Mint
`sudo apt get code`
`flatpak install flathub com.google.AndroidStudio`

# For all OS
`npm i`

Add android home permanently:
`echo 'export ANDROID_HOME=/home/tommy/Android/Sdk' >> ~/.bashrc`
`source ~/.bashrc`

Auth expo
`npx expo login` (follow the auth)

## To start debugging
Start a device in android studio

(Not sure if I need this)
`sudo chown -R $USER:$USER /usr/local/lib/node_modules /usr/local/bin`
Install the tool
`npm install @expo/ngrok@^4.1.0 --save-dev`

start

`npm start`

press `a` to debug in android emulator
Happy debugging ☺️

### How to fix "TypeError: Error loading Metro config at: /home/tommy/repos/mangi-bevi/metro.config.js configs.toReversed is not a function"
1. Install nvm

    > curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
1. Reload bashrc with 
    > source ~/.bashrc
1. Install nodejs 20 (LTS)

    >nvm install 20

    >nvm use 20

    >nvm alias default 20
1. Restart vs code and re-try

    > npm start


## Recommended vs code extensions
code --install-extension dbaeumer.vscode-eslint

code --install-extension equimper.react-native-react-redux

code --install-extension esbenp.prettier-vscode

code --install-extension expo.vscode-expo-tools

code --install-extension hbenl.vscode-test-explorer

code --install-extension jbockle.jbockle-format-files

code --install-extension ms-vscode.test-adapter-converter

code --install-extension msjsdiag.vscode-react-native

code --install-extension orta.vscode-jest

code --install-extension pkief.material-icon-theme

code --install-extension redhat.vscode-yaml

code --install-extension streetsidesoftware.code-spell-checker

