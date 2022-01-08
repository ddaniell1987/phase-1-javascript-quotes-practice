document.addEventListener('DOMContentLoaded', (event) => {
    let quoteUl = document.querySelector("ul#quote-list")
    let newForm = document.querySelector("form#new-quote-form")
    let updateForm = document.querySelector("form#update-quote-form")
    
    newForm.addEventListener("submit", (e) => postQuote(e))

    fetch('http://localhost:3000/quotes')  
    .then(response => response.json())  
    .then(quotes => quotes.forEach(quote => slapItOnTheDOM(quote)))

    function getData(event){
        let {target} = event
        let quote = target.quote.value
        let author = target.author.value

        return{
            quote,
            author
        }
    }

    function postQuote(event){
        event.preventDefault()
        console.log("hello")
        console.log(event)
        //  gathering the data
        let data = getData(event)
        console.log(data)
        //  perform the fetch
        return fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(quote => slapItOnTheDOM(quote))
        //  add the data
    }

    function slapItOnTheDOM(quoteObj) {
        let quoteLi = document.createElement("li")
        let quoteBlockquote = document.createElement("blockquote")
        let quoteP = document.createElement("p")
        let quoteFooter = document.createElement("footer")
        let quoteBr = document.createElement("br")
        let quoteLikeBtn = document.createElement("button")
        let likeBtnSpan = document.createElement("span")
        let quoteDeleteBtn = document.createElement("button")
        let quoteUpdateBtn = document.createElement("button")

        quoteLi.setAttribute("class", "quote-card")
        quoteLi.setAttribute("id", `quote-li-${quoteObj.id}`)
        quoteBlockquote.setAttribute("class", "blockquote")
        quoteP.setAttribute("class", "mb-0")
        quoteFooter.setAttribute("class", "blockquote-footer")
        quoteLikeBtn.setAttribute("class", "btn-success")
        quoteLikeBtn.setAttribute("id", `quote-like-btn-${quoteObj.id}`)
        likeBtnSpan.setAttribute("id", `#quote-like-span-${quoteObj.id}`)
        quoteDeleteBtn.setAttribute("class", "btn-danger")
        quoteDeleteBtn.setAttribute("id", `quote-delete-btn-${quoteObj.id}`)
        quoteUpdateBtn.setAttribute("id", `quote-update-btn-${quoteObj.id}`)
        
        quoteLi.dataset.id = quoteObj.id

        quoteP.innerText = quoteObj.quote
        quoteFooter.innerText = quoteObj.author
        quoteLikeBtn.innerText = "Likes:"
        likeBtnSpan.innerText = "0"
        quoteDeleteBtn.innerText = "Delete"
        quoteUpdateBtn.innerText = "Update"

        quoteLi.append(quoteBlockquote)
        quoteBlockquote.append(quoteP, quoteFooter, quoteBr, quoteLikeBtn, quoteDeleteBtn, quoteUpdateBtn)
        quoteLikeBtn.append(likeBtnSpan)

        quoteUl.append(quoteLi)

        quoteLikeBtn.addEventListener("click", (event) => likeMe(event, quoteObj))

        quoteDeleteBtn.addEventListener("click", () => deleteForever(quoteObj))

        quoteUpdateBtn.addEventListener("click", (event) => showForm(quoteObj))


    function deleteForever(quoteObj){
        //  identify all the things you want gone from the frontend
        let liBye = document.getElementById(`quote-li-${quoteObj.id}`)
            // console.log(liBye)
        // make sure you have a way of getting an object id
            // console.log("goodbye forever", quoteObj)
        //  do the fetch and then delete what needs to be gone
        return fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(() => {
            liBye.remove()
            console.log(`goodbye ${quoteObj.id}`)
            }
        )
    }

    function showForm(quoteObj){
        // console.log(quoteObj)
        let form = document.createElement("div")
        let li = document.getElementById(`quote-li-${quoteObj.id}`)

        form.innerHTML = `
        <form id="update-quote-form">
            <div class="form-group">
            <label for="update-quote">New Quote</label>
        <input type="text" class="form-control" id="update-quote" value=${quoteObj.quote} name="quote">
      </div>
      <div class="form-group">
        <label for="Author">Author</label>
        <input type="text" class="form-control" id="author" name="author" value=${quoteObj.author}>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
        `
        li.append(form)
        // console.log("it worked")

        let submitForm = document.getElementById(`update-quote-form`)
        // debugger
        submitForm.addEventListener("submit", (event) => updateIt(event, quoteObj))
    }

    function updateIt(event, quoteObj){
        event.preventDefault();
        console.log("welcome")
        updateItOnTheBackend(event, quoteObj)
        .then(updateItOnTheFrontend)
    }

    function updateItOnTheBackend(event, quoteObj){
        let data = getData(event)
        let li = document.getElementById(`quote-li-${quoteObj.id}`)
        
        return fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
    }

    function updateItOnTheFrontend(quoteObj){
        // debugger
        console.log("Updating Soon");
        
        let form = document.querySelector(`li#quote-li-${quoteObj.id} form`)
        let p = document.querySelector(`li#quote-li-${quoteObj.id} blockquote p`)
        let footer = document.querySelector(`li#quote-li-${quoteObj.id} blockquote footer`)

        p.innerText = quoteObj.quote
        footer.innerText = quoteObj.author
        console.log("Updating Complete");

        form.remove()

    }

    function likeMe(event, quoteObj) {
        
        let span = event.target.firstElementChild
        let spanInnerText = span.innerText
        let increasedLikes = parseInt(spanInnerText) + 1

    
        return fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({quoteId: quoteObj.id})
        })
        .then(res => res.json())
        .then(data  => {
            console.log(data)
            event.target.querySelector("span").innerText = increasedLikes
        }
        )
    }

});