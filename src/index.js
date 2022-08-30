let status = false

function beerRender(beer){
    
    // Beer info.
    console.log("render beer " + beer.id)
    console.log('---------------------------------')
    const beerName = document.querySelector('#beer-name');
    const beerImage = document.querySelector('#beer-image');
    const beerDescription = document.querySelector('#beer-description');
    // Target Description FORM
    const beerDescriptionForm= document.querySelector('#description-form');
    const beerEditDescription = document.querySelector('#description');
    beerDescriptionForm.reset();
    // Remove Review Lists
    const beerReviewList = document.querySelector('#review-list');
    while (beerReviewList.firstElementChild){
        beerReviewList.removeChild(beerReviewList.lastElementChild)
    };
    // for(let i=0; i< beerReviewList.children.length; i++){
    //     console.log(i);
    //     beerReviewList.removeChild(beerReviewList.childNodes[i]);
    // }
    // target review form
    const beerReviewForm = document.querySelector('#review-form');
    const beerReviewText = document.querySelector('#review');
    
    beerName.textContent = beer.name,                   // beer name
    beerImage.src = beer.image_url,                     // beer image
    beerDescription.textContent = beer.description,     // beer desc.
    beerEditDescription.value = beer.description        //beer desc. form
    // render beer reviews
    for(let review of beer.reviews){
        let beerReview = document.createElement('li');
        beerReview.textContent = review;
        beerReviewList.appendChild(beerReview);
    }
    // update description
    if (status){
        beerDescriptionForm.removeEventListener('submit',updateDescription, false);
        status = !status
    } else {
        beerDescriptionForm.addEventListener('submit',updateDescription, false);
        status = !status
    }
    
    function updateDescription(env){
        // env.target.removeEventListener(env.type, arguments.callee)
        // beerReviewForm.removeEventListener('submit', arguments.callee)
        // console.log('---------------------------------')
        // console.log(`description form -> Beer : ${beer.id}`)
        // console.log("EventPhase " + env.eventPhase)
        // console.log('arguments: ',  arguments)
        // console.log("This " + this) 
        // console.log("env")
        // console.log(env)
        // console.log('---------------------------------')
        env.preventDefault();        
        beer.description = beerEditDescription.value;
        patchBeer(beer)
    };


    // add new review    
    beerReviewForm.addEventListener('submit', (env) => {
        env.preventDefault();
        console.log(`review form ID: ${beer.id}`)
        console.log('---------------------------------')
        if(beerReviewText.value !== ''){
            
            beer.reviews.push(beerReviewText.value)
            patchBeer(beer)
        } else{
            alert('Review is empty string!!')
        }
    });
};



function patchBeer(beer){
    console.log(beer, beer.id)
    fetch(`http://localhost:3000/beers/${beer.id}`,
        {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(beer)
        })
        .then(response => response.json())
        .then(data => beerRender(data))
        .catch(err => console.log(`Error: ${err}`))
};

function postBeer(beer){
    fetch('http://localhost:3000/beers', {
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify(beer)
    })
    .then(reponse => response.json())
    .then(data => beerRender(data))
    .catch(err => console.log(`Error: ${err}`))
}

function fetchData(beer=null){
    let baseURL = 'http://localhost:3000/beers/'
    return new Promise((resolve, reject) => {
        let url = beer == null ? baseURL : `${baseURL + beer}`
        fetch(url)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => console.log(`Error: ${err}`));
        })
    };
// function fetchData(beer=null){
//     let url = beer == null ? 'http://localhost:3000/beers/' : `http://localhost:3000/beers/${beer}`
//     fetch(url)
//     .then(response => response.json())
//     .then(data => {
//         // handleFetch(data)
//         return data
//     })
//     .catch(err => console.log(`Error: ${err}`));
// };

// function handleFetch(beers, beerNumber=0){
//     beers.forEach(navRender)
//     beerRender(beers[beerNumber])
// };

function navRender(beers){
    // Navigation Beer List
    const navBeerList = document.querySelector('#beer-list');
    while (navBeerList.firstElementChild){
        navBeerList.removeChild(navBeerList.lastElementChild)
    };

    beers.forEach(beer => {
        const navElement = document.createElement('li');
        navElement.textContent = beer.name;
        navElement.setAttribute('index', beer.id);
        navBeerList.append(navElement)

        navElement.addEventListener('click', (env)=> {
            // env.stopPropagation();
            console.log("EventPhase: " + env.eventPhase)
            // console.log(env.composedPath()) 
            fetchData(env.target.getAttribute('index'))
            .then(beer => {
                console.log("from fetch-> beer id " + beer.id);
                beerRender(beer);
            });
        }, false);
    });


};

function init(){
    fetchData()
    .then(beers => navRender(beers))

    fetchData(1)
    .then(beers => beerRender(beers))
    
};

init()
