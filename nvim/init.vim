set nocompatible
filetype plugin on
syntax on

call plug#begin()
Plug 'vimwiki/vimwiki'
Plug 'mhinz/vim-startify'
call plug#end()


let maplocalleader = "\\"

"blog 용 wiki, 개인용 wiki
let g:vimwiki_list = [
    \{
    \   'path': '~/blog/_wiki',
    \   'ext' : '.md',
    \   'diary_rel_path': '.',
    \},
    \{
    \   'path': '~/vimwiki',
    \   'ext' : '.md',
    \   'diary_rel_path': '.',
    \},
\]

let g:vimwiki_conceallevel = 0
let g:vimwiki_global_ext = 0
