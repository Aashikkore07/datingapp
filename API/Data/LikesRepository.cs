using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Data;

public class LikesRepository( AppDbContext _context) : ILikesRepository
{

    public void AddLike(MemberLike like)
    {
        _context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        _context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {

        return await _context.Likes.Where(x => x.SourceMemberId == memberId).
            Select(x => x.TargetMemberId).
            ToListAsync();
            }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await _context.Likes.FindAsync( sourceMemberId, targetMemberId);
        
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams)
    {

        var query = _context.Likes.AsQueryable();
        IQueryable<Member> result;
        switch (likesParams.Predicate)
        {
            case "liked":
                result = query
                .Where(x => x.SourceMemberId == likesParams.MemberId)
                .Select(x => x.TargetMember);
                break;
            case "likedBy":
                result = query
                .Where(x => x.TargetMemberId == likesParams.MemberId)
                .Select(x => x.SourceMember);
                break;
            // case "":
            // case "":
            // case "":
            default://Mutual
                var likeIds = await GetCurrentMemberLikeIds(likesParams.MemberId);
                result = query
                                .Where(x => x.TargetMemberId == likesParams.MemberId && likeIds.Contains(x.SourceMemberId))
                                .Select(x => x.SourceMember);
                break;
        }
        return await PaginationHelper.CreateAsync(result,likesParams.PageNumber,likesParams.PageSize);

    }

    public async Task<bool> SaveAllChanges()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
