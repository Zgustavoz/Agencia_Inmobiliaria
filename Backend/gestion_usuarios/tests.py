import requests
from pathlib import Path

# Crear una sesión para mantener las cookies
session = requests.Session()

# Login
response = session.post(
    "http://localhost:8000/gestion_usuarios/auth/login/",
    json={"username": "admin", "password": "Admin123#"}
)

print(f"Login Status: {response.status_code}")
print(f"Login Response: {response.json()}")

if response.status_code == 200:
    print("✅ Login exitoso!")
    print(f"Cookies recibidas: {session.cookies.get_dict()}")
    
    # Subir imagen (las cookies se envían automáticamente)
    try:
        # Buscar la imagen
        image_paths = [
            "./shared/z1.png",
            "../shared/z1.png",
            Path(__file__).parent / "shared" / "z1.png",
            Path(__file__).parent.parent / "shared" / "z1.png"
        ]
        
        image_path = None
        for path in image_paths:
            if Path(path).exists():
                image_path = path
                break
        
        if image_path:
            print(f"📸 Subiendo imagen desde: {image_path}")
            with open(image_path, "rb") as img:
                files = {"imagen": img}
                response_img = session.post(
                    "http://localhost:8000/gestion_usuarios/upload-image/",
                    files=files
                )
                print(f"Upload Status: {response_img.status_code}")
                print(f"Upload Response: {response_img.text}")
        else:
            print("❌ No se encontró la imagen en ninguna ubicación")
            print("Ubicaciones buscadas:")
            for path in image_paths:
                print(f"  - {path}")
                
    except Exception as e:
        print(f"❌ Error al subir imagen: {e}")
else:
    print(f"❌ Error en login: {response.status_code}")
    print(f"Response: {response.text}")