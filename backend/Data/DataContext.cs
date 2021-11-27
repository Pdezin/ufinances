using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
  public class DataContext: DbContext
  {
    public DataContext(DbContextOptions<DataContext> options): base(options)
    { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      base.OnConfiguring(optionsBuilder);
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions {get; set;}

    public override int SaveChanges()
    {
      return base.SaveChanges();
    }
  }
}