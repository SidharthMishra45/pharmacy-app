using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pharmacy.API.Data;
using Pharmacy.API.Models;
using Pharmacy.API.Services;
using System.Text;
using Pharmacy.API.Profiles;
using System.Security.Claims;
using Pharmacy.API.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Register AutoMapper explicitly with the assembly containing your profiles
builder.Services.AddAutoMapper(typeof(MappingProfile));

// ---------------------------
// 🔗 Database Configuration
// ---------------------------
builder.Services.AddDbContext<PharmacyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---------------------------
// 🧠 Services Registration
// ---------------------------
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IDrugService, DrugService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ISalesReportService, SalesReportService>();
// ---------------------------
// 👤 Identity Configuration
// ---------------------------
builder.Services.AddIdentityCore<ApplicationUser>()
    .AddRoles<ApplicationRole>()
    .AddEntityFrameworkStores<PharmacyDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<RoleManager<ApplicationRole>>(); // Role manager

// ---------------------------
// 🔐 JWT Authentication Setup
// ---------------------------
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
            IssuerSigningKey = new SymmetricSecurityKey(key),
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.NameIdentifier

        };

        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                var result = System.Text.Json.JsonSerializer.Serialize(new { message = "Unauthorized" });
                return context.Response.WriteAsync(result);
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Authentication Failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token Validated: " + context.SecurityToken);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddScoped<AuthService>(); // Auth helper service

// ---------------------------
// 🔐 Authorization Policies
// ---------------------------
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanManageDrugs", policy =>
        policy.RequireRole(UserRoles.Admin, UserRoles.Supplier));

    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole(UserRoles.Admin));

    options.AddPolicy("DoctorOnly", policy =>
        policy.RequireRole(UserRoles.Doctor));
});

// ---------------------------
// 🌐 CORS Policy
// ---------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// ---------------------------
// 📦 Add Controllers & Swagger
// ---------------------------
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ---------------------------
// 🛠️ Role Initialization
// ---------------------------
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

// ---------------------------
// 🚀 Middleware Pipeline
// ---------------------------
app.UseCors("AllowAngular");
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
