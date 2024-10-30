async function addUser(event){
    event.preventDefault()
    
    console.log("reached......");

    let name =document.getElementById('name').value
    let email =document.getElementById('email').value
    let password =document.getElementById('password').value
    let imageInput =document.getElementById('image')
    let phoneno =document.getElementById('phoneno').value


    
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();

        
        reader.onloadend = async function () {
            base64ImageString = reader.result; 

            let data = {
                name,
                email,
                password,
                phoneno,
                image :base64ImageString,        

            }
        
            let strdata = JSON.stringify(data);
            console.log("strdata : ",strdata)
        
            try {
            
                let response = await fetch('/user',{
                    method : 'POST',
                    headers : {
                        "Content-Type" : "Application/json",
                    },
                    body : strdata,
        
                });
                console.log("response",response);
        
                if(response.status === 200){
                    alert('The otp send to email');
                    window.location=`otpVerify.html`
                }else{
                    alert('somthing went worg')
                }
            } catch (error) {
                console.log("error",error)
            }            
        }
        reader.readAsDataURL(file);
    }else{
        alert("Please select an image.");
    }

}

async function otpverification(event) {
    event.preventDefault(); 
    console.log("Reached at OTP verification...");

    let email = document.getElementById('email').value;
    
    // Collect all OTP inputs
    let otpElements = document.querySelectorAll('.input');
    let otp = Array.from(otpElements).map(input => input.value).join('');

    let data = {
        email,
        otp
    }

    let strdata = JSON.stringify(data);
    console.log("strdata: ", strdata);

    try {
        let response = await fetch('/verifyOtp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },  
            body: strdata
        });

        let responseData = await response.json();
        console.log("Response:", responseData);

        if (response.status === 200) {
            alert("User has been added successfully");
            window.location.href = 'userLogin.html';
        } else {
            alert("Something went wrong. Could not add user.");
        }

    } catch (error) {
        console.log("Error:", error);
        alert('An error occurred during OTP verification. Please try again.');
    }
}

async function userLogin(event){

    event.preventDefault();
    let email = document.getElementById('email').value

    let password = document.getElementById('password').value

    let data ={
        email,
        password
    }

   let strdata = JSON.stringify(data);
   console.log("strdata",strdata);
   
   try {
    let response = await fetch('/login',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : strdata
    });
    console.log('response',response);
    let parsed_Response = await response.json();
    console.log('parsed_Response : ',parsed_Response);

    let token_data = parsed_Response.data
    console.log("token_data : ",token_data);

    

    let token = token_data.token;

    let id =token_data.id;
    console.log("id",id)

    let token_key = id;
    
    
    localStorage.setItem(token_key, token);
    console.log("token_key",token_key)

    if(response.status ===200){
        alert('logined succssfully')
        
        window.location =`admin.html?login=${token_key}`
    }
    else if(user_type === "employee"){
        window.location = `main_view.html?login=${token_key}&id=${id}`
    }



   } catch (error) {
    console.log("error",error);
   }
 
}
    


