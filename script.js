//section task-filter-section
window.onload = function(){
    document.getElementById("status-select").value='all';
};

function selectOption(value){
    document.getElementById('status-select').value = value;
}


//section Add-Container --- What needs to be done ? ---
        document.getElementById("add-task").addEventListener('click' , function(){

            let newTaskValue = document.getElementById("new-task").value.trim();

            if(newTaskValue !== ""){

                let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

                tasks.push("newTaskValue");

                localStorage.setItem("tasks", JSON.stringify(tasks));

                let newList = document.createElement("li");

                newList.textContent = newTaskValue;

                document.getElementById("task-list").appendChild(newListItem);

                document.getElementById("new-task").value = ""; 



            }

        
    });
 