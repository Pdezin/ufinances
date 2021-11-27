using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using System;

namespace Api.Controllers
{
  [ApiController]
  [Route("v1/categories")]
  public class CategoryController: ControllerBase
  {
    [HttpGet]
    [Route("")]
    public async Task<ActionResult<List<Category>>> Get([FromServices] DataContext context)
    {
      var categories = await context.Categories.AsNoTracking().ToListAsync();
      return categories;
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<Category>> Post([FromServices] DataContext context, [FromBody] Category model)
    {
      context.Categories.Add(model);
      await context.SaveChangesAsync();
      return model;
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult<Category>> Delete([FromServices] DataContext context, Guid id)
    {
      var category = await context.Categories.FindAsync(id);
      if (category != null) {
        context.Categories.Remove(category);
        await context.SaveChangesAsync();
        return NoContent();
        
      } else {
        return NotFound();
      }

    }

   
  }

}