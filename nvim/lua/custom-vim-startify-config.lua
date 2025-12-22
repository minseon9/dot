return {
	{
		"mhinz/vim-startify",
		config = function()
			vim.g.startify_bookmarks = {
				{ wiki = "~/minseon9.github.io/wiki/index.md" },
				{ blog = "~/minseon9.github.io/blog/index.md" },
				{ project = "~/minseon9.github.io/project/index.md" },
			}
			vim.g.startify_session_sort = 1
			vim.g.startify_lists = {
				{ type = "bookmarks", header = { "   Bookmarks" } },
				{ type = "sessions", header = { "   Sessions" } },
				{ type = "files", header = { "   MRU" } },
				{ type = "commands", header = { "   Commands" } },
			}
		end,
	},
}
