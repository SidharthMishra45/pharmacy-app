using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pharmacy.API.Models;
using Pharmacy.API.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Pharmacy.API.Dtos;
using Pharmacy.API.Models.Dtos;


namespace Pharmacy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrugsController : ControllerBase
    {
        private readonly IDrugService _drugService;

        public DrugsController(IDrugService drugService)
        {
            _drugService = drugService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DrugDto>>> GetDrugs()
        {
            var drugs = await _drugService.GetAllDrugsAsync();
            return Ok(drugs);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<PagedResult<DrugDto>>> GetFilteredDrugs(
            [FromQuery] string searchTerm = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "Name",
            [FromQuery] bool ascending = true,
            [FromQuery] Guid? categoryId = null)
        {
            var drugs = await _drugService.GetFilteredDrugsAsync(searchTerm, page, pageSize, sortBy, ascending, categoryId);
            return Ok(drugs);
        }


        [HttpGet("{id:Guid}")]
        public async Task<ActionResult<DrugDto>> GetDrug(Guid id)
        {
            var drug = await _drugService.GetDrugByIdAsync(id);
            if (drug == null) return NotFound();
            return Ok(drug);
        }

        [Authorize(Policy = "CanManageDrugs")]
        [HttpPost]
        public async Task<IActionResult> AddDrug([FromBody] CreateDrugDto createDrugDto)
        {
            var createdDrug = await _drugService.AddDrugAsync(createDrugDto);
            return CreatedAtAction(nameof(GetDrug), new { id = createdDrug.DrugId }, createdDrug);
        }

        [Authorize(Policy = "CanManageDrugs")]
        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateDrug(Guid id, [FromBody] DrugDto drugDto)
        {
            var updated = await _drugService.UpdateDrugAsync(id, drugDto);
            if (!updated) return NotFound();
            return NoContent();
        }


        [Authorize(Policy = "CanManageDrugs")]
        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteDrug(Guid id)
        {
            var deleted = await _drugService.DeleteDrugAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
