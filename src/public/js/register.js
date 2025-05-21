document.addEventListener("DOMContentLoaded", () => {
    const formRegister = document.getElementById('registerForm');

    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formRegister);
        const userData = Object.fromEntries(formData);
        console.log(userData);
        try {
            const response = await fetch('http://localhost:8080/api/sessions/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            const data = await response.json();

            if (response.status === 201) {      
                Swal.fire({
                title: "Felicitaciones!!",
                text: "Tu usuario fue creado correctamente!",
                icon: "success",
                position: 'center',
                timer: 2000
                }).then( () =>{
                    e.target.reset()
                    window.location.href = "http://localhost:8080/api/sessions/viewLogin"; // Redirijo a la ruta inicial
                    })
            } else if(response.status === 401) {
                Swal.fire({
                    title: "Error",
                    text: "El usuario ya existe!",
                    icon: "error",
                    position: 'center',
                    timer: 2000
                }).then( () =>{
                    e.target.reset()
                    window.location.href = "http://localhost:8080/api/sessions/viewLogin"; // Redirijo a la ruta inicial
                    })
            }
            else {
                Swal.fire({
                    icon:'error',
                    title: 'Error',
                    position: 'center',
                    timer: 3000
                })
                console.log(data);
            }

            
        } catch (e) {
            console.log(e);
            Swal.fire({
                icon:'error',
                title: 'Error',
                text: "Error en la conexion, intenta nuevamente",
                position: 'center',
                timer: 3000
            })
        }
    })

})
