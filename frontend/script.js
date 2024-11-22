const apiBaseUrl = "http://localhost:8080/autores";

async function adicionarLivro() {
    const livro = {
        titulo: document.getElementById('titulo').value,
        autor: { id: document.getElementById('autor').value },
        categorias: Array.from(document.getElementById('categorias').selectedOptions).map(option => ({ id: option.value })),
        anoPublicacao: document.getElementById('anoPublicacao').value,
        editora: document.getElementById('editora').value
    };

    try {
        const response = await fetch('http://localhost:8080/livros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });

        if (response.ok) {
            alert('Livro cadastrado com sucesso!');
            carregarLivros(); // Recarregar lista de livros após adicionar
        } else {
            alert('Erro ao cadastrar livro');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao tentar cadastrar livro');
    }
}

async function carregarLivros() {
    try {
        const response = await fetch('http://localhost:8080/livros');
        const livros = await response.json();
        
        const livrosList = document.getElementById('livrosList');
        livrosList.innerHTML = ''; // Limpar lista antes de adicionar novos itens
        
        livros.forEach(livro => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${livro.titulo}</strong><br>
                Autor: ${livro.autor.nome}<br>
                Ano: ${livro.anoPublicacao}<br>
                Editora: ${livro.editora}<br>
                <button onclick="editarLivro(${livro.id})">Editar</button>
                <button onclick="excluirLivro(${livro.id})">Excluir</button>
            `;
            livrosList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

async function editarLivro(id) {
    try {
        const response = await fetch(`http://localhost:8080/livros/${id}`);
        const livro = await response.json();

        document.getElementById('titulo').value = livro.titulo;
        document.getElementById('autor').value = livro.autor.id;
        document.getElementById('anoPublicacao').value = livro.anoPublicacao;
        document.getElementById('editora').value = livro.editora;

        const form = document.getElementById('formLivro');
        form.onsubmit = function(event) {
            event.preventDefault();
            atualizarLivro(id);
        };

    } catch (error) {
        console.error('Erro ao buscar livro para editar:', error);
    }
}

async function atualizarLivro(id) {
    const livro = {
        titulo: document.getElementById('titulo').value,
        autor: { id: document.getElementById('autor').value },
        categorias: Array.from(document.getElementById('categorias').selectedOptions).map(option => ({ id: option.value })),
        anoPublicacao: document.getElementById('anoPublicacao').value,
        editora: document.getElementById('editora').value
    };

    try {
        const response = await fetch(`http://localhost:8080/livros/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });

        if (response.ok) {
            alert('Livro atualizado com sucesso!');
            carregarLivros();
        } else {
            alert('Erro ao atualizar livro');
        }
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        alert('Erro ao tentar atualizar livro');
    }
}

async function excluirLivro(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir este livro?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`http://localhost:8080/livros/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Livro excluído com sucesso!');
            carregarLivros(); 
        } else {
            alert('Erro ao excluir livro');
        }
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        alert('Erro ao tentar excluir livro');
    }
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#booksList tr');

    rows.forEach(row => {
        const title = row.cells[0].textContent.toLowerCase();
        const author = row.cells[1].textContent.toLowerCase();
        const publisher = row.cells[3].textContent.toLowerCase();

        if (title.includes(searchInput) || author.includes(searchInput) || publisher.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

window.onload = carregarLivros;