using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pharmacy.API.Data;
using Pharmacy.API.Models;
using Pharmacy.API.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database Configuration
builder.Services.AddDbContext<PharmacyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// Identity Configuration
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<PharmacyDbContext>()
    .AddDefaultTokenProviders();

// Register RoleManager explicitly
builder.Services.AddScoped<RoleManager<ApplicationRole>>();


// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Configuration.AddUserSecrets<Program>();
var secretKey = builder.Configuration["JwtSettings:Secret"] ?? Environment.GetEnvironmentVariable("JWT_SECRET");

if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT Secret is missing. Set JWT_SECRET environment variable.");
}
var key = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// Add Authentication Service
builder.Services.AddScoped<AuthService>();

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IDrugService, DrugService>();
builder.Services.AddScoped<IOrderService, OrderService>();

//Policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanManageDrugs", policy =>
        policy.RequireRole(UserRoles.Admin, UserRoles.Supplier));

    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole(UserRoles.Admin));

    options.AddPolicy("DoctorOnly", policy =>
        policy.RequireRole(UserRoles.Doctor));

});


// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200") // Allow Angular
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
});

var app = builder.Build();



using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
    var roles = new[] { UserRoles.Admin, UserRoles.Doctor, UserRoles.Supplier };


    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new ApplicationRole(role));
        }
    }
}
app.UseCors("AllowAngular");
app.UseSwagger();
app.UseSwaggerUI();
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
