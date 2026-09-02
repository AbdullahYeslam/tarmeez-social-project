
const urlParam = new URLSearchParams(window.location.search)
const userid = urlParam.get("userID")

getUser(userid)
getPostsOfUser(userid)
setupUI()

function getUser(user_id){
    const id = user_id
    const url = `https://tarmeezacademy.com/api/v1/users/${id}`
    loader()
    axios.get(url)
    .then((response)=>{
        const user = response.data.data 
        document.querySelector("#user-profile-title").innerHTML = `${user.username}'s profile`
        document.querySelector("#userImage").src = Object.keys(user.profile_image).length === 0 ? "profile.png" : user.profile_image 
        
        document.getElementById("userInfo-name").innerHTML = user.name
        document.getElementById("userInfo-username").innerHTML = user.username
        document.getElementById("userInfo-email").innerHTML = user.email

        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count

    })
    .catch((e)=>{
        showAlert(`${e.response.data.message}`,"danger")
    })
    .finally(()=>{
        loader(false)
    })
}
function getPostsOfUser(user_id){
    const id = user_id
    const url = `https://tarmeezacademy.com/api/v1/users/${id}/posts`
    loader()
    axios.get(url)
    .then((response)=>{
        const allPosts = response.data.data // array 
        document.getElementById("posts-container").innerHTML = ''
        for (let post of allPosts){ 

            const profileImg = Object.keys(post.author.profile_image).length === 0 ? "profile.png" : post.author.profile_image // check if user has a profile image
            const postImg = Object.keys(post.image).length === 0 ? '' : `<img src="${post.image}" class="w-100" >` // check if user has provide image with the post
            const theTitle = post.title!= null ? post.title : ''
            
            let editContent='';
            if (currenUser()!=null && post.author.id == JSON.parse(localStorage.getItem("user")).id){
                editContent = `
                <div style="display:flex;  height:40px">
                    <button class="editBtn btn btn-secondary mx-1" onclick="editingPostModal('${encodeURIComponent(JSON.stringify(post))}')">✎</button>
                    <button class="deleteBtn btn btn-danger mx-1" onclick="deletePostModal(${post.id})" >🗑️</button>
                </div> `
            }

            let tagContent = '' 
            for (let tag of post.tags){
                tagContent += 
                `<button type="" class="text-white bg-secondary fs-6 rounded-pill px-2">${tag.name}</button>`
            }

            let content = `
            <div class="card bg-primary-subtle mb-3 shadow" style="width: 100%; margin: auto; max-width: 700px; max-height: 700px;">
                <div class="card-header d-flex" style="justify-content: space-between">
                    <div>
                        <img class="rounded-circle" src="${profileImg}" style="width: 35px; height: 35px;">
                        <b>${post.author.username}</b>
                    </div>
                    ${editContent}
                </div>
                <div class="card-body" id="body-post-${post.id}" onclick="openPost(${post.id})" style="overflow:scroll; max-height: 800px; cursor: pointer">
                    ${postImg}
                    <p style="color: rgb(191, 189, 189);">${post.created_at}</p>
                    <h5 class="card-title">${theTitle}</h5>
                    <p class="card-text" style="overflow: scroll; max-height: 50px;">${post.body}</p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        <span>(${post.comments_count}) Comments</span>
                        <span>${tagContent}</span> 
                    </div>    
                </div>
            </div>
            `
            document.getElementById("posts-container").innerHTML += content
        }
    })
    .catch((e)=>{
        showAlert(`${e.response.data.message}`,"danger")
    })
    .finally(()=>{
        loader(false)
    })
}