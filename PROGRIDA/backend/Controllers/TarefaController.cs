using Microsoft.AspNetCore.Mvc;

namespace PROGRIDA.backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class TarefaController : ControllerBase
{
    private static List<string> tarefas = new List<string>();

    [HttpGet]
    public IActionResult Listar()
    {
        return Ok(tarefas);
    }

    [HttpPost]
    public IActionResult Adicionar([FromBody] string novaTarefa)
    {
        if (string.IsNullOrEmpty(novaTarefa))
        {
            return BadRequest("A tarefa não pode ser vazia.");
        }

        tarefas.Add(novaTarefa);
        return Ok(new {mensagem = "Tarefa salva com sucesso!"});
    }
}