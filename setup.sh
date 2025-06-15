#!/usr/bin/env bash

INDENT='   '
INDENT2="$INDENT$INDENT"
INDENT3="$INDENT2$INDENT"
BACKUP_DIR="~/.backup-dotfiles"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$BACKUP_DIR"

##
echo "\nSHELL을 준비합니다."
if [ "$SHELL" != "/bin/zsh" ]; then
    echo "$INDENT 현재 zsh를 사용하고 있지 않습니다."
    read -p "zsh로 변경하시겠습니까? (y/n): " change_shell

    if [ "$change_shell" == "y" ]; then
        chsh -s /bin/zsh
        echo "로그아웃 후 다시 로그인하여 변경 사항이 적용되었는지 확인하세요."
        exit 0
    fi
else
    echo "$INDENT 현재 zsh를 사용하고 있습니다."
fi

##
echo "\nHomebrew가 설치되어 있는지 검사합니다."
if ! command -v brew &> /dev/null; then
    echo "Homebrew가 설치되어 있지 않습니다."

    read -p "$INDENT Homebrew를 설치하시겠습니까? (y/n): " install_brew

    if [ "$install_brew" == "y" ]; then
        # https://brew.sh/index_ko
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

	eval "$(/opt/homebrew/bin/brew shellenv)"
        echo "$INDENT Homebrew가 설치되었습니다."
    fi
else
    echo "$INDENT Homebrew가 이미 설치되어 있습니다."
fi

##
echo "\nBrewfile 실행을 준비합니다."
if [ ! -e ./Brewfile ]; then
    echo "$INDENT Brewfile이 현재 경로에 없습니다. Brewfile이 있는 경로에서 스크립트를 실행하세요."
    exit 1
fi
if [ -e ./Brewfile ]; then
    echo "$INDENT Brewfile이 현재 경로에 있습니다."
    read -p "$INDENT2 brew bundle를 실행하시겠습니까? (y/n): " user_input

    if [ "$user_input" == "y" ]; then
        echo "$INDENT3 brew bundle를 실행합니다."
        brew bundle 
    fi
fi

##
echo "\noh my zsh가 설치되어 있는지 검사합니다."
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "oh my zsh가 설치되어 있지 않습니다."

    read -p "oh my zsh를 설치하시겠습니까? (y/n): " install_omz

    if [ "$install_omz" == "y" ]; then
        # oh-my-zsh 설치 시 자동으로 zsh를 시작하지 않도록 KEEP_ZSHRC=1 설정
        KEEP_ZSHRC=1 RUNZSH=no sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

        echo "$INDENT oh my zsh가 설치되었습니다."

        read -p "fonts를 추가 설치하시겠습니까? (y/n): " install_fonts

        if [ "$install_fonts" == "y" ]; then
            git clone https://github.com/powerline/fonts.git --depth=1
            cd fonts
            sh ./install.sh
            cd .. && rm -rf fonts

            echo "$INDENT fonts가 설치되었습니다."
        fi
    fi
else
    echo "$INDENT oh my zsh가 이미 설치되어 있습니다."
fi

##
echo "\ndot file들을 symlink를 연결합니다."
create_symlink() {
    src="$CURRENT_DIR/$1"
    dest="$2"

    if [ ! -e "$dest" ]; then
        ln -s "$src" "$dest"
        echo "$INDENT $dest 연결 완료."
        return 0
    fi

    echo "$INDENT $dest 가 이미 있습니다."
    read -p "$INDENT2 $dest 를 symlink로 replace 하시겠습니까? (y/n): " user_input
    if [ "$user_input" == "y" ]; then
        mv "$dest" "$BACKUP_DIR/"
        ln -s "$src" "$dest"
        echo "$INDENT3 $dest 가 연결되었습니다. 원본은 $BACKUP_DIR 에 백업되었습니다."
    else
        echo "$INDENT3 $dest 는 건너뜁니다."
    fi
}

create_symlink ".zshrc" "$HOME/.zshrc"
create_symlink ".zprofile" "$HOME/.zprofile"
create_symlink ".ideavimrc" "$HOME/.ideavimrc"

mkdir -p "$HOME/.config"
create_symlink "./nvim" "$HOME/.config/nvim"
