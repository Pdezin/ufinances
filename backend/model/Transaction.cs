using System;
using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
  public enum TypeTransaction
  {
    income,
    outcome
  }
    public class Transaction
    {
      [Key]
      public Guid Id {get; set;}

      [Required(ErrorMessage = "Este campo é obrigatório")]
      [MaxLength(50, ErrorMessage = "Este campo deve conter no máximo 50 caracteres")]
      public string Title {get; set;}

      [Required(ErrorMessage = "Este campo é obrigatório")]
      [Range(1, 99999, ErrorMessage = "O valor deve ser entre 1 e 99999")]
      public decimal Value {get; set;}

      [Required(ErrorMessage = "Este campo é obrigatório")]
      public TypeTransaction Type {get; set;}

      public DateTime CreatedAt {get; set;}

      [Required(ErrorMessage = "Este campo é obrigatório")]
      public Guid CategoryId {get; set;}
      public Category Category {get; set;}

    }
}