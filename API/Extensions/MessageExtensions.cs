using System;
using System.Linq.Expressions;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class MessageExtensions
{
    public static MessageDto ToDto(this Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            Content = message.Content,
            MessageSent = message.MessageSent,
            DateRead = message.DateRead,
            SenderDisplayName = message.Sender.DisplayName,
            SenderId = message.Sender.Id,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientDisplayName = message.Recipient.DisplayName,
            RecipientId = message.Recipient.Id,
            RecipientImageUrl = message.Recipient.ImageUrl
        };
    }

    public static Expression<Func<Message, MessageDto>> TODtoProjection()
    {
        return message => new MessageDto
        {
            Id = message.Id,
            Content = message.Content,
            MessageSent = message.MessageSent,
            DateRead = message.DateRead,
            SenderDisplayName = message.Sender.DisplayName,
            SenderId = message.Sender.Id,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientDisplayName = message.Recipient.DisplayName,
            RecipientId = message.Recipient.Id,
            RecipientImageUrl = message.Recipient.ImageUrl
        };
    }
}
