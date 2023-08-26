const imageInput = document.getElementById('imageInput');
const imageUploadForm = document.getElementById('imageUploadForm');
const outputDiv = document.getElementById('outputDiv');
const loadingIndicator = document.getElementById('loadingIndicator');
const valorSpan = document.getElementById('valor');
const cnpjSpan = document.getElementById('cnpj');
const razaoSocialSpan = document.getElementById('razaoSocial');
const naturezaJuridicaSpan = document.getElementById('naturezaJuridica');
const tipoEmpresaSpan = document.getElementById('tipoEmpresa');
const expenseFormContainer = document.querySelector('.expense-form-container');
const userSelect = document.getElementById('userSelect');
const expenseForm = document.getElementById('expenseForm');

imageUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];

    const reader = new FileReader();
    reader.onload = async function () {
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

            showToast('Sucesso ao chamar a API!', 'toast-success');

            const data = await response.json();


            const fileName = imageInput.files[0].name;


            const fileExtension = fileName.split('.').pop().toLowerCase();

            valorSpan.textContent = data.valor;
            cnpjSpan.textContent = data.infoPj.cnpj;
            razaoSocialSpan.textContent = data.infoPj.razaoSocial;
            naturezaJuridicaSpan.textContent = data.infoPj.naturezaJuridica;
            tipoEmpresaSpan.textContent = data.infoPj.tipoEmpresa;

            outputDiv.style.display = 'block';
            expenseFormContainer.style.display = 'block';
        } catch (error) {
            console.error('Erro:', error);
            showToast('Falha ao chamar a API.', 'toast-failure');
        } finally {
            loadingIndicator.classList.remove('active');
        }
    };

    reader.readAsDataURL(file);
});

// Função para carregar as matrículas dos usuários
async function loadUserMatriculas() {
    try {
        const response = await fetch('https://notaqui-backend-0b13dda23bf4.herokuapp.com/notaqui/api/v1/usuarios/buscar');
        const userData = await response.json();

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do usuário');
        }

        showToast('Dados de usuários carregados com sucesso!', 'toast-success');

        userData.forEach(user => {
            const option = document.createElement('option');
            option.value = user.matricula;
            option.textContent = `${user.nome} - ${user.cargo}`;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar dados dos usuários:', error);
        showToast('Falha ao carregar dados dos usuários.', 'toast-failure');
    }
}

loadUserMatriculas();

expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedUserMatricula = userSelect.value;
    const expenseAmount = parseFloat(document.getElementById('amount').value);


    const requestBody = {
        matricula: selectedUserMatricula,
        valor: valorSpan.textContent,
        anexo: null,
        cnpj: cnpjSpan.textContent,
        chaveAcesso: '0'
    };

    try {
        const response = await fetch('https://notaqui-backend-0b13dda23bf4.herokuapp.com/notaqui/api/v1/compras/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar despesa');
        }

        showToast('Despesa cadastrada com sucesso!', 'toast-success');

        console.log('Despesa cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar despesa:', error);

        showToast('Falha ao cadastrar despesa.', 'toast-failure');
    }
});

function showToast(message, styleClass) {
    const toastElement = document.getElementById('toastElement');
    toastElement.textContent = message;
    toastElement.className = `toast ${styleClass}`;
    toastElement.style.display = 'block';

    setTimeout(() => {
        toastElement.style.display = 'none';
    }, 2000);
}