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


### [Completion]
### Completion scripts setup. Remove the following line to uninstall
[[ -f $HOME/.dart-cli-completion/zsh-config.zsh ]] && . $HOME/.dart-cli-completion/zsh-config.zsh || true
### [/Completion]


## mysql
export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/ian/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/ian/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/ian/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/ian/google-cloud-sdk/completion.zsh.inc'; fi
export PATH="$HOME/.local/bin:$PATH"




## Shortcuts
#
### MCP
obsidian-mcp() {
  nohup npx -y obsidian-mcp@2 serve \
    --vault kkaebi="/Users/ian/obsidian" \
    > "$HOME/.obsidian-mcp.log" 2>&1 &
  
  echo "obsidian-mcp started (PID: $!)"
}
