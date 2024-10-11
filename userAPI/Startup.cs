using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using userAPI.Infrastructure;
using userAPI.Infrastructure.Categories;
using userAPI.Infrastructure.Products;
using userAPI.Infrastructure.Families;
using userAPI.Infrastructure.Users;
using userAPI.Infrastructure.Shared;
using userAPI.Infrastructure.Roles;
using userAPI.Domain.Shared;
using userAPI.Domain.Categories;
using userAPI.Domain.Products;
using userAPI.Domain.Families;
using userAPI.Domain.Users;
using userAPI.Domain.Roles;

namespace userAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /* services.AddDbContext<DDDSample1DbContext>DotNet(opt =>
                opt.UseInMemoryDatabase("RobDroneGo")
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>()); */

            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<MySQLContext>(
                options => options.UseSqlServer(connectionString).ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>()
            );

            services.AddCors();
            ConfigureMyServices(services);

            services.AddControllers().AddNewtonsoftJson();

            //para que nao mostre os dados em null
            services.AddControllers()
                   .AddNewtonsoftJson(options =>
                   {
                       options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                   });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /* using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<DDDSample1DbContext>();
                context.Database.EnsureCreated();
            } */

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("AllowAll");
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseCors(options => options
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowAnyOrigin());

            app.UseHttpsRedirection();

            app.UseRouting();


            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            });

            services.AddTransient<IUnitOfWork, UnitOfWork>();

            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<CategoryService>();

            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<ProductService>();

            services.AddTransient<IFamilyRepository, FamilyRepository>();
            services.AddTransient<FamilyService>();

            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();

            services.AddTransient<IRoleRepository, RoleRepository>();
            services.AddTransient<RoleService>();
        }
    }
}
