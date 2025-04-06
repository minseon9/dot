# MAC 환경에서 brew로 설치한 경우, 해당 PATH로 경로 변경
export PATH="/opt/homebrew/opt/rbenv/bin:$PATH"
eval "$(rbenv init - --no-rehash zsh)"
