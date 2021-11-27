using System;
using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class Category
    {
      public Guid Id {get; set;}
      
      [Required(ErrorMessage = "Este campo é obrigatório")]
      [MaxLength(30, ErrorMessage = "Este campo deve conter no máximo 30 caracteres")]
      public string Title {get; set;}
    }
}