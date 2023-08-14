const imageInput = document.getElementById('imageInput');
    const imageUploadForm = document.getElementById('imageUploadForm');
    const outputDiv = document.getElementById('outputDiv');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const valorSpan = document.getElementById('valor');
    const cnpjSpan = document.getElementById('cnpj');
    const razaoSocialSpan = document.getElementById('razaoSocial');
    const naturezaJuridicaSpan = document.getElementById('naturezaJuridica');
    const tipoEmpresaSpan = document.getElementById('tipoEmpresa');

    imageUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = imageInput.files[0];

        const reader = new FileReader();
        reader.onload = async function() {
            const base64Image = reader.result.split(',')[1];

            const payload = {
                conteudo: base64Image
            };

            try {
                loadingIndicator.classList.add('active');

                const response = await fetch('https://notaqui-backend-0b13dda23bf4.herokuapp.com/notaqui/api/v1/ocr/identificar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Erro ao chamar a API');
                }

                const data = await response.json();

                valorSpan.textContent = data.valor;
                cnpjSpan.textContent = data.infoPj.cnpj;
                razaoSocialSpan.textContent = data.infoPj.razaoSocial;
                naturezaJuridicaSpan.textContent = data.infoPj.naturezaJuridica;
                tipoEmpresaSpan.textContent = data.infoPj.tipoEmpresa;

                outputDiv.style.display = 'block';
            } catch (error) {
                console.error('Erro:', error);
            } finally {
                loadingIndicator.classList.remove('active');
            }
        };

        reader.readAsDataURL(file);
    });