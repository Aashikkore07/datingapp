using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext _context) : IMessageRepository
{
    public void AddGroup(Group group)
    {
        _context.Groups.Add(group);
    }

    public void AddMessage(Message message)
    {
        _context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        _context.Messages.Remove(message);
    }

    public async Task<Connection?> GetConnectionAsync(string connectionId)
    {
        return await _context.Connections.FindAsync(connectionId);
    }

    public Task<Group?> GetGroupForConnection(string connectionId)
    {
        return _context.Groups.Include(x => x.Connections)
                .Where(x =>
                x.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await _context.Messages.FindAsync(messageId);
    }

    public async Task<Group?> GetMessageGroupAsync(string groupName)
    {
        return await _context.Groups.Include(x => x.Connections)
                .FirstOrDefaultAsync(x=>x.Name == groupName);
    }

    public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
    {
        var query = _context.Messages
                        .OrderByDescending(x => x.MessageSent)
                        .AsQueryable();
        query = messageParams.Container switch
        {
            "Outbox" => query.Where(x => x.SenderId == messageParams.MemberId && !x.SenderDeleted),
            _ => query.Where(x => x.RecipientId == messageParams.MemberId && !x.RecipientDeleted)
        };

        // var MessageQuery = query.Select(member => member.ToDto());
        var MessageQuery = query.Select(MessageExtensions.TODtoProjection());

        return await PaginationHelper.CreateAsync(MessageQuery,messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await _context.Messages
                .Where(x=> x.RecipientId == currentMemberId 
                && x.SenderId == recipientId 
                && x.DateRead == null)
                .ExecuteUpdateAsync(setters=>
                    setters.SetProperty(x=>
                        x.DateRead,DateTime.UtcNow));

        return await _context.Messages
                        .Where(x=>
                        (x.RecipientId == currentMemberId && x.SenderId == recipientId && !x.SenderDeleted)
                        ||
                        (x.SenderId == currentMemberId && x.RecipientId == recipientId && !x.RecipientDeleted)
                        )
                        .OrderBy(x=>x.MessageSent)
                        .Select(MessageExtensions.TODtoProjection())
                        .ToListAsync(); 
    }

    public async Task RemoveConnectionAsync(string connectionId)
    {
        await _context.Connections.Where(x => x.ConnectionId == connectionId)
                .ExecuteDeleteAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync()>0;
    }
}
