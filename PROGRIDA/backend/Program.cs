var builder = WebApplication.CreateBuilder(args);

// Configuração do CORS para o seu frontend funcionar
builder.Services.AddCors(options => {
    options.AddPolicy("MinhaPolitica",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddControllers();

var app = builder.Build();

// Ativa o CORS
app.UseCors("MinhaPolitica");

// Removido o HTTPS para evitar erros em ambiente de teste
// app.UseHttpsRedirection(); 

app.MapControllers();

app.Run();