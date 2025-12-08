# Manage Story Ticket - Validation Checklist

## Ticket Creation Validation

- [ ] Story file exists and is readable
- [ ] Story has exactly one requirement
- [ ] Project ID is valid
- [ ] Ticket created successfully in Vibe Kanban
- [ ] Ticket ID stored in story file

## 1:1 Mapping Validation

- [ ] Story has exactly one ticket_id
- [ ] Ticket exists in Vibe Kanban
- [ ] Ticket title matches story key
- [ ] No duplicate tickets for same story

## Status Synchronization

- [ ] Story status mapped correctly to ticket status
- [ ] Ticket status updated when story status changes
- [ ] Status mapping is consistent (drafted?todo, in-progress?inprogress, review?inreview, done?done)

## Data Consistency

- [ ] Ticket description contains story key
- [ ] Ticket description includes problem definition
- [ ] Ticket description matches current story content