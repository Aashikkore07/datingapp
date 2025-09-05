using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            var members = await memberRepository.GetMemberAsync();
            return Ok(members);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMembersById(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);

            if (member == null) return NotFound();
            return Ok(member);
        }
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }
        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();
            var member = await memberRepository.GetMemberForUpdate(memberId);
            if (member == null) return BadRequest("could not find the member");

            member.DisplayName = memberUpdateDto?.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto?.Description ?? member.Description;
            member.Country = memberUpdateDto?.Country ?? member.Country;
            member.City = memberUpdateDto?.City ?? member.City;
            // memberRepository.Update(member);
            member.User.DisplayName = memberUpdateDto?.DisplayName ?? member.User.DisplayName;

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");            
        }
    }
}
