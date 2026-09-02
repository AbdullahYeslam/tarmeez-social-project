
function openProfile(){ // for profile in nav bar
    const user = currenUser() != null ? currenUser() : null; 
    if (user == null){
        showAlert("log in/register is needed", "danger")
        setupUI()
    }else{
        const userID = user.id
        window.location = `profile.html?userID=${userID}`
    }
    
}
function openRandomProfile(userId){
    window.location = `profile.html?userID=${userId}`
}


function logInBtn(){
    const url = "https://tarmeezacademy.com/api/v1/login"
    const params = {
        "username" : document.getElementById("username").value,
        "password" : document.getElementById("password").value
    }

    axios.post(url, params)
    .then((response)=>{
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("nav-login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal) 
        modalInstance.hide()
    
        setupUI()
        location.reload() 
    })
    .catch((er)=>{
        const modal = document.getElementById("nav-login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal) 
        modalInstance.hide()
        showAlert(er.response.data.message, "danger")
    })
    .finally(()=>{
        
    })
    
}
function registerBtn(){
    const url = "https://tarmeezacademy.com/api/v1/register"

    const username = document.getElementById("username-reg").value
    const password = document.getElementById("password-reg").value
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const image = document.getElementById("profile-image-register").files[0]

    let formData = new FormData()
    formData.append("username",username)
    formData.append("password",password)
    formData.append("name",name)
    formData.append("email",email)
    formData.append("image",image)

    axios.post(url, formData)
    .then((response)=>{
        console.log(response)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("nav-register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal) 
        modalInstance.hide()

        setupUI()
        showAlert("You're registration has been secussfully!")
    })
    .catch((er)=>{
        // const modal = document.getElementById("nav-register-modal")
        // const modalInstance = bootstrap.Modal.getInstance(modal) 
        // modalInstance.hide() // this can be used here also if u wanna close the modal to show the error message, in this case move both to finally case
        showAlert(er.response.data.message, "danger")
    })  
}
function confirmLogOutBtn(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    
    showAlert("Logged out successfully!","danger")
    setupUI()
}


function openPost(postID){
   window.location = `showPost.html?postID=${postID}`
}

function showAlert(specificMess, type= "success"){
    const alerts_div = document.getElementById('alerts-div') 
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert" style='position: fixed; left: 0%; bottom: 0%;'>`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        alerts_div.append(wrapper)
    }
    appendAlert(specificMess , type)
    setTimeout(() => {
        alerts_div.innerHTML = ""
    }, 3000); 
}

function currenUser(){
    let user = null
    const userStorage = localStorage.getItem("user")
    
    if (userStorage != null){
        return user = JSON.parse(userStorage)
    }
    return user
}

function creatingPostModal(){
    document.getElementById("postID-input").value = null

    document.getElementById("post-title-message").innerHTML = "Create new post"
    document.getElementById("post-title").value = ""
    document.getElementById("post-body").value = ""
    
    document.getElementById("createEditBtn").innerHTML = "Send"

    let postModal = document.getElementById("add-post-modal")
    const modal = new bootstrap.Modal(postModal,{})
    modal.toggle()
}
function editingPostModal(postObj){
    let post = JSON.parse(decodeURIComponent(postObj))

    document.getElementById("postID-input").value = post.id
    document.getElementById("post-title-message").innerHTML = "Edit the post"
    document.getElementById("post-title").value = post.title
    document.getElementById("post-body").value = post.body
    document.getElementById("createEditBtn").innerHTML = "Edit"

    let editModal = document.getElementById("add-post-modal")
    const modal = new bootstrap.Modal(editModal,{})
    modal.toggle()  
}
function deletePostModal(theDeleteID){
    let post_id = theDeleteID
    document.getElementById("postID-delete").value = post_id

    let delModal = document.getElementById("confirmModalDelete")
    const modal = new bootstrap.Modal(delModal,{})
    modal.toggle() 

}

function loader(show = true){
    if (show){
        document.getElementById("loader").style.visibility = "visible"
    }
    else{
        document.getElementById("loader").style.visibility = "hidden"
    }
}


function createPost(){
    let url = '' 
    let postID = document.getElementById("postID-input").value
    let isCreate = postID == null || postID == ""  

    const token = localStorage.getItem("token")
    const title = document.getElementById("post-title").value
    const body = document.getElementById("post-body").value
    const image = document.getElementById("post-image").files[0] 
    // const tags = [document.getElementById("sp-tag").value] todo: after u add tags in html

    let formData = new FormData()
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", image)
    // formData.append("tags", tags)

    const headers = {
        "Authorization" : `Bearer ${token}`,
        "Content-Type" : "multipart/form-data"
    }
    
    if (isCreate){
        url = "https://tarmeezacademy.com/api/v1/posts"
    }
    else{
        formData.append("_method", "put")
        url = `https://tarmeezacademy.com/api/v1/posts/${postID}`
    }
    axios.post(url, formData, {headers : headers})
        .then((response)=>{
            const modal = document.getElementById("add-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal) 
            modalInstance.hide()
            
            if (isCreate){ 
                const mes = window.location.href.includes("showPost.html") == true ? ", in home page" : ""
                showAlert(`Post has been shared successfully${mes}`) 
            }
            else{
                showAlert("Post has been edited successfully")
                if (window.location.href.includes("showPost.html")){
                    location.reload()
                }
            }
            if (window.location.href.includes("home.html")){
                fillRandomPosts()
                console.log("home page edit")
            }
            if (window.location.href.includes("profile.html")){
                const user_Id = JSON.parse(localStorage.getItem("user")).id
                getPostsOfUser(user_Id)
                getUser(user_Id)
            } 
            setupUI()
        })
        .catch((error)=>{
            showAlert(error.response.data.message, "danger")
        })  
}
function deletePost(){
    const postID = document.getElementById("postID-delete").value 
    const token = localStorage.getItem("token")

    const url = `https://tarmeezacademy.com/api/v1/posts/${postID}`
    const headers = {
        "Authorization" : `Bearer ${token}`
    }
    loader()
    axios.delete(url ,{headers : headers})
    .then(()=>{
        // update tthe page:
        if (window.location.href.includes("showPost.html")){
            let timeLeft = 3;
            const display = document.getElementById("countdown");
            
            const timer = setInterval(() => {
                display.textContent = timeLeft;
                showAlert(`Post deleted, back to home page in ${display.innerHTML}!`, "danger")
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    display.textContent = "Done!";
                    display.style.visibility = "hidden"
                    window.location = 'home.html'
                } 
                else {
                    timeLeft--;
                    display.style.visibility = "visible"
                }
            }, 1000);
        }
        else if (window.location.href.includes("profile.html")){
            const user_Id = JSON.parse(localStorage.getItem("user")).id
            getPostsOfUser(user_Id)
            getUser(user_Id)
            showAlert("Post was deleted!","danger")
        }
        else{
            fillRandomPosts()
            showAlert("Post was deleted!","danger")
        }
        setupUI()  
    })
    .catch((erorr)=>{
        showAlert(erorr , "danger")
    })
    .finally(()=>{
        loader(false)
    })
}


function setupUI(){
    const addPostBtn = document.getElementById("add-new-post")
    const editPostBtns = document.querySelectorAll(".editBtn") // all buttinn divs 
    const deletePostBtns = document.getElementsByClassName("deleteBtn") // all buttinn divs 
    const login_register_div = document.getElementById("login-register-div")
    const token = localStorage.getItem("token")
    
    if (token == null){
        addPostBtn.style.display = "none"
        for (let i = 0; i < editPostBtns.length; i++) {
            editPostBtns[i].style.display = "none";
            deletePostBtns[i].style.display = "none"
        }
        login_register_div.innerHTML = `
            <button type="button"  data-bs-toggle="modal"  data-bs-target="#nav-login-modal" class="btn btn-outline-success mx-1">Login</button>
            <button type="button"  data-bs-toggle="modal"  data-bs-target="#nav-register-modal" class="btn btn-outline-success mx-1">Register</button>
            `;
    }
    else{
        addPostBtn.style.display = "block"
        for (let i = 0; i < editPostBtns.length; i++) {
            editPostBtns[i].style.display = "flex";
            deletePostBtns[i].style.display = "flex"
        }
        const user_info = JSON.parse(localStorage.getItem("user"))
        const profileImg = Object.keys(user_info.profile_image).length === 0? "profile.png" : user_info.profile_image // some time backend has the img but it dose not load it, which will display nothing 
        login_register_div.innerHTML = `
            <img src="${profileImg}" width="30px" height="30px" class="m-1 rounded-circle" alt="">
            <h4 style='margin-top:10px; font-size:15px;'>@${user_info.username}</h4>
            <button type="button" data-bs-toggle="modal" data-bs-target="#confirmModal" class="btn btn-outline-danger mx-1">Log Out</button>
        `;
    }
}
