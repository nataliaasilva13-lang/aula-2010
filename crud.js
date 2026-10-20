// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyATf-moYltRwgRXwDoRI9BhcHW7koOahNM",
  authDomain: "aula-2010.firebaseapp.com",
  projectId: "aula-2010",
  storageBucket: "aula-2010.firebasestorage.app",
  messagingSenderId: "472511616693",
  appId: "1:472511616693:web:51bbb66afc62fc33f2d0fc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const botaoid = document.getElementById("person-id");
const botaoNome = document.getElementById("nome");
const botaoIdade = document.getElementById("idade");
const btnSubmit = document.getElementById("btn-submit");
const lista = document.getElementById("person-list");


async function carregarPessoas() {
    lista.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "people"));
    
    querySnapshot.forEach((docSnap) => {
        const pessoa = docSnap.data();
        const id = docSnap.id;

        const li = document.createElement("li");
        li.innerHTML = `
            <span><strong>${pessoa.name}</strong> - ${pessoa.age} anos</span>
            <div>
                <button onclick="prepararEdicao('${id}', '${pessoa.name}', '${pessoa.age}')">Editar</button>
                <button onclick="deletarPessoa('${id}')">Excluir</button>
            </div>
        `;
        lista.appendChild(li);
    });
}


btnSubmit.addEventListener("click", async () => {
    const nome = botaoNome.value;
    const idade = botaoIdade.value;
    const id = botaoid.value;

    if (nome === "" || idade === "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (id === "") {
        
        await addDoc(collection(db, "people"), { name: nome, age: Number(idade) });
    } else {
      
        const docRef = doc(db, "people", id);
        await updateDoc(docRef, { name: nome, age: Number(idade) });
        
        botaoid.value = "";
        btnSubmit.textContent = "Salvar";
    }

    botaoNome.value = "";
    botaoIdade.value = "";
    carregarPessoas();
});


window.deletarPessoa = async function(id) {
    if (confirm("Deseja mesmo excluir?")) {
        await deleteDoc(doc(db, "people", id));
        carregarPessoas();
    }
};


window.prepararEdicao = function(id, nome, idade) {
    botaoid.value = id;
    botaoNome.value = nome;
    botaoIdade.value = idade;
    btnSubmit.textContent = "Atualizar";
};

carregarPessoas();