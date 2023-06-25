const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const filterItems = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditmode = false;


function displayItems(){
    const addItemToStorage = getItemFromStorage();
    addItemToStorage.forEach(item => addItemToDDOM(item));

    CheckUI();
}


function onaddItemSubmit(e) {
    e.preventDefault();  

    const newItem = itemInput.value;

    // Input Validation
    if( newItem === '') {
        alert('please add an item');
        return;
    }

    // check for Edit mode

    if(isEditmode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditmode = false;

    } else{
        if(checkIfItemExists(newItem)){
            alert('This Item Already Exist!')
            return;
        } 

    }
    

    addItemToDDOM(newItem);

    addItemToStorage(newItem);

    CheckUI();

    itemInput.value = '';

}


function addItemToDDOM(item){
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Adding new li to DOM
    itemList.appendChild(li);

}

function createButton(classes) {
const button = document.createElement('button');
button.className = classes;

const icon = createIcon('fa-solid fa-xmark');

button.appendChild(icon);
return button;

}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


function addItemToStorage(item){
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.push(item);

    // setting items to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemFromStorage(){

    let itemsFromStorage;
    if(localStorage.getItem('items') === null ){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}


function onItemsClick(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
       removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
    
}

function setItemToEdit(item) {
    itemList.querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'))
    isEditmode = true;
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    itemInput.value = item.textContent;
    formBtn.style.background = '#228b22';

}


function removeItem(item) {
    if(confirm('Are you sure you want to delete ?'))
    
    // remove Item from DOM
    item.remove();

    removeItemFromStorage(item.textContent);

    CheckUI();
   
}


function removeItemFromStorage(item) {

   let itemsFromStorage = getItemFromStorage();
    
//    filtering items in the storage

itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

// re-setting local storage

localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}


// clearing all items 

function clearOut(){
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }


    localStorage.removeItem('items');

    CheckUI();
}


function filterInputs(e){
    const lists = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    lists.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';

        }else{
            item.style.display = 'none';

        }
    })
}


function checkIfItemExists(item) {
   const itemsFromStorage = getItemFromStorage();
   return itemsFromStorage.includes(item);

}


function CheckUI() {
    itemInput.value = '' ;

    const lists = itemList.querySelectorAll('li');

 if(lists.length === 0){
    filterItems.style.display = 'none';
    clearBtn.style.display = 'none';
    
}else{
    filterItems.style.display = 'block';
    clearBtn.style.display = 'block';
 }
    isEditmode = false;
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item' ;
    formBtn.style.background = '#333' ;

}



function Init() {

// Event Listeners
itemForm.addEventListener('submit', onaddItemSubmit);
itemList.addEventListener('click', onItemsClick);
clearBtn.addEventListener('click', clearOut);
filterItems.addEventListener('input', filterInputs);
window.addEventListener('DOMContentLoaded', displayItems);

CheckUI();
}

Init();


