const predefinedUsers = [
    {
        username: "sunnyemp",
        password: "password123", 
        role: "employee",
        email: "user1@example.com",
        fullName: "Sunny",
        profilePic: "/images/user1.jpg",
    },
    {
        username: "sunnyadmin",
        password: "password123", 
        role: "admin",
        email: "user1@example.com",
        fullName: "Sunny",
        profilePic: "/images/user1.jpg",
    },
    {
        username: "balajiemp",
        password: "password123", 
        role: "employee",
        email: "user1@example.com",
        fullName: "balaji",
        profilePic: "/images/user1.jpg",
    }    
];


document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

   
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    
    const user = predefinedUsers.find(u => u.username === username && u.password === password);

    if (user) {
       
        localStorage.setItem('authToken', JSON.stringify({
            username: user.username,
            role: user.role,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        }));

       
        if (user.role === "admin") {
            window.location.href = 'admindashboard.html';  
        } else if (user.role === "employee") {
            window.location.href = 'employeedashboard.html'; 
        }
    } else {
        
        alert('Invalid login credentials. Please try again.');
    }
});
