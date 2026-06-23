async function sendAttendance(action) {

    const email = document.getElementById("email").value;

    if (!email) {
        alert("Enter email");
        return;
    }

    const token = localStorage.getItem("token"); 
    if (!token) {
        alert("You are not logged in");
        return;
    }

    if (!navigator.geolocation) {
        alert("GPS not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {

            const response = await fetch("http://localhost:3000/attendance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    latitude,
                    longitude,
                    action 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Attendance failed");
                return;
            }

            document.getElementById("message").innerText =
                `${data.message} - ${data.status}`;

        } catch (error) {
            console.error(error);
            alert("Network error");
        }
    });
}

function showSection(sectionId){

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");

}

function toggleMenu(){
    const menu = document.querySelector(".menu");
    const overlay= document.querySelector(".overlay");
   
    menu.classList.toggle("hide");

    if(menu.classList.contains("hide")){
        overlay.style.display="none";
    }else{
        overlay.style.display="block";
    }

}
function  closeMenu(){
      const menu= document.querySelector(".menu");
      const overlay= document.querySelector(".overlay");

      menu.classList.add("hide");
      overlay.style.display ="none";
}

function returnhome(){

    localStorage.removeItem("token");
    window.location.href ="intern.html";
    
}
function signout(){

    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href="index.html";

}

function clockIn(){
    sendAttendance("Clock In")
    alert("Clock in Successful!! , Welcome to CDM");

}

function clockOut(){
    sendAttendance("Clock Out");
    alert("Clock out Successful! Good Bye , Travel Safe ");
     window.location.href = "index.html";

}
