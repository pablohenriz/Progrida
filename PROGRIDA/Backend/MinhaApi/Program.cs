var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var tarefas = new List<string> {"Estudar C#", "Criar uma API"};


app.MapGet("/tarefas", () => "Bem-vindo á API do Progrida!");

app.MapPost("/tarefas", (string nome) => {
    tarefas.Add(nome);
    return Results.Created($"/tarefas/{nome}", nome);
});

app.MapPost("/enviar-tarefas", (TarefasInput entrada) =>
{
    return Results.Ok($"Recebi a tarefa de nome: {entrada.Nome}");z
});

app.Run();