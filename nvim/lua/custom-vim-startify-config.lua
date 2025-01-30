return {
  {
    'mhinz/vim-startify',
    config = function()
      vim.g.startify_bookmarks = { '~/personal/minseon9.github.io/_wiki/' }
      vim.g.startify_session_sort = 1
      vim.g.startify_lists = {
        { type= 'sessions',  header= {'   Sessions'}       },
        { type= 'files',     header= {'   MRU'}            },
        { type= 'bookmarks', header= {'   Bookmarks'}      },
        { type= 'commands',  header= {'   Commands'}       },
      }
    end,
  },
}


