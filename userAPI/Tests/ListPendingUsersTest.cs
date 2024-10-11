// using NUnit.Framework;
// using Moq; // Importe o namespace para Mock
// using userAPI.Domain.Users;
// using userAPI.Controllers;
// using System;
// using System.Collections.Generic;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Mvc;

// namespace ListPendingUsersTest
// {
//     public class ListPendingUsersTest
//     {
//         private UsersController _controller;
//         private Mock<IUserRepository> _mockRepo;
//         private Mock<IUnitOfWork> _mockUnitOfWork;
//         private UserService _mockUserService;

//         [SetUp] // Use SetUp para inicializar antes de cada teste
//         public void Setup()
//         {
//             _mockRepo = new Mock<IUserRepository>();
//             _mockUnitOfWork = new Mock<IUnitOfWork>();

//             _mockUserService = new UserService(_mockUnitOfWork.Object, _mockRepo.Object);
//             _controller = new UsersController(_mockUserService)
//         }

//         [Test]
//         public async Task GetPendingUtentes_ReturnsOkObjectResult_WithListOfUserDto()
//         {
//             // Arrange
//             var mockUsers = new List<UserDto>
//     {
//         new UserDto(Guid.NewGuid(), "Nome 1", "email1@example.com", UserRole.Utente, "123456789", "1234", "123456789"),
//         new UserDto(Guid.NewGuid(), "Nome 2", "email2@example.com", UserRole.Utente, "987654321", "4321", "987654321")
//     };

//             _mockService.Setup(s => s.GetPendingUtentesAsync()).ReturnsAsync(mockUsers);

//             // Act
//             // Act
//             var result = await _controller.GetPendingUtentes();

//             // Assert
//             Assert.IsInstanceOf<OkObjectResult>(result.Result); // Just assert, don't assign

//             var actionResult = result.Result as OkObjectResult; // Cast the result to OkObjectResult
//             Assert.IsNotNull(actionResult); // Assert that casting is successful

//             var returnValue = actionResult.Value as IEnumerable<UserDto>; // Cast the Value to the expected type
//             Assert.IsNotNull(returnValue); // Assert that casting is successful
//             Assert.AreEqual(mockUsers.Count, returnValue.Count()); // Then do your other assertions

//         }
//     }
// }
