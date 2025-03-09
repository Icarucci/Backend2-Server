document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById('loginForm');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/sessions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
                credentials: "include"
            });

            const data = await response.json();

            if (response.status === 200) {      
                Swal.fire({
                title: "Bienvenido",
                text: "Usuario logueado correctamente!",
                icon: "success",
                position: 'center',
                timer: 2000
                }).then( () =>{
                    e.target.reset()
                    window.location.href = "http://localhost:8080/api/products"; // Redirijo a la ruta inicial
                    })
            } else if(response.status === 401) {
                Swal.fire({
                    title: "Error",
                    text: "Usuario o contraseña no validos!",
                    icon: "error",
                    position: 'center',
                    timer: 2000
                }).then( () =>{
                    e.target.reset()
                    console.log(data);
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
                text: "Error en a conexion, intenta nuevamente",
                position: 'center',
                timer: 3000
            })
        }
    })

})
