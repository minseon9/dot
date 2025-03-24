# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# ZSH Theme
ZSH_THEME="agnoster"

plugins=(git)

source $ZSH/oh-my-zsh.sh

# Export
export PATH=/opt/homebrew/bin:$PATH 
export PATH=$HOME/.rbenv/bin:$PATH
eval "$(rbenv init - zsh)"
