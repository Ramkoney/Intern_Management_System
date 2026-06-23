

const API_URL = "http://localhost:3000";


function showSection(sectionId){

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");
}



function signout(){

    localStorage.removeItem("token");

    alert("Logged out successfully");

    window.location.href = "index.html";
}



async function mytasks(){

    const token = localStorage.getItem("token");

    if(!token){
        alert("Please login first");
        return;
    }

    try{

        const response = await fetch(`${API_URL}/tasksREsEmpl`,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if(data.success){

            renderTasks(data.data);

        }else{

            alert(data.message || "Failed to load tasks");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }
}



function renderTasks(tasks){

    const tbody = document.querySelector("#tasksTable tbody");

    tbody.innerHTML = "";

    if(tasks.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="5">No Tasks Found</td>
            </tr>
        `;

        return;
    }

    tasks.forEach(task => {

        tbody.innerHTML += `
            <tr>
                <td>${task.task_Id}</td>

                <td>${task.task_description}</td>

                <td>${task.date_task}</td>

                <td>
                    <button 
                        class="action-btn"
                        onclick="openReport(${task.task_Id})"
                    >
                        Report
                    </button>
                </td>

                <td>${task.feedback || "No Feedback Yet"}</td>
            </tr>
        `;
    });
}


function openReport(id){

    document.getElementById("taskId").value = id;

    document.getElementById("reportContainer").style.display = "block";
}


async function sendReport(){

    const token = localStorage.getItem("token");

    const taskId = document.getElementById("taskId").value;

    const challenge = document.getElementById("challengeInput").value;

    if(!challenge){

        alert("Write report first");

        return;
    }

    try{

        const response = await fetch(`${API_URL}/taskschal`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },

            body: JSON.stringify({
                task_Id: taskId,
                challenges: challenge
            })

        });

        const data = await response.json();

        if(data.message === "Challenges Updated Successfully"){

            alert("Report Sent Successfully");

            document.getElementById("challengeInput").value = "";

            document.getElementById("reportContainer").style.display = "none";

            mytasks();

        }else{

            alert(data.message || "Failed");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }
}



document.getElementById("leaveForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const token = localStorage.getItem("token");

    if(!token){

        alert("Please Login First");

        return;
    }

    const formData = new FormData(this);

    const leaveData = {

        start_date: formData.get("start_date"),

        end_date: formData.get("end_date"),

        reason: formData.get("reason"),

        leave_type: formData.get("leave_type"),

        department: formData.get("department")
    };

    try{

        const response = await fetch(`${API_URL}/leave`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },

            body: JSON.stringify(leaveData)

        });

        const result = await response.json();

        if(result.success){

            alert("Leave Applied Successfully");

            this.reset();

            myLeave();

        }else{

            alert(result.message || "Failed");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }

});


async function myLeave(){

    const token = localStorage.getItem("token");

    if(!token){

        alert("Please Login First");

        return;
    }

    try{

        const response = await fetch(`${API_URL}/leaveStatusInt`,{

            headers:{
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();

        if(data.success){

            renderLeaves(data.data);

        }else{

            alert(data.message || "Failed");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }
}



function renderLeaves(leaves){

    const tbody = document.querySelector("#leaveTable tbody");

    tbody.innerHTML = "";

    if(leaves.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="6">No Leave Applications Found</td>
            </tr>
        `;

        return;
    }

    leaves.forEach(leave => {

        tbody.innerHTML += `

            <tr>
                <td>${leave.application_id}</td>

                <td>${leave.start_date}</td>

                <td>${leave.end_date}</td>

                <td>${leave.leave_type}</td>

                <td>${leave.reason}</td>

                <td>${leave.leaveBalance}</td>

                <td>${leave.department}</td>

                <td>${leave.status || "Pending"}</td>

            </tr>
        `;
    });
}



window.onload = function(){
   myLeave();

    mytasks();

    setInterval(mytasks, 10000);
};

function toggleMenu(){
 const menu=document.querySelector(".menu");
 const overlay =document.querySelector(".overlay");

 menu.classList.toggle("hide");

 if(menu.classList.contains("hide")){
    overlay.style.display="none";
 }
 else{
    overlay.style.display="block";
 }

}


function  closeMenu(){
      const menu= document.querySelector(".menu");
      const overlay= document.querySelector(".overlay");

      menu.classList.add("hide");
      overlay.style.display ="none";
}
