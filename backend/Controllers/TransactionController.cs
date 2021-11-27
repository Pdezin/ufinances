using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;
using System;
using System.Linq;

namespace Api.Controllers
{
  [ApiController]
  [Route("v1/transactions")]
  
  public class TransactionController: ControllerBase
  {
    [HttpGet]
    [Route("skip={skip:int}/take={take:int}")]
    public async Task<ActionResult> Get([FromServices]
    DataContext context,
    [FromRoute] int skip = 0,
    [FromRoute] int take = 10)
    {
      if (take > 50 || take < 1 || skip < 0) {
        return BadRequest();
      }
      var income = context.Transactions.AsNoTracking()
      .Where(x => x.Type == TypeTransaction.income)
      .Sum(x => x.Value);

      var outcome = context.Transactions.AsNoTracking()
      .Where(x => x.Type == TypeTransaction.outcome)
      .Sum(x => x.Value);

      var totalTransactions = await context.Transactions.CountAsync();
      var transactions = await context.Transactions.Include(x => x.Category)
      .AsNoTracking()
      .OrderByDescending(x => x.CreatedAt)
      .Skip(skip)
      .Take(take)
      .ToListAsync();
     
     return Ok(
       new {
         values = new {
           income,
           outcome,
           total = income - outcome,
         },
         totalTransactions,
         transactions,
       }
     );
    }

     [HttpGet]
    [Route("skip={skip:int}/take={take:int}/start={start}/end={end}")]
    public async Task<ActionResult> GetFilter([FromServices]
    DataContext context,
    [FromRoute] int skip = 0,
    [FromRoute] int take = 10,
    [FromRoute] string start = "2000-01-01",
    [FromRoute] string end = "2099-01-01")
    {
      DateTime startDate = DateTime.Parse(start);
      DateTime endDate = DateTime.Parse(end + "  23:59:59");

      if (take > 50 || take < 1 || skip < 0) {
        return BadRequest();
      }
      var income = context.Transactions.AsNoTracking()
      .Where(x => x.Type == TypeTransaction.income && x.CreatedAt >= startDate && x.CreatedAt <= endDate)
      .Sum(x => x.Value);

      var outcome = context.Transactions.AsNoTracking()
      .Where(x => x.Type == TypeTransaction.outcome && x.CreatedAt >= startDate && x.CreatedAt <= endDate)
      .Sum(x => x.Value);

      var totalTransactions = await context.Transactions.Where(x => x.CreatedAt >= startDate && x.CreatedAt <= endDate).CountAsync();
      var transactions = await context.Transactions.Include(x => x.Category)
      .AsNoTracking()
      .Where(x => x.CreatedAt >= startDate && x.CreatedAt <= endDate)
      .OrderByDescending(x => x.CreatedAt)
      .Skip(skip)
      .Take(take)
      .ToListAsync();
     
     return Ok(
       new {
         values = new {
           income,
           outcome,
           total = income - outcome,
         },
         totalTransactions,
         transactions,
       }
     );
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<Transaction>> GetById([FromServices] DataContext context, Guid id)
    {
      var transaction = await context.Transactions.Include(x => x.Category)
      .AsNoTracking()
      .FirstOrDefaultAsync(x => x.Id == id);
      
      return transaction;
    }

    [HttpGet]
    [Route("categories/{id}")]
    public async Task<ActionResult<List<Transaction>>> GetByCategory([FromServices] DataContext context, Guid id)
    {
      var transactions = await context.Transactions.Include(x => x.Category)
      .AsNoTracking()
      .Where(x => x.CategoryId == id)
      .ToListAsync();

      return transactions;
    }

    [HttpPost]
    [Route("")]
    public async Task<ActionResult<Transaction>> Post([FromServices] DataContext context, [FromBody] Transaction model)
    {
      model.CreatedAt = DateTime.Now;
      context.Transactions.Add(model);
      await context.SaveChangesAsync();
      return model;
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult<Transaction>> Delete([FromServices] DataContext context, Guid id)
    {
      var transaction = await context.Transactions.FindAsync(id);
      if (transaction != null) {
        context.Transactions.Remove(transaction);
        await context.SaveChangesAsync();
        return NoContent();
        
      } else {
        return NotFound();
      }

    }

    [HttpPut]
    [Route("{id}")]
    public async Task<ActionResult<Transaction>> Put([FromServices] DataContext context, Guid id, Transaction transaction)
    {
      if (id != transaction.Id) {
        return BadRequest();
      }

      transaction.CreatedAt = DateTime.Now;

      context.Entry(transaction).State = EntityState.Modified;
      try {
        await context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!context.Transactions.Any(x => x.Id == id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }

      }
        return NoContent();
    }
    
  }

}