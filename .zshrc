# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# ZSH Theme
ZSH_THEME="agnoster"

plugins=(git)

source $ZSH/oh-my-zsh.sh

## Ruby
export PATH=$HOME/.rbenv/bin:$PATH
eval "$(rbenv init - zsh)"

## SDKMAN
export SDKMAN_DIR=$(brew --prefix sdkman-cli)/libexec
[[ -s "${SDKMAN_DIR}/bin/sdkman-init.sh" ]] && source "${SDKMAN_DIR}/bin/sdkman-init.sh"

## OpenJDK
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"

# bun completions
[ -s "/Users/yeseo/.bun/_bun" ] && source "/Users/yeseo/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"


## Flutter
### FVM
export PATH="$HOME/.fvm_flutter/bin:$PATH"
alias flutter="fvm flutter"

export PATH="$PATH":"$HOME/.pub-cache/bin"
export PATH="$PATH":"$HOME/fvm/versions/stable/bin/cache/dart-sdk/bin"

### [Completion]
### Completion scripts setup. Remove the following line to uninstall
[[ -f $HOME/.dart-cli-completion/zsh-config.zsh ]] && . $HOME/.dart-cli-completion/zsh-config.zsh || true
### [/Completion]

### cocoapods
export PATH=$HOME/.gem/bin:$PATH

