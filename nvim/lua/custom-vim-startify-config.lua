return {
	{
		"mhinz/vim-startify",
		config = function()
			vim.g.startify_bookmarks = { "~/minseon9.github.io/_posts/wiki/index.md" }
			vim.g.startify_session_sort = 1
			vim.g.startify_lists = {
				{ type = "sessions", header = { "   Sessions" } },
				{ type = "files", header = { "   MRU" } },
				{ type = "bookmarks", header = { "   Bookmarks" } },
				{ type = "commands", header = { "   Commands" } },
			}
		end,
	},
}
