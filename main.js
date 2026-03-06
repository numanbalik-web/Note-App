const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]


const addBox = document.querySelector(".add-box")
const popupBox = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("#popup-title");
const popupButton = document.querySelector("#form-btn");


const NOTES = "notes"

let notes = JSON.parse(localStorage.getItem(NOTES)) || []

let isUpdate = false
let upDateId = null

document.addEventListener('DOMContentLoaded', renderNotes(notes))


function renderNotes(notes){
    document.querySelectorAll('.note').forEach((noteItem)=>noteItem.remove())

    notes.forEach((note)=>{
        let noteHtml = `<div class="note" data-id=${note.id} >
        <div class="details">
          <h2>${note.title}</h2>
          <p>${note.description}</p>
        </div>


        <div class="bottom">
          
          <p>${note.date}</p>

         
          <div class="settings">
         
            <i class="bx bx-dots-horizontal-rounded"></i>

        
            <ul class="menu">
              <li class="edit-icon"><i class="bx bx-edit"></i> Edit</li>
              <li class="delete-icon">
                <i class="bx bx-trash"></i>
                Delete
              </li>
            </ul>
          </div>
        </div>
      </div>`;

      addBox.insertAdjacentHTML("afterend", noteHtml)
    })
}


addBox.addEventListener('click',showFormAndSetup)


function showFormAndSetup(){
    popupBox.classList.add("show")
    popup.classList.add("show")

    document.body.style.overflow = "hidden"
}


closeBtn.addEventListener("click", clearFormAndRemove)


function clearFormAndRemove(){

    popupBox.classList.remove("show")
    popup.classList.remove("show")

    document.body.style.overflow = "auto"

    form.reset()

    makePopupDefault()
}


form.addEventListener("submit", (e)=>{
  e.preventDefault()

  const titleInput = e.target[0]
  const descriptionInput = e.target[1]

  const title = titleInput.value
  const description = descriptionInput.value

  if(!title || !description) {
    alert("alanlar bos olamaz")
    return
  }
  const date = new Date()

  const day = date.getDate()
  const month = date.getMonth()
  const updateMonth = months[month]
  const year = date.getFullYear()
  const id = date.getTime()

  if (isUpdate) {
    

    const updateIndex = notes.findIndex((note)=> note.id == upDateId)

    notes[updateIndex] ={
      title,
      description,
      date:`${updateMonth}, ${day}, ${year}`,
      id
    }

    makePopupDefault()
  } else {
    let noteItem = {
      title,
      description,
      date:`${updateMonth}, ${day}, ${year}`,
      id
    }
    notes.push(noteItem)
 
  }
     localStorage.setItem(NOTES,JSON.stringify(notes))

    clearFormAndRemove()

    renderNotes(notes)
})


function makePopupDefault() {
  popupTitle.textContent = "Yeni not"
  popupButton.textContent = "Ekle"
  isUpdate = false
  upDateId = null
}


wrapper.addEventListener("click",(e)=>{

  if (e.target.classList.contains("bx-dots-horizontal-rounded")){
   
    showMenu(e.target)

  }else if (e.target.classList.contains("delete-icon")){
    
    deleteNote(e.target)
    
  } else if(e.target.classList.contains("edit-icon")){
   
    editNote(e.target)
  }
})


function deleteNote(item){
  const response = confirm("Silmek istedigine emin misin?")

  if (response) {
    const noteItem = item.closest(".note")
    const noteId = Number(noteItem.dataset.id)

    notes = notes.filter((note)=>note.id != noteId)

    localStorage.setItem(NOTES,JSON.stringify(notes))

    renderNotes(notes)
  }
}


function editNote(item) {
  const note = item.closest(".note")
  const noteId = parseInt(note.dataset.id)

  const foundNote = notes.find((note)=>note.id==noteId)

  showFormAndSetup()

  form[0].value = foundNote.title
  form[1].value = foundNote.description

  isUpdate = true
  upDateId = noteId

  popupTitle.textContent = "Notu guncelle"
  popupButton.textContent = "Guncelle"
}


function showMenu(item) {
    const parentElement = item.parentElement
    parentElement.classList.add("show")

    document.addEventListener("click",(e)=>{
      if (e.target.tagName !="I" || e.target != item) {
        parentElement.classList.remove("show")
      }
    })
}