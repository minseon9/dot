local function last_modified()
	if vim.g.md_modify_disabled then
		return
	end

	if vim.bo.filetype ~= "vimwiki" then
		return
	end

	if not vim.bo.modified then
		return
	end

	-- 커서 위치 저장
	local save_cursor = vim.api.nvim_win_get_cursor(0)

	local n = math.min(10, vim.api.nvim_buf_line_count(0))

	-- 현재 시간 포맷
	local updated_time = os.date("%Y-%m-%d %H:%M:%S +0900")

	local lines = vim.api.nvim_buf_get_lines(0, 0, n, false)
	-- "updated :"가 포함된 줄을 찾아서 변경
	for i, line in ipairs(lines) do
		if line:match("^%s*updated%s*:") then
			lines[i] = line:gsub("^(updated%s*:).*", "%1 " .. updated_time)
			break
		end
	end

	-- 변경된 라인 다시 설정
	vim.api.nvim_buf_set_lines(0, 0, n, false, lines)

	-- 검색 히스토리 삭제
	vim.cmd('silent! call histdel("search", -1)')

	-- 커서 위치 복원
	vim.api.nvim_win_set_cursor(0, save_cursor)
end

local function create_template()
	local wiki_directory = false

	for _, wiki in ipairs(vim.g.vimwiki_list or {}) do
		if string.match(vim.fn.expand("%:p:h"), vim.fn.expand(wiki.path)) then
			wiki_directory = true
			break
		end
	end

	if not wiki_directory then
		return
	end

	-- 파일이 비어있지 않으면 종료
	if vim.api.nvim_buf_line_count(0) > 1 then
		return
	end

	-- 템플릿 생성
	local template = {
		"---",
		"layout    : wiki",
		"title     : ",
		"summary   : ",
		"date      : " .. os.date("%Y-%m-%d %H:%M:%S +0900"),
		"updated   : " .. os.date("%Y-%m-%d %H:%M:%S +0900"),
		"category  : ",
		"tags      : ",
		"toc       : true",
		"public    : true",
		"parent    : ",
		"latex     : false",
		"resource  : " .. vim.fn.system("uuidgen"):gsub("\n", ""),
		"---",
		"* TOC",
		"{:toc}",
		"",
		"# ",
	}

	-- 템플릿을 버퍼에 삽입
	vim.api.nvim_buf_set_lines(0, 0, -1, false, template)

	-- 커서를 문서 끝으로 이동
	vim.api.nvim_win_set_cursor(0, { #template, 0 })
end

-- 자동 명령 그룹 설정
vim.api.nvim_create_augroup("vimwikiauto", { clear = true })

vim.api.nvim_create_autocmd("BufWritePre", {
	pattern = "*.md",
	callback = last_modified,
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
	pattern = "*.md",
	callback = create_template,
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "vimwiki",
	command = "inoremap <S-Right> <C-r>=vimwiki#tbl#kbd_tab()<CR>",
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "vimwiki",
	command = "inoremap <S-Left> <Left><C-r>=vimwiki#tbl#kbd_shift_tab()<CR>",
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "vimwiki",
	command = "nmap s <nop>",
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "vimwiki",
	command = "vmap s <nop>",
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "vimwiki",
	command = "nnoremap sct :VimwikiTable<CR>",
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "vimwiki",
	command = "nnoremap scj vipd{P",
	group = "vimwikiauto",
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "vimwiki",
	command = "vmap scl S]f]a",
	group = "vimwikiauto",
})

return {
	{
		"vimwiki/vimwiki",
		init = function()
			vim.g.vimwiki_list = {
				{
					path = "~/personal/minseon9.github.io/_wiki",
					ext = "md",
				},
			}
			vim.g.tagbar_type_vimwiki = {
				ctagstype = "vimwiki",
				sort = 0,
				kinds = { "t:목차" },
			}
			vim.g.md_midify_disabled = 0
			vim.g.vimwiki_conceallevel = 0
			vim.g.vimwiki_global_ext = 0
		end,
	},
}
