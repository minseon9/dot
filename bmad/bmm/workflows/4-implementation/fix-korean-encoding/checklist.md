# Fix Korean Encoding - Validation Checklist

## File Identification

- [ ] Target file or directory specified
- [ ] Files with encoding issues identified
- [ ] File encoding checked (file -I command)

## Encoding Fix

- [ ] File content read successfully
- [ ] Korean text corruption detected (if applicable)
- [ ] cat command with heredoc used (single quotes around EOF)
- [ ] File written with UTF-8 encoding
- [ ] Encoding verified: file -I shows charset=utf-8
- [ ] Korean text verified (no ??? or ?? patterns)

## Results

- [ ] Fix results compiled
- [ ] Files requiring manual review identified
- [ ] Results reported to user
