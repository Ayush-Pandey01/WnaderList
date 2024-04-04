const form =document.getElementById('form')
const title = document.getElementById('title');
const description = document.getElementById('description');
// const image = document.getElementById('image');
const price = document.getElementById('price');
const area = document.getElementById('area');
const country = document.getElementById('country');

form.addEventListener('submit', function(e){
    
    validateInputs();
    if(isValidForm() == true){
        form.submit();
    }else{
        e.preventDefault();
    }
});

function isValidForm(){
    const inputContainers = form.querySelectorAll('.input-control');
    let result =true;
    inputContainers.forEach((container)=>{
        if(container.classList.contains('error-boder')){
            result = false ;
        }
    });
    return result;
}


const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error-boder');
    inputControl.classList.remove('success');
    // form.add.att=onsubmit="preventDefault()";
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error-boder');
};

// const isValidEmail = email => {
//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }

const validateInputs = () => {
    const titleValue = title.value.trim();
    const descriptionValue = description.value.trim();
    const areaValue = area.value.trim();
    const priceValue = price.value.trim();
    const countryValue = country.value.trim();

    if(titleValue === '') {
        setError(title, 'title is required');
    } else {
        setSuccess(title);
    }
    if(descriptionValue === '') {
        setError(description, 'description is required');
    } else {
        setSuccess(description);
    }
 
    if(areaValue === '') {
        setError(area, 'Location is required');
    } else {
        setSuccess(area);
    }
    if(countryValue === '') {
        setError(country, 'country is required');
    } else {
        setSuccess(country);
    }

    if(priceValue == '' | priceValue ==undefined){
        setError(price,'Enter valid price')
    }
    else if(priceValue<0){
        setError(price, 'Price can not be negative');
    }else{
        setSuccess(price);
    }

    // if(emailValue === '') {
    //     setError(email, 'Email is required');
    // } else if (!isValidEmail(emailValue)) {
    //     setError(email, 'Provide a valid email address');
    // } else {
    //     setSuccess(email);
    // }

    // if(passwordValue === '') {
    //     setError(password, 'Password is required');
    // } else if (passwordValue.length < 8 ) {
    //     setError(password, 'Password must be at least 8 character.')
    // } else {
    //     setSuccess(password);
    // }

    // if(password2Value === '') {
    //     setError(password2, 'Please confirm your password');
    // } else if (password2Value !== passwordValue) {
    //     setError(password2, "Passwords doesn't match");
    // } else {
    //     setSuccess(password2);
    // }

};