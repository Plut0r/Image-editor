const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const previewImg = document.querySelector(".preview-img img");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetFilterBtn = document.querySelector(".reset-filter");
 
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0; // default values
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}


const loadImage = () => {
    let file = fileInput.files[0];  // getting user selected image
    if(!file) return // return back if user hasn't selected a file
    previewImg.src = URL.createObjectURL(file); // passing file url as preview img src
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click(); // clicking reset filter btn so the filter value resets when a user selects a new image
        document.querySelector('.container').classList.remove("disable");
    })
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => { // adding click events to all filter buttons
         document.querySelector(".filter .active").classList.remove("active");
         option.classList.add("active");
         filterName.innerText = option.innerText;

         if(option.id == 'brightness') {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
         } else if(option.id == "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
         } else if(option.id == "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
         } else if(option.id == "grayscale") {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
         }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); // getting selected filter btn

    if(selectedFilter.id == 'brightness') {
          brightness = filterSlider.value;
    } else if(selectedFilter.id == 'saturation') {
           saturation = filterSlider.value;
    } else if(selectedFilter.id == 'inversion') {
        inversion = filterSlider.value;
 } else {
       grayscale = filterSlider.value;
 }
    applyFilters();
}

rotateOptions.forEach(option => {
     option.addEventListener("click", () => { // adding click event listener to all rotate & flip buttons
     if(option.id == "left") {
        rotate -= 90; // if clicked btn is left rotate, decrement rotate value by -90
     } else if(option.id == "right") {
        rotate += 90;  // if clicked btn is right rotate, increment rotate value by 90
     } else if(option.id == "horizontal") {
        // if flipHorizontal is 1, set to -1 else set to 1
        flipHorizontal = flipHorizontal == 1 ? -1 : 1;  
     } else {
        // if flipVertical is 1, set to -1 else set to 1
        flipVertical = flipVertical == 1 ? -1 : 1;
     }
     applyFilters();
     });
});

const resetFilter = () => {
    // resetting all variable value to its default value
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click(); // clicking brightness btn, so the brightness is selected as default
    applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement("canvas"); // creating canvas element
    const ctx = canvas.getContext("2d"); // canvas.getContext returns a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; // setting canvas width to actual image width
    canvas.height = previewImg.naturalHeight; // setting canvas height to actual image height
     
    // applying user selected filter to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); // translating canvas from center
    if(rotate !== 0) { // if rotate value is not 0, rotate the canvas
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);  // flip canvas horizontally / vertically
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a"); // creating <a> element
    link.download = 'image.jpg'; // passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url
    link.click(); // clicking <a> tag so the image can download
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener('click', saveImage);
chooseImgBtn.addEventListener('click', () => fileInput.click());