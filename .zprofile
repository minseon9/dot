# Brew를 로그인 셸에서 설정하도록 경로 정의
if [ -f "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
elif [ -f "/usr/local/bin/brew" ]; then
    eval "$(/usr/local/bin/brew shellenv)"
fi

# MAC 환경에서 brew로 설치한 경우, 해당 PATH로 경로 변경
export PATH="/opt/homebrew/opt/rbenv/bin:$PATH"
eval "$(rbenv init - --no-rehash zsh)"
