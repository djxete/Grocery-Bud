//======= SELECT ITEMS ========
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");


//======= EDIT ITEMS ========

let editElement;
let editFlag = false;
let editID = "";


//======= EVENT LISTENERS ========

//Submit form
form.addEventListener("submit", addItem)
//Borrar items
clearBtn.addEventListener("click", clearItems);
//Load items
window.addEventListener("DOMContentLoaded", setupItems);


//======= FUNCTIONS ========

function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    
    //id único cada vez que llamamos a esta constante
    const id = new Date().getTime().toString();
    

    //Tenemos 3 opciones al hacer click en el botón submit

    if (value && !editFlag) {

        
        createListItem(id,value);

        
        displayAlert("Item added successfully", `success`);
        
        container.classList.add("show-container");

        addToLocalStorage(id, value);

       
        setBackToDefault();


    }

    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", `success`);
        //editar el local storage
        editLocalStorage(editID, value);
        setBackToDefault();


    }
    
    else {
        displayAlert(`Please enter value`, "danger");
        setTimeout()
    }





}



//------------------------Display alert


function displayAlert(text, action) {

    //add alert y text
    alert.classList.add(`alert-${action}`);
    alert.innerHTML = `${text}`;

 
    setTimeout(function () {

        alert.innerHTML = ``;
        alert.classList.remove(`alert-${action}`);

    }, 1500)

}



//-------------------------- Ponerlo en default

function setBackToDefault() {

    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

//-------------------------- Borrar items

function clearItems() {

    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
        items.forEach(item => {
            list.removeChild(item);
        })
    }

    container.classList.remove("show-container");
    
    displayAlert("Items delected", `danger`);
   
    setBackToDefault();
    
    localStorage.removeItem("list");


}



//-------------------------- Borrar item en el icono

function deleteItem(e) {


    const element = e.currentTarget.parentNode.parentNode;
 
    const id = element.dataset.id;
    
    list.removeChild(element);


   
    if (list.children.length === 0) {
        container.classList.remove("show-container");

    }

    displayAlert("item removed", `danger`);

    setBackToDefault();

  

    removeFromLocalStorage(id);


}


//-------------------------- Editar item en el icono

function editItem(e) {
    
    const element = e.currentTarget.parentNode.parentNode;
    editElement = element.firstChild;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;

    submitBtn.textContent = "edit";

}



//Local Storage

function addToLocalStorage(id, value) {

    const grocery = 
        {id:id,
        value:value };


    let items = getLocalStorage();
    

    items.push(grocery)


    localStorage.setItem("list", JSON.stringify(items))

   
}




//Borrar del local storage

function removeFromLocalStorage(id) {

    let items = getLocalStorage();

    items = items.filter(item => {
        if (item.id !== id) {
            
            return item;

        }
    })


    localStorage.setItem("list", JSON.stringify(items));


    

}

// Editar local storage

function editLocalStorage(id, value) {

    let items = getLocalStorage();
    items = items.map(item => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    })

    localStorage.setItem("list", JSON.stringify(items));

    
}

// Coger elementos del local storage

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}



// Setup items local storage

function setupItems() {
    let items = getLocalStorage();
    if (items.lenght > 0) {
        items.forEach(item =>{
            createListItem(item.id, item.value)
        })
    }

    //container.classList.add("show-container");
}


// Crear list items

function createListItem(id, value) {
   
    const element = document.createElement("article");
    
    element.classList.add("grocery-item");
    
    const attr = document.createAttribute("data-id");
   
    attr.value = id;
    element.setAttributeNode(attr);

    element.innerHTML = `<p class="title">${value}</p>
 <div class="btn-container">
     <button class="edit-btn">
         <i class="fas fa-edit"></i>
     </button>
     <button class="delete-btn">
         <i class="fas fa-trash"></i>
     </button>
 </div>`



    
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");


    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    
    list.appendChild(element);

}

