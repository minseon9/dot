return {
  {
    'vimwiki/vimwiki',
    init = function()
      vim.g.vimwiki_list = {
        {
          path = '~/personal/minseon9.github.io/_wiki/',
          ext = 'md',
        },
      }
      vim.g.vimwiki_conceallevel = 0
    end,
  },
}
