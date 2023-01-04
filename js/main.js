/* ========== Hamburger Menu Functioning ========== */
let hamburger = document.querySelector('.hamburger'),
    navContainer = document.querySelector('.navbar__container');

hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active');
    navContainer.classList.toggle('active');
})

/* ========== Dailouge Box Functioning ========== */
let dailouge = document.querySelector('.dailouge__box'),
    closeBtn = document.querySelector('.btn--close'),
    urlBox = document.querySelector('.url-box');

urlBox?.addEventListener('click', ()=>{
    dailouge.classList.add('active');
})

closeBtn?.addEventListener('click', ()=>{
    dailouge.classList.remove('active');
})

/* ========== Dynamic Table Generation ========== */
let AddBtn = document.querySelector('.btn--add'),
    urlInput = document.querySelector('.paste--url'),
    uploadInput = document.querySelector('#file'),
    notifiContainer = document.querySelector('.notification__container');

const AUDIO = "audio";
const uploadApiCall = (file, data = {}) => {
    let rCont = document.querySelector('.result__container');
        String.prototype.toHHMMSS = function () {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);
        
            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours + ':' + minutes + ':' + seconds;
        }
            
        let fduration = `${data.duration}`.toHHMMSS();

    let tb1 = document.querySelector('.result'),
        tb2 = document.querySelector('.result2');

    let num = tb1 ? '' : 1;

    if(rCont){
        const newRow = document.createElement('tr'),
              tBody = document.querySelector('.table-body');
        // <th scope="row">${tBody?.childElementCount + 1}</th>
        tBody.innerHTML = '';

        newRow.innerHTML = `<td scope="row">
                                <div class="file--cont">
                                    <div class="audio--controls" data-value=${tBody?.childElementCount}><i class="fa-solid fa-circle-play"></i></div>
                                    <div class="fileName">${file.name}</div>
                                    <audio>
                                        <source src=${data.src} type=${data.type}>
                                        Your browser does not support the audio tag!
                                    </audio>
                                </div>
                            </td>
                            <td>${fduration}</td>
                            <td class='btn--group'>
                                <div class="actions">
                                    <div class="btn--transcribe${num}"><i class="fa-solid fa-file-lines"></i></div>
                                    <div class="btn--remove" data-value=${tBody?.childElementCount}><i class="fa-solid fa-trash"></i></div>
                                </div>
                            </td>`;

        tBody.append(newRow);
        handleRemove(rCont);
    }
    else {
        const res = document.createElement("div");
          res.classList.add('result__container');
          res.innerHTML = `<table>
                                <thead>
                                <tr>
                                    <th scope="col">File Name</th>
                                    <th scope="col">Duration</th>     
                                    <th scope="col">Action</th>
                                </tr>
                                <thead>
                                <tbody class='table-body'>
                                <tr>
                                    <td scope="row">
                                        <div class="file--cont">
                                            <div class="audio--controls" data-value='0'><i class="fa-solid fa-circle-play"></i></div>
                                            <div class="fileName">${file.name}</div>
                                            <audio>
                                                <source src=${data.src} type=${data.type}>
                                                Your browser does not support the audio tag.
                                            </audio>
                                        </div>
                                    </td>
                                    <td>${fduration}s</td>
                                    <td class='btn--group'>
                                        <div class="actions">
                                            <div class="btn--transcribe${num}"><i class="fa-solid fa-file-lines"></i><span>Transcribe</span></div>
                                            <div class="btn--remove" data-value='0'><i class="fa-solid fa-trash"></i></div>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            `;
        
        // document.querySelector('.result').append(res);
        num == 1 ? tb2.append(res) : tb1.append(res);

        // let rowDelete = document.querySelector('.table-body tr'),
        //     tBody = document.querySelector('.table-body');
        handleRemove(res);
    }
    handleAudioPlay();
    handleLoader(true, '',data.formdata);
};

/* ========== On Upload Notification funtionality ========== */
uploadInput.oninput = () =>{
    // handleLoader(true, )

    let uploadedFileType = uploadInput.files[0]?.type;
    const res = document.createElement("div");
    res.classList.add('notification');

    if( uploadedFileType === 'audio/mpeg' || uploadedFileType === 'audio/ogg' || uploadedFileType === 'audio/wav'){
        res.innerHTML = `<div class="icon"><i class="fa-regular fa-circle-check"></i></div>
                        <div class="content">
                            <h4>Successfully uploaded!</h4>
                            <p></p>
                        </div>
                        <div class="btn"><i class="fa-solid fa-xmark"></i></div>
                        `;
    }
    else{
        res.innerHTML = `<div class="icon"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="content">
                            <h4>Uploading failed!</h4>
                            <p>Please select audio file</p>
                        </div>
                        <div class="btn"><i class="fa-solid fa-xmark"></i></div>
                        `;
    }

    notifiContainer.append(res);
    
    let notifClose = document.querySelectorAll('.btn');

    notifClose.forEach(elem =>{
        elem?.addEventListener('click', (e)=>{
            e.stopImmediatePropagation();
            res.remove();
        })
    })

    setTimeout(() => {
        res.remove();
    }, 6000);
}

/* ========== extraction of metadata functionality ========== */
uploadInput.addEventListener("change", (e) => {
    let fileType = "";
    let file = uploadInput.files[0];

    if (file.type.startsWith("audio/")) {
        fileType = AUDIO;
    } 

    let dataURL = URL.createObjectURL(file);
    let el = document.createElement(fileType);

    el.src = dataURL;
    el.onloadedmetadata = () => {
        uploadApiCall(file, {
            src: dataURL,
            duration: el.duration,
            type: uploadInput.files[0].type,
            formdata: uploadInput.files[0]
        });
    };
});


/* ========== Video from URL functionality ========== */
function getID(url){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|&v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

const YOUTUBE_KEY = 'AIzaSyCrvN38fgltQ_1RJrxAFhbKKtKjA19uH-Y';

AddBtn?.addEventListener('click', ()=>{
    if(urlInput.value){
        let vdURL = urlInput.value;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|&v=|&v=)([^#&?]*).*/;
        const match = vdURL.match(regExp)

        if(match === null){
            handleOtherWebsiteAudio(vdURL);
        }
        else{
            const videoId = getID(vdURL);

            // <iframe width="560" height="315" src="https://www.youtube.com/embed/ly36kn0ug4k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

            fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_KEY}&part=snippet,contentDetails,statistics,status`)
            .then(Response => {
                return Response.json();
            })
            .then(data => {

                let videoTitle = data.items[0].snippet.localized.title,
                    videoDuration = data.items[0].contentDetails.duration.slice(2).toLowerCase();

                
                let rCont = document.querySelector('.result__container'),
                    tBody = document.querySelector('.table-body');
            
                if(rCont){
                    tBody.innerHTML = '';
                    const newRow = document.createElement('tr');

                    // <th scope="row">${tBody.childElementCount + 1}</th>
                    newRow.innerHTML = `<td scope="row">
                                            <div class="file--cont">
                                                <div class="audio--controls" data-value=${tBody?.childElementCount}><i class="fa-solid fa-circle-play"></i></div>
                                                <div class="fileName">${videoTitle.length < 45 ? videoTitle : videoTitle.slice(0, 45)}</div>
                                                <audio>
                                                    <source src=${data?.src} type=${data?.type}>
                                                    Your browser does not support the audio tag.
                                                </audio>
                                            </div>
                                        </td>
                                        <td>${videoDuration}</td>
                                        <td class='btn--group'>
                                            <div class="actions">
                                                <div class="btn--transcribe"><i class="fa-solid fa-file-lines"></i></div>
                                                <div class="btn--remove" data-value=${tBody?.childElementCount}><i class="fa-solid fa-trash"></i></div>
                                            </div>
                                        </td>`;
            
                    tBody.append(newRow);
                    handleRemove(rCont);
                    handleLoader(true, vdURL);
                }
                else {
                    const res = document.createElement("div");
                    res.classList.add('result__container');
                    res.innerHTML = `<table>
                                            <thead>
                                            <tr>
                                                <th scope="col">File Name</th>
                                                <th scope="col">Duration</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            <thead>
                                            <tbody class="table-body">
                                            <tr>
                                                <td scope="row">
                                                    <div class="file--cont">
                                                        <div class="audio--controls" data-value='0'><i class="fa-solid fa-circle-play"></i></div>
                                                        <div class="fileName">${videoTitle.length < 45 ? videoTitle : videoTitle.slice(0, 45)}</div>
                                                        <audio>
                                                            <source src=${data?.src} type=${data?.type}>
                                                            Your browser does not support the audio tag.
                                                        </audio>
                                                    </div>
                                                </td>
                                                <td>${videoDuration}</td>
                                                <td class='btn--group'>
                                                    <div class="actions">
                                                        <div class="btn--transcribe"><i class="fa-solid fa-file-lines"></i><span>Transcribe</span></div>
                                                        <div class="btn--remove" data-value='0'><i class="fa-solid fa-trash"></i></div>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        `;

                    document.querySelector('.result').append(res);

                    handleRemove(res);
                    handleLoader(true, vdURL);
                }

                handleAudioPlay();

                const res = document.createElement("div");
                    res.classList.add('notification');

                    res.innerHTML = `<div class="icon"><i class="fa-regular fa-circle-check"></i></div>
                    <div class="content">
                        <h4>Successfully found!</h4>
                        <p></p>
                    </div>
                    <div class="btn"><i class="fa-solid fa-xmark"></i></div>
                    `;

                notifiContainer.append(res);
                dailouge.classList.remove('active');

                let notifClose = document.querySelector('.btn');
                
                notifClose?.addEventListener('click', ()=>{
                    res.remove();
                })

                setTimeout(() => {
                    res.remove();
                }, 6000);

                urlInput.value = '';

                let result = document.querySelector('.result'),
                    ytcontainer = document.createElement('div');
                    ytcontainer.classList.add('ytvideo__container');

                result.appendChild(ytcontainer);

                handleYTplayer(ytcontainer,videoId);
                
            })
            .catch(err =>{
                const res = document.createElement("div");
                    res.classList.add('notification');

                res.innerHTML = `<div class="icon"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="content">
                            <h4>Not found!</h4>
                            <p>Please check your URL</p>
                        </div>
                        <div class="btn"><i class="fa-solid fa-xmark"></i></div>
                        `;

                notifiContainer.append(res);
                dailouge.classList.remove('active');

                let notifClose = document.querySelector('.btn');
                
                notifClose?.addEventListener('click', ()=>{
                    res.remove();
                })

                setTimeout(() => {
                    res.remove();
                }, 6000);

                urlInput.value = '';
        })
        }
    }
})


/* ========== Deletion of uploaded videofunctionality ========== */
function handleRemove(obj){
    const RemoveField = document.querySelector('.btn--remove');

    RemoveField.addEventListener('click', (e)=>{
        obj.remove();
        e.stopImmediatePropagation();
    })

    // RemoveField.forEach(elem =>{
    //     elem.addEventListener('click', (e)=>{
    //         count > 1 ? obj.remove() : obj2.remove();

    //         e.stopImmediatePropagation();
    //     })
    // })
  
}

/* ========== Slider value functionality ========== */
// function handleSlider(){
    
//     console.log(slider);
//     console.log(sliderValue)

//     slider.forEach(elem =>{
//         elem.addEventListener('oninput', ()=>{
//             sliderValue.innerHTML = elem.value;
//         })
//     })
//     slider.oninput = ()=>{
//         sliderValue.innerHTML = slider.value;
//     }
// }

/* ========== Audio play/stop functionality ========== */
function handleAudioPlay(){
    let playing_audio = false,
        track = document.querySelectorAll('.file--cont audio'),
        play = document.querySelectorAll('.audio--controls');

    play.forEach(elm =>{
        let index = elm.getAttribute('data-value');
        elm.addEventListener('click', (e)=>{
            if(!playing_audio){
                track[index].play();
                playing_audio = true;
                elm.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
            }
            else{
                track[index].pause();
                playing_audio = false;
                elm.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
            }

            track[index].addEventListener('ended', ()=>{
                elm.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
                playing_audio = false;
            })
            e.stopImmediatePropagation();
        })
    })
}

/* ========== handling video link other than youtube - functionality ========== */
function handleOtherWebsiteAudio(vdURL){
    let videoTitle = 'Podcast audio title',
                    videoDuration = '10m0s';
                
                let rCont = document.querySelector('.result__container'),
                    tBody = document.querySelector('.table-body'),
                    data='';
            
                if(rCont){
                    tBody.innerHTML = '';
                    const newRow = document.createElement('tr');

                    // <th scope="row">${tBody.childElementCount + 1}</th>
                    newRow.innerHTML = `<td scope="row">
                                            <div class="file--cont">
                                                <div class="audio--controls" data-value=${tBody?.childElementCount}><i class="fa-solid fa-circle-play"></i></div>
                                                <div class="fileName">${videoTitle.length < 25 ? videoTitle : videoTitle.slice(0, 25)}</div>
                                                <audio>
                                                    <source src=${data?.src} type=${data?.type}>
                                                    Your browser does not support the audio tag.
                                                </audio>
                                            </div>
                                        </td>
                                        <td>${videoDuration}</td>
                                        <td class='btn--group'>
                                            <div class="actions">
                                                <div class="btn--transcribe"><i class="fa-solid fa-file-lines"></i></div>
                                                <div class="btn--remove" data-value=${tBody?.childElementCount}><i class="fa-solid fa-trash"></i></div>
                                            </div>
                                        </td>`;
            
                    tBody.append(newRow);
                    handleRemove(rCont);
                    handleLoader(true, vdURL);
                }
                else {
                    const res = document.createElement("div");
                    res.classList.add('result__container');
                    res.innerHTML = `<table>
                                            <thead>
                                            <tr>
                                                <th scope="col">File Name</th>
                                                <th scope="col">Duration</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                            <thead>
                                            <tbody class="table-body">
                                            <tr>
                                                <td scope="row">
                                                    <div class="file--cont">
                                                        <div class="audio--controls" data-value='0'><i class="fa-solid fa-circle-play"></i></div>
                                                        <div class="fileName">${videoTitle.length < 25 ? videoTitle : videoTitle.slice(0, 25)}</div>
                                                        <audio>
                                                            <source src=${data?.src} type=${data?.type}>
                                                            Your browser does not support the audio tag.
                                                        </audio>
                                                    </div>
                                                </td>
                                                <td>${videoDuration}</td>
                                                <td class='btn--group'>
                                                    <div class="actions">
                                                        <div class="btn--transcribe"><i class="fa-solid fa-file-lines"></i></div>
                                                        <div class="btn--remove" data-value='0'><i class="fa-solid fa-trash"></i></div>
                                                    </div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        `;

                    document.querySelector('.result').append(res);

                    // let Delete = document.querySelector('.table-body tr');
                    handleRemove(res);
                    handleLoader(true, vdURL);
                }
                
                handleAudioPlay();
                const res = document.createElement("div");
                      res.classList.add('notification');

                      res.innerHTML = `<div class="icon"><i class="fa-regular fa-circle-check"></i></div>
                      <div class="content">
                          <h4>Successfully found!</h4>
                          <p></p>
                      </div>
                      <div class="btn"><i class="fa-solid fa-xmark"></i></div>
                      `;

                notifiContainer.append(res);
                dailouge.classList.remove('active');
    
                let notifClose = document.querySelector('.btn');
                
                notifClose?.addEventListener('click', ()=>{
                    res.remove();
                })

                setTimeout(() => {
                    res.remove();
                }, 6000);

                urlInput.value = '';
}

/* ========== Loader functionality ========== */
function handleLoader(status, vdURL, uViedo){
    let trancribeBtn = document.querySelector('.btn--transcribe'),
        trancribeBtn2 = document.querySelector('.btn--transcribe1'),
        transcribeContainer = document.querySelector('transcribe__container'),
        loader = document.querySelector('.loading');

        if(!status){
            loader.classList.remove('active');
        }

    if(trancribeBtn)
    {
        trancribeBtn.addEventListener('click', (e)=>{
            if(status){
                loader.classList.add('active');

                if(vdURL !== '')
                    handlePostVideoLink(vdURL);
                else
                    handlePostAudio(uViedo, trancribeBtn);
                
                e.stopImmediatePropagation();
            }
        })
    }

    trancribeBtn2 ? (trancribeBtn2.addEventListener('click', (e)=>{
        if(status){
            loader.classList.add('active');

            handlePostAudio(uViedo, trancribeBtn2);
            
            e.stopImmediatePropagation();
        }
    })) : null;
}


/* ========== Sending Video Link functionality ========== */
async function handlePostVideoLink(vdURL){
    await fetch("https://d5b4-173-49-207-77.ngrok.io/link", 
        {
            method: "post",
            headers: 
                {
                    "Content-Type": "application/json",
                },

            body : JSON.stringify( {
                'li' : vdURL
            })
        })
        .then(data => data.json())
            .then(function(response){
                handleTranscribeShow(response);
                handleLoader(false,'','');
            })
            .catch(err => {
                handleLoader(false,'','');
                handleResponseError(err);
            })
}

/* ========== Sending Audio file functionality ========== */
async function handlePostAudio(file, tbtn) {
    // var formdata = new FormData();
    // formdata.append("file", file, file.name);

    // var requestOptions = {
    // method: 'POST',
    // body: formdata,
    // redirect: 'follow'
    // };

    // fetch("https://autochaptering.pagekite.me/audio", requestOptions)
    // .then(response => response.json())
    // .then(result => {
    //     handleLoader(false, '','');
    //     handleTranscribeShow(result);
    // })
    // .catch(error => {
    //     console.log('error', error);
    //     handleLoader(false, '', '');
    //     handleResponseError(error);
    // });

    let bar = document.querySelector('#progress'),
        progressB = document.querySelector('.progress__bar');
    progressB.classList.add('active');

    const formData = new FormData();
    formData.append('file', file, file.name);
  
    // Axios
    const config = {
        withCredentials: false,
        onUploadProgress: function(progressEvent) {
            const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total)*100);

            bar.setAttribute('value', percentCompleted);
            bar.nextElementSibling.textContent = `${percentCompleted}%`
            if (percentCompleted === 100) {
                bar.nextElementSibling.textContent = `Upload complete!`
                setTimeout(() => {
                    progressB.classList.remove('active');
                }, 4000);
            }
        }
    }

    tbtn.classList === "btn--transcribe" ? (axios.post('https://d5b4-173-49-207-77.ngrok.io/audio', formData, config)
    .then(response => {
        handleLoader(false, '','');
        handleTranscribeShow(response.data);
    })
    .catch(error => {
        handleLoader(false, '', '');
        handleResponseError(error);
    })) : (axios.post("https://0872-185-158-179-210.eu.ngrok.io/audio", formData, config)
            .then(response => {
                handleLoader(false, '','');
                handleQnAgenerate(response.data);
            })
            .catch(error => {
                handleLoader(false, '', '');
                handleResponseError(error);
            }))
    
    

}

/* ========== Transcription show functionality ========== */
// let response = [
//   {
//     "id": 0,
//     "timestamp": "[0 : 0 : 0]",
//     "speaker": "Speaker 0",
//     "title": "Introduction",
//     "paragraph": [
//       {
//         "subpara_id": 0,
//         "sub_paragraph": " Now that we're two-thirds of the way through 2020, we thought it was about time to make a video about the future. Until recently, they used to make science fiction movies about the year we're in now, movies with robots and flying cars. Okay, they didn't predict coronavirus, but neither did any of us. Anyway, we figured you've had enough of hearing about the coronavirus right now, so we thought we'd stick to the robots and flying cars and other mind-blowing technologies that are already changing the world, or about to change it."
//       }
//     ],
//     "summary": "We thought it was about time to make a video about the future. Until recently, they used to make science fiction movies about the year we're in now."
//   },
//   {
//     "id": 1,
//     "timestamp": "[0 : 0 : 0]",
//     "speaker": "Speaker 0",
//     "title": "ALUX.com: Robots",
//     "paragraph": [
//       {
//         "subpara_id": 2,
//         "sub_title": "ALUX.com: Robots",
//         "sub_paragraph": "Welcome to ALUX.com! The place where future billionaires come to get inspired. If you're not subscribed yet, you're missing out. Yet we promised we'd give you robots and we don't like to disappoint. The robots we're talking about don't look like the ones from Star Wars. Lots of them, like Alexa and Siri, you can't even see because they're a computer program. What makes them robots is the fact that they can take data, analyze it and learn from it and keep on getting more intelligent, or the ones on Google and Facebook that figure out what ads they should make pop up on your screen. And for when you actually leave your living room, robots are already helping us build stuff in factories, analyze financial reports, act as virtual nurses for patients.",
//         "similarity_value1": 0.5025502443313599,
//         "similarity_value2": 0.5875542163848877
//       },
//       {
//         "subpara_id": 4,
//         "sub_title": "The Future of Robots",
//         "sub_paragraph": "In the future, we could be talking about robots we have in our houses that will be able to cook for us, do all kinds of boring jobs. And outside of our houses doing dangerous ones like fighting fires or picking up radioactive waste. And a whole load of other things we'll get into later in the video.",
//         "similarity_value1": 0.6024361252784729,
//         "similarity_value2": 0.6024361252784729
//       },
//       {
//         "subpara_id": 5,
//         "sub_title": "AI is already combining with pretty much every recent technology and it's only going to keep",
//         "sub_paragraph": "That's because AI is already combining with pretty much every recent technology and it's only going to keep on doing that. Imagine being able to control a computer mouse and a keyboard or a drone with not a set of controls, but just by thinking about it. Or hearing music, not from speakers, but that's being streamed straight into your brain. Maybe that thought blows your mind or perhaps it even creeps you out.",
//         "similarity_value1": 0.3549569547176361,
//         "similarity_value2": 0.3549569547176361
//       },
//       {
//         "subpara_id": 6,
//         "sub_title": "Neuralink is a chip that can communicate with computers",
//         "sub_paragraph": "Either way, it's already being developed and it's coming soon. Leading the way is Elon Musk's company Neuralink, which is looking at ways to implant a chip into your brain that will be able to communicate with computers. And just in case you thought we made the thing up about streaming music directly to your brain, that actually came from a tweet on Elon Musk's twitter feed. If the thought creeps you out a bit, you're not alone, but the idea behind it is to help humans compete with super intelligent robots and it also aims to cure disorders like depression and addiction by rewiring brain patterns.",
//         "similarity_value1": 0.39451438188552856,
//         "similarity_value2": 0.4469987154006958
//       }
//     ],
//     "summary": " AI is already combining with pretty much every recent technology and it's only going to keep on doing that. Leading the way is Elon Musk's company Neuralink, which is looking at ways to implant a chip into your brain that will be able to communicate with computers. Imagine being able to control a computer mouse and a keyboard or a drone with not a set of controls, but just by thinking about it. And a whole load of other things we'll get into later in the video."
//   },
//   {
//     "id": 2,
//     "timestamp": "not-defined",
//     "speaker": "Speaker 0",
//     "title": "Alux, this is old news.",
//     "paragraph": [
//       {
//         "subpara_id": 9,
//         "sub_title": "Alux, this is old news.",
//         "sub_paragraph": "But Alux, this is old news. Well, yes, but it's about to go to a whole new level. Of course, we're not just talking about those craft videos that come up on your facebook feed with decorations people have made with 3D printing.",
//         "similarity_value1": 0.1344248354434967,
//         "similarity_value2": 0.1344248354434967
//       },
//       {
//         "subpara_id": 10,
//         "sub_title": "3D Printing Fashion Accessories, Even Car Parts, is kinda old school now.",
//         "sub_paragraph": "3D printing fashion accessories, even car parts, is kinda old school now. More cutting edge are 3D printed organs that use patient cells, which will mean they don't have to wait for an organ donor. In China, they've 3D printed an entire apartment block and the future of 3D printed buildings could bring down the price of housing and solve the problem of homelessness. Also, 3D printed rockets could be on the way too.",
//         "similarity_value1": 0.3822651505470276,
//         "similarity_value2": 0.3822651505470276
//       },
//       {
//         "subpara_id": 11,
//         "sub_title": "NASA has already made a 3D printed rocket injector and a California-based company",
//         "sub_paragraph": "NASA has already made a 3D printed rocket injector and a California-based company, Relativity Space, aims to make the first fully 3D printed space rockets for a fraction of what they cost now. And by throwing a bit of AI into the mix, the technology will be able to detect faults in the design and improve on them. But they're not there yet. First, they need to figure out how to 3D print something that's 100 feet tall and out of a material that can withstand the temperatures of take-off.",
//         "similarity_value1": 0.5934862494468689,
//         "similarity_value2": 0.5934862494468689
//       }
//     ],
//     "summary": "NASA has already made a 3D printed rocket injector. California-based company, Relativity Space, aims to make the first fully3D printed space rockets for a fraction of what they cost now. In China, they've 3d printed an entire apartment block."
//   },
//   {
//     "id": 3,
//     "timestamp": "not-defined",
//     "speaker": "Speaker 0",
//     "title": "The Robots of Tomorrow",
//     "paragraph": [
//       {
//         "subpara_id": 12,
//         "sub_title": "The Robots of Tomorrow",
//         "sub_paragraph": "Next, a completely different kind of robot. No, not one that's so cute that it makes you think it's alive.",
//         "similarity_value1": 0.16530412435531616,
//         "similarity_value2": 0.16530412435531616
//       },
//       {
//         "subpara_id": 13,
//         "sub_title": "Living Robots: The Future of Medicine",
//         "sub_paragraph": "If you remember Tamagotchis, we're not talking about those. These so-called living robots are made of a real living tissue and could revolutionize medicine. Scientists have taken stem cells from frogs, and they've used computer programs to assemble them into blobs, about a millimeter in diameter. They're not robots as we know them, and even though they come from living tissue, they're not classed as animals either. They're tiny, programmable organisms that can move independently and can even work together as a team. They might even be able to self-heal their wounds, remove plaque from human arteries or take medicine into patients' bodies. It's fascinating stuff.",
//         "similarity_value1": 0.4675177335739136,
//         "similarity_value2": 0.4675177335739136
//       }
//     ],
//     "summary": "Scientists have taken stem cells from frogs and used computer programs to assemble them into blobs. They're not robots as we know them, and even though they come from living tissue, they're not classed as animals either."
//   },
//   {
//     "id": 4,
//     "timestamp": "not-defined",
//     "speaker": "Speaker 0",
//     "title": "AR and the future of digital photography",
//     "paragraph": [
//       {
//         "subpara_id": 14,
//         "sub_title": "AR and the future of digital photography",
//         "sub_paragraph": "If you've played Pokemon Go, you've already used AR, but chasing Pokemon is just the tip of the iceberg with this exciting technology and the boundaries are just going to keep growing. Overlaying digital images onto real-life backgrounds could have all kinds of applications in the future, like AR manuals.",
//         "similarity_value1": 0.22619158029556274,
//         "similarity_value2": 0.22619158029556274
//       },
//       {
//         "subpara_id": 15,
//         "sub_title": "How to fix a car engine",
//         "sub_paragraph": "Think of the last time you had to fix a car engine but weren't sure what you had to do. Forget looking for a tutorial on YouTube, soon enough you might be able to put on a pair of AR glasses or contact lenses and then look at the engine. With the help of a bit of AI, the software will analyze the problem and then show you exactly what you have to do and then give you feedback on whether you're doing it right.",
//         "similarity_value1": 0.34305134415626526,
//         "similarity_value2": 0.3931024372577667
//       },
//       {
//         "subpara_id": 17,
//         "sub_title": "How about a city guide that doesn't just show you the best restaurants and nightlife",
//         "sub_paragraph": "How about a city guide that doesn't just show you the best restaurants and nightlife on a map, but will point it out to you in real-time with menus and reviews appearing next to them. And instead of seeing advertising billboards in the city, your AR glasses will show you virtual adverts tailored for you, which means it's got big potential for advertising as well. Or what about doing some online shopping for clothes and see yourself wearing them even though you've never been anywhere near them. Getting a preview of how furniture will look in your room even though it's still in the warehouse or conference calling someone on the other side of the world and having them appear on your couch. And these are just a few things AR could be bringing to us soon.",
//         "similarity_value1": 0.2591871917247772,
//         "similarity_value2": 0.3059501647949219
//       }
//     ],
//     "summary": "Overlaying digital images onto real-life backgrounds could have all kinds of applications in the future. Think of the last time you had to fix a car engine but weren't sure what to do. How about a city guide that doesn't just show you the best restaurants and nightlife on a map, but will point it out to you in real-time."
//   },
//   {
//     "id": 5,
//     "timestamp": "not-defined",
//     "speaker": "Speaker 0",
//     "title": "VR Bodysuits with Sensors",
//     "paragraph": [
//       {
//         "subpara_id": 20,
//         "sub_title": "VR Bodysuits with Sensors",
//         "sub_paragraph": "For any gamers out there, you'll know when you get hit in a game and you feel a dull thud from your control panel. That is this concept, tactile or haptic feedback, but it's about to be taken to a whole new level. Imagine the same idea but in a bodysuit with sense transmitters all over it. It will mean that your VR experience lets you feel the experience as well as see and hear it. Bodysuits like these that let you feel as well as see and hear virtual worlds are already on the market, and they have uses in sports training, rehabilitation and gaming too.",
//         "similarity_value1": 0.20140671730041504,
//         "similarity_value2": 0.20140671730041504
//       },
//       {
//         "subpara_id": 21,
//         "sub_title": "The technology is also being tested for training surgeons.",
//         "sub_paragraph": "The technology is also being tested for training surgeons. In simulation programs for practicing complicated surgery, it helps to be able to feel the resistance of body tissues when they're being cut into or sewn. Programs that can do this make the training more realistic and are already in development.",
//         "similarity_value1": 0.46911177039146423,
//         "similarity_value2": 0.46911177039146423
//       }
//     ],
//     "summary": "Bodysuits that let you feel as well as see and hear virtual worlds are already on the market. They have uses in sports training, rehabilitation and gaming too. The technology is also being tested for training surgeons."
//   },
//   {
//     "id": 6,
//     "timestamp": "not-defined",
//     "speaker": "Speaker 0",
//     "title": "Self-driving Vehicles: The future of self-driving vehicles",
//     "paragraph": [
//       {
//         "subpara_id": 22,
//         "sub_title": "Self-driving Vehicles: The future of self-driving vehicles",
//         "sub_paragraph": "Yes, thanks to Tesla, self-driving vehicles are already on the market, but what's been done so far is only the tip of the iceberg. For Tesla and other companies, the goal is level 5 automation. That means there's no steering wheel or pedals, the passenger just inputs where they want to go and the car does all the work. That means we could be looking at a future where most people don't own a car, instead there are just fleets of self-driving vehicles on the road, which you just jump into and enjoy the ride. Not so great if you love being behind the wheel yourself, but it promises to reduce congestion and pollution and it could make parking lots obsolete and free up that space for other uses. And speaking of self-driving vehicles, why stop at cars?",
//         "similarity_value1": 0.3978284001350403,
//         "similarity_value2": 0.22753801941871643
//       }
//     ],
//     "summary": "Self-driving vehicles are already on the market, but what's been done so far is only the tip of the iceberg. Tesla and other companies, the goal is level 5 automation. That means there's no steering wheel or pedals, the passenger just inputs where they want to go and the car does all the work."
//   },
//   {
//     "id": 7,
//     "timestamp": "not-defined",
//     "speaker": "Speaker 0",
//     "title": "The world's first autonomous drone taxis are in development",
//     "paragraph": [
//       {
//         "subpara_id": 24,
//         "sub_title": "The world's first autonomous drone taxis are in development",
//         "sub_paragraph": "In Dubai, the world's first autonomous drone taxis are in development. The company that's developing them, Volocopter, aims to launch them by 2023 and they estimate that by 2030, a quarter of journeys in Dubai will be done by drone taxi.",
//         "similarity_value1": 0.20106248557567596,
//         "similarity_value2": 0.20106248557567596
//       },
//       {
//         "subpara_id": 25,
//         "sub_title": "Drone taxis: The future of transport",
//         "sub_paragraph": "When it comes to transport of the future, if drone taxis aren't exciting enough for you, maybe this will be. Imagine doing long-distance journeys at a speed even faster than a jet plane, but without having to be airborne and potentially with zero carbon impact.",
//         "similarity_value1": 0.5952160358428955,
//         "similarity_value2": 0.5952160358428955
//       },
//       {
//         "subpara_id": 26,
//         "sub_title": "Hyperloop: Elon Musk's working on a new technology",
//         "sub_paragraph": "Well, that's something Elon Musk is working on. It's a joint project between Tesla and SpaceX and it's called the Hyperloop. It works by placing a pod inside a tunnel with low air pressure, and as the air resistance and friction are low, it can travel at hypersonic speeds. In testing, they've reached 460 km per hour. They aim to get that up to 1200 km per hour. That's faster than a commercial jet. Oh, and Elon tells us it will work even better on Mars, where there will be no need for a tunnel because there's almost no atmosphere there.",
//         "similarity_value1": 0.4930597245693207,
//         "similarity_value2": 0.6230267882347107
//       }
//     ],
//     "summary": "The world's first autonomous drone taxis are in development in Dubai. The company that's developing them, Volocopter, aims to launch them by 2023. They estimate that by 2030, a quarter of journeys in Dubai will be done by drone taxi."
//   },
//   {
//     "id": 8,
//     "timestamp": "not-defined",
//     "speaker": "Speaker 0",
//     "title": "Alternatives to fossil fuels and a carbon-neutral future",
//     "paragraph": [
//       {
//         "subpara_id": 28,
//         "sub_title": "Alternatives to fossil fuels and a carbon-neutral future",
//         "sub_paragraph": "Good to know. The hunt is on for alternatives to fossil fuels and a carbon-neutral future. Everybody with common sense knows it's the way forward apart from people working for oil companies or whose election campaigns are funded by them.",
//         "similarity_value1": 0.2778072655200958,
//         "similarity_value2": 0.2778072655200958
//       },
//       {
//         "subpara_id": 29,
//         "sub_title": "Hydrogen Fuel Cells: The Future of Fuel Cells",
//         "sub_paragraph": "We've all heard about electric cars, but another option that doesn't pollute is hydrogen power. Hydrogen fuel cells to power engines have been around for a while. In 2015, Toyota produced a car that runs on hydrogen, the Mirai, and by the end of 2019, they'd only sold 10,000 of them. Not a huge number. That's because there are still problems to deal with before hydrogen really takes off. First, even if hydrogen is the most abundant element in the universe, it's still difficult to put it into pure form. That makes it expensive. By the mile, it's about 4 times as expensive as gasoline. Second, it's highly flammable, which makes it dangerous.",
//         "similarity_value1": 0.3666958510875702,
//         "similarity_value2": 0.3666958510875702
//       },
//       {
//         "subpara_id": 30,
//         "sub_title": "The search is on to make hydrogen more available, safer and cheaper.",
//         "sub_paragraph": "Yes, gasoline is also flammable, but not as difficult or dangerous to store as hydrogen. And this makes the technology more expensive. And a hydrogen vehicle costs about twice as much as a comparable vehicle that runs on gas. But the search is on to make hydrogen more available, safer and cheaper.",
//         "similarity_value1": 0.7040698528289795,
//         "similarity_value2": 0.7040698528289795
//       }
//     ],
//     "summary": "Hydrogen fuel cells to power engines have been around for a while. In 2015, Toyota produced a car that runs on hydrogen, the Mirai. By the end of 2019, they'd only sold 10,000 of them. That's because there are still problems to deal with before hydrogen really takes off."
//   },
//   {
//     "keywords": [
//       "body tissues",
//       "flying cars",
//       "electric cars",
//       "virtual worlds",
//       "drone taxis",
//       "hydrogen power",
//       "other companies"
//     ]
//   }
// ]
  
handleTranscribeShow(response);

function handleTranscribeShow(response){
    let transcribe = document.querySelector('.transcribe'),
        transcribeContainer = document.createElement('div');

    transcribeContainer.classList.add('transcribe__container');
    transcribeContainer.innerHTML = `<div class="heading">
                                            <div class="transcribe__heading">Transcription</div>
                                            <div class="transcribe__summary">Summary</div>
                                            <button class="generate__pdf"><i class="fa-solid fa-download"></i><span>Generate PDF</span></button>
                                        </div>
                                        <div class="transcribed--result"></div>`;

    transcribe.appendChild(transcribeContainer);

    let resultCont = document.querySelector('.transcribed--result'),
        summaryBtn = document.querySelector('.transcribe__summary');

    let summarySidebar = document.createElement('div'),
        keywordsCont = document.createElement('div');
        summarySidebar.classList.add('summary--container');
        keywordsCont.classList.add('keywords');

        summarySidebar.innerHTML = `<div>
                                        <h3 class="title">Summary Title goes here</h3>
                                        <div class="speaker--detail">
                                            <p class="speaker">Speaker</p>
                                            <p class="time">Time</p>
                                        </div>
                                        <p class="paragraph">
                                            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima dicta nihil maiores optio explicabo alias ad doloribus ratione nulla voluptate."
                                        </p>
                                        <p class="paragraph">
                                            "Lorem ipsum dolor, Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem, eligendi. sit amet consectetur adipisicing elit. Minima dicta nihil maiores optio explicabo alias ad doloribus ratione nulla voluptate."
                                        </p>
                                    </div>`;


        resultCont.appendChild(summarySidebar);

        summaryBtn.addEventListener('click', ()=>{
            summarySidebar.classList.toggle('active');
            resultCont.classList.toggle('blur');
            summaryBtn.innerHTML === 'Summary' ? summaryBtn.innerHTML = 'Close' : summaryBtn.innerHTML = 'Summary';
        })
    
    let k = response[response.length-1].keywords;

    for(let i = 0; i < k.length; i++){
        let span = document.createElement('span');
        span.innerHTML = `${k[i]}`;
        keywordsCont.appendChild(span);
    }

    resultCont.appendChild(keywordsCont);

    for(let i = 0; i < response.length-1; i++){
        let div = document.createElement('div');
        div.innerHTML = `<h3 class="title">${response[i].title}</h3>
                        <div class="speaker--detail">
                            <p class="speaker">${response[i].speaker}</p>
                            <p class="time">${response[i].timestamp}</p>
                        </div>
                        `;
        for(let j = 0; j < response[i].paragraph.length; j++){
            let para = document.createElement('p');
            para.classList.add('paragraph');
            para.innerHTML = response[i].paragraph[j].sub_paragraph;
            div.appendChild(para);
        }
        resultCont.appendChild(div)
    }

    keywordsCont.childNodes.forEach(elem =>{
        elem.addEventListener('click', handleHighlight);
        elem.addEventListener('click', handleClearHighlight);
    })

    handleGeneratePDF();
}

/* ========== Error notification functionality ========== */
function handleResponseError(err){
    const res = document.createElement("div");
                    res.classList.add('notification');

                res.innerHTML = `<div class="icon"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="content">
                            <h4>${err}!</h4>
                            <p>Try again later</p>
                        </div>
                        <div class="btn"><i class="fa-solid fa-xmark"></i></div>
                        `;

                notifiContainer.append(res);
                dailouge.classList.remove('active');

                let notifClose = document.querySelector('.btn');
                
                notifClose?.addEventListener('click', ()=>{
                    res.remove();
                })

                setTimeout(() => {
                    res.remove();
                }, 6000);
}

/* ============== Show scroll UP ============== */
function scrollUp(){
    const scrollach = document.getElementById('scroll-up'),
          scrollBtn = document.querySelector('.scroll__up');

    if(scrollach)
        scrollach.onclick = (e)=>{ e.preventDefault};
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll tag
    if(this.scrollY >= 460) 
        scrollBtn.classList.add('show-scroll'); 
    else 
        scrollBtn.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/* ============== Keyword highlight functionality ============== */
let KeyWord = document.querySelectorAll('.keywords span')
KeyWord.forEach(elem =>{
    elem.addEventListener('click', handleHighlight);
    elem.addEventListener('click', handleClearHighlight);
})
function handleHighlight(){
    let paras = document.querySelectorAll('.paragraph'),
        keyword = this.innerHTML;

    if(!document.querySelector('.clearHighlight'))
    {
        let span = document.createElement('span');
            span.classList.add('clearHighlight');
            span.innerHTML= "Clear Highlights";
        
        this.parentElement.appendChild(span);
    }

    const special = /[\\[{().+*?|^$]/g;

    if(special.test(keyword))
        keyword = keyword.replace(special, "\\$&");

        let regExp = new RegExp(keyword, "gi");
        paras.forEach(elem =>{
            elem.innerHTML = (elem.textContent).replace(regExp, "<mark>$&</mark>")
    })
}

/* ============== Clear Keyword highlight functionality ============== */
function handleClearHighlight(){
    let paras = document.querySelectorAll('.paragraph'),
        keyword = this.innerHTML;
        clear = this.parentElement.lastChild;

        clear.onclick = () =>{
            const special = /[\\[{().+*?|^$]/g;

            if(special.test(keyword))
                keyword = keyword.replace(special, "\\$&");

                let regExp = new RegExp(keyword, "gi");
                paras.forEach(elem =>{
                    elem.innerHTML = (elem.textContent).replace(regExp, "$&");
                    clear.remove();
            })
        }
}

/* ============== Youtube video player functionality ============== */
async function handleYTplayer(ytCont,videoID){
    let iframeMarkup = document.createElement('iframe');
        ytCont.append(iframeMarkup);

    iframeMarkup.src = `https://www.youtube-nocookie.com/embed/${videoID}`
    iframeMarkup.title = "YouTube video player";
    iframeMarkup.frameBorder = "0";
    iframeMarkup.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframeMarkup.allowFullscreen = "";
    iframeMarkup.sameSite= "Secure" ;
}

/* ============== Generate PDF of transcription functionality ============== */
function handleGeneratePDF(){
    let btn = document.querySelector(".generate__pdf"),
        transcription = document.querySelector('.transcribed--result'),
        summaryCont = document.querySelector('.summary--container');

        btn.addEventListener('click', ()=>{
            // let mywindow = new jsPDF("p", "mm",[400,600]);
                // mywindow.document.write(transcription.innerHTML);
                
                // mywindow.document.close();
                // mywindow.focus();

                // mywindow.print();
                // mywindow.close();

                // mywindow.fromHTML(transcription);
                // mywindow.save("transcription.pdf");

                // return true;

            // html2pdf().from(transcription).save();

            summaryCont.classList.add('print');

            html2pdf(transcription,{
                margin:       [5, 10],
                filename:    'transcription.pdf',
                pagebreak:   { mode: ['avoid-all','css', 'legacy'] },
                image:       { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
                jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
            });

            setTimeout(() => {
                summaryCont.classList.remove('print');
            }, 3000);
        })
}



/* ============================ MEDPAGE JS ============================ */
/* ============== NEW FUNCTIONS FOR NEW PAGE WITH REUSE OF OLD ============== */

/* ============== Toggle questions ============== */
function handleToggleActiveQnA(){
    let qna_cont = document.querySelectorAll('.qna__container');

    qna_cont.forEach(qnaC =>{
        qnaC.addEventListener('click', ()=>{
            qnaC.classList.toggle('active');
            qnaC.firstElementChild.firstElementChild.firstElementChild.classList.toggle('active');
            qnaC.lastElementChild.classList.toggle('active');
        })
    })
}

/* ============== Generate PDF of Medical q&a functionality ============== */
function handleGeneratePDF2(){
    let btn = document.querySelector(".generate__pdf"),
        qnas = document.querySelector('.qna__section'),
        queCont = document.querySelectorAll('.qna__container'),
        askque = document.querySelector('.qna__container.mod--2');

        btn?.addEventListener('click', ()=>{
            askque.style.display = 'none';

            queCont.forEach((que)=>{
                que.classList.add('active');
                let icon = que.firstElementChild?.firstElementChild?.firstElementChild;
                icon ? icon.style.opacity = "0": null;
                icon?.classList.contains('active') ? null : icon?.classList.add('active');
                que.lastElementChild?.classList.add('active');
            })
            askque.classList.remove('active');

            html2pdf(qnas,{
                margin:       [5, 10],
                filename:    'qnas.pdf',
                pagebreak:   { mode: ['avoid-all','css', 'legacy'] },
                image:       { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
                jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
            });

            setTimeout(() => {
                askque.style.display = 'flex';
                queCont.forEach((que)=>{
                    let icon = que.firstElementChild?.firstElementChild?.firstElementChild;
                    icon ? icon.style.opacity = "1": null;
                })
            }, 100);
        })
}

/* ============== Dynamically Q&A generation functionality ============== */
// let response = [
//     {
//       "original_question": "For Female Are you currently pregnant ",
//       "question_asked": "Are you married or unmarried",
//       "answer": "Unmarried",
//       "confidence": 0.8427181839942932
//     },
//     {
//       "original_question": "For MaleHave you ever been diagnosed OR treated for Prostate related disorder or been under follow up for the same with PSA test",
//       "question_asked": "Have you ever had a gynecological examination done for any breast related uterus or sub weeks",
//       "answer": "Yes and gynecologists also go for PCOD",
//       "confidence": 0.8910397291183472
//     },
//     {
//       "original_question": "Have you ever been hospitalized for any illness",
//       "question_asked": "Were you admitted to the hospital",
//       "answer": "No I was a minor",
//       "confidence": 0.8412965536117554
//     },
//     {
//       "original_question": "Do you or your spouse has been tested positive or is under treatment for HIV ",
//       "question_asked": "Have you tested positive for any symptoms of coronavirus like selfisolation or home quarantine",
//       "answer": "No",
//       "confidence": 0.8693479299545288
//     },
//     {
//       "original_question": "Is there anything else that you would like to share with us with respect to your health",
//       "question_asked": "Is there anything else related to your health that you want to share with us",
//       "answer": "I have PCOD",
//       "confidence": 0.9473487138748169
//     },
//     {
//       "original_question": "Are you currently in Good Health ",
//       "question_asked": "Is your current health status good",
//       "answer": "Yes",
//       "confidence": 0.9336090087890625
//     },
//     {
//       "original_question": "Have you ever been diagnosed and treated for any of following conditions or are currently being treated or underwent surgery for High blood pressure",
//       "question_asked": "Have you ever undergone any treatment or surgery because of your diabetes or high blood pressure",
//       "answer": "No",
//       "confidence": 0.9041109681129456
//     },
//     {
//       "original_question": "For Female Have you undergone any gynaecological investigations for any problems of breast ",
//       "question_asked": "Have you ever had a gynecological examination done for any breast related uterus or sub weeks",
//       "answer": "Yes and gynecologists also go for PCOD",
//       "confidence": 0.9173902869224548
//     },
//     {
//       "original_question": "Have you ever been diagnosed and treated for any of following conditions or are currently being treated or underwent surgery for Diabetes",
//       "question_asked": "Have you ever undergone any treatment or surgery because of your diabetes or high blood pressure",
//       "answer": "No",
//       "confidence": 0.8868531584739685
//     },
//     {
//       "original_question": "Have you ever in the past consumed or currently consume tobacco in any form like Cigarette",
//       "question_asked": "Okay Do you smoke or do you smoke in the past",
//       "answer": "No",
//       "confidence": 0.8574463725090027
//     },
//     {
//       "original_question": "Has any of your insurance application or reinstatement application on life",
//       "question_asked": "Have you ever received any insurance application declined postponed or extra premium",
//       "answer": "No",
//       "confidence": 0.8953300714492798
//     },
//     {
//       "original_question": "Have you ever been diagnosed and treated for any of following conditions or are currently being treated or underwent surgery for Chest pain",
//       "question_asked": "Have you ever had any illness sickness disease injury accident or any other reason that you have been admitted to the hospital",
//       "answer": "No",
//       "confidence": 0.8868497610092163
//     },
//     {
//       "original_question": "Do you have any other health condition or are you currentlyin past were under any treatment for any health condition not covered above",
//       "question_asked": "Any other health condition of the past or currently that you are taking treatment for",
//       "answer": "No",
//       "confidence": 0.9295910000801086
//     },
//     {
//       "original_question": "Have you ever been diagnosed and treated for any of following conditions or are currently being treated or underwent surgery for Any lung",
//       "question_asked": "Any other health condition of the past or currently that you are taking treatment for",
//       "answer": "No",
//       "confidence": 0.8902758359909058
//     },
//     {
//       "original_question": "Have you ever been diagnosed and treated for any of following conditions or are currently being treated or underwent surgery for Cancer or tumor of any kind",
//       "question_asked": "Have you ever had any cancer tumor lump cyst in any part of your body that caused you to undergo treatment or surgery",
//       "answer": "I had a lump in my past",
//       "confidence": 0.9129224419593811
//     },
//     {
//       "original_question": "For Female Have you ever consulted a doctor because of an irregularity at the breast",
//       "question_asked": "Have you ever had a gynecological examination done for any breast related uterus or sub weeks",
//       "answer": "Yes and gynecologists also go for PCOD",
//       "confidence": 0.890731155872345
//     },
//     {
//       "original_question": "Have you ever been diagnosed and treated for any of following conditions or are currently being treated or underwent surgery for Any Accidental injury",
//       "question_asked": "Have you ever had any illness sickness disease injury accident or any other reason that you have been admitted to the hospital",
//       "answer": "No",
//       "confidence": 0.895938515663147
//     },
//     {
//       "original_question": "Have you ever in the past or are currently consuming Alcohol",
//       "question_asked": "Do you smoke or do you smoke in the past",
//       "answer": "No",
//       "confidence": 0.8697816133499146
//     },
//     {
//       "original_question": "Have you ever been tested positive for coronavirus COVID19",
//       "question_asked": "Have you tested positive for coronavirus",
//       "answer": "No",
//       "confidence": 0.947839081287384
//     },
//     {
//       "original_question": "Have you undergone any investigations like blood ",
//       "question_asked": "Did you undergo any surgery",
//       "answer": "Minor surgery",
//       "confidence": 0.8551685810089111
//     },
//     {
//       "original_question": "Have you been vaccinated for COVID19",
//       "question_asked": "Have you tested positive for any reaction after vaccination",
//       "answer": "No",
//       "confidence": 0.9065518975257874
//     },
//     {
//       "original_question": "Your annual income",
//       "question_asked": "Okay Your annual income",
//       "answer": "Annual income is 35 lakhs",
//       "confidence": 0.8235242962837219
//     },
//     {
//       "original_question": "Have you ever in the past or are currently consuming Narcotics",
//       "question_asked": "Okay Do you smoke or do you smoke in the past",
//       "answer": "No",
//       "confidence": 0.8567601442337036
//     },
//     {
//       "original_question": "Have either of your natural parents or any siblings suffered from or are suffering from any medical condition like Cancer",
//       "question_asked": "Do your parents or siblings have any medical conditions like cancer heart failure diabetes blood pressure hepatitis",
//       "answer": "No",
//       "confidence": 0.8750635981559753
//     },
//     {
//       "original_question": "What is your Height",
//       "question_asked": "What is your height",
//       "answer": "54",
//       "confidence": 1.0000001192092896
//     },
//     {
//       "original_question": "Your current Occupation",
//       "question_asked": "Okay Your current occupation",
//       "answer": "Mohali",
//       "confidence": 0.8888080716133118
//     },
//     {
//       "original_question": "What is your your Date of birth",
//       "question_asked": "Okay Your date of birth",
//       "answer": "9th November 1995",
//       "confidence": 0.8542888164520264
//     },
//     {
//       "original_question": "Are you taking any type of medication currently",
//       "question_asked": "Do you take any medication currently",
//       "answer": "No I dont take any now",
//       "confidence": 0.9494097232818604
//     },
//     {
//       "original_question": "Have you lost or gained weight of 10 kg or more in the last six months",
//       "question_asked": "In the last 6 months have you gained or lost 10 kg weight",
//       "answer": "I have not gained 10 kg but I have gained 345 kg",
//       "confidence": 0.9556166529655457
//     },
//     {
//       "original_question": "What is your Weight",
//       "question_asked": "Okay What is your weight",
//       "answer": "55 kg",
//       "confidence": 0.9427151679992676
//     },
//     {
//       "original_question": "What is your full Name",
//       "question_asked": "Your full name",
//       "answer": "Tanya Sharma",
//       "confidence": 0.9117597937583923
//     }
//   ];

function handleQnAgenerate(response){
    qna = document.querySelector('.qna');

    let qnaSection = document.createElement('div'),
        qnaCont2 = document.createElement('div'),
        pdfGen = document.createElement('div');

        qnaSection.classList.add('qna__section');
        qnaCont2.classList.add('qna__container');
        qnaCont2.classList.add('mod--2');
        pdfGen.classList.add('pdf--generation');

        pdfGen.innerHTML = `<h4>Extracted Questions and Answers</h4>
                            <button class="generate__pdf" >
                                <i class="fa-solid fa-download"></i>
                                <span>Get PDF</span>
                            </button>`;
                    
        qnaSection.appendChild(pdfGen);

        for(let i=0; i<response.length; i++){
            let qnaCont = document.createElement('div');
            qnaCont.classList.add('qna__container');
            qnaCont.classList.add('active');
            qnaCont.innerHTML = `<div class="qna--question">
                                ● ${response[i].original_question}
                                <span><i class="fa-solid fa-chevron-down active"></i></span>
                            </div>
                            
                            <div class="qna--answer active">
                                <div class="seprator"></div>
                                ${response[i].answer}
                            </div>`;

            qnaSection.appendChild(qnaCont);
        }

        qnaCont2.innerHTML = `<input type="text" name="questionInput" placeholder="Type your question to get answer (if available)" class="qna--getans">
                              <button class="btn--ans" onclick=handleGetAnswer()>Get Answer</button>`;
                            
        qnaSection.appendChild(qnaCont2);
        qna.appendChild(qnaSection);

        handleToggleActiveQnA();
        handleGeneratePDF2();
}

