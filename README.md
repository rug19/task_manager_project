# 🗂️ Task Manager

Aplicação web interativa para gerenciamento de tarefas e grupos, desenvolvida com Spring Boot (Java) no backend e React no frontend.
O sistema permite organizar atividades de forma visual e intuitiva, facilitando o acompanhamento do progresso e o cumprimento de prazos.

Os usuários podem criar, editar, mover e excluir tarefas, bem como gerenciar grupos personalizados, tudo em uma interface moderna com suporte a drag and drop e alertas visuais para tarefas com data de entrega vencida.

---

## 📸 Prévia do sistema

![Tela Kanban](/frontend/src/assets/task_manager_foto.PNG)

## 🚀 Tecnologias utilizadas

### 🖥️ Frontend
- **React**
- **Vite**
- **Zustand** (para gerenciamento de estado)
- **Axios** (requisições HTTP)
- **Tailwind CSS**
- **DnD - kit** (drag and drop)

### ⚙️ Backend
- **Java**
- **Spring Boot**
- **Spring Web**
- **Spring Data JPA**
- **H2 Database**
- **Lombok**



## 📁 Estrutura do projeto
```
task-manager-app/
├── backend/ → API REST com Spring Boot
│ ├── src/
│ ├── pom.xml
│ └── README.md
│
├── frontend/ → Interface web em React
│ ├── src/
│ ├── package.json
│ └── README.md
│
└── README.md → Documentação principal

```
## 🧰 Requisitos
- Node.js 18+
- Java 17+
- Maven 3.8+

## ▶️ Como executar o projeto

### 🧩 1. Clonar o repositório
```bash
https://github.com/seuusuario/task_manager_project.git
cd task_manager_project

````

### ⚙️ 2. Rodar o backend
```bash
cd backend
mvn spring-boot:run

````

O servidor será iniciado em: http://localhost:8080

Console do H2 disponível em: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:task_db

User: sa

Password: (deixe em branco)

## 💻 3. Rodar o frontend

```bash
cd ../frontend
npm install
npm run dev

````
A aplicação abrirá em http://localhost:5173 (ou porta informada pelo Vite)

## 🧩 Funcionalidades

### 📋 Tarefas

- ✅ Criar novas tarefas

- ✏️ Editar tarefas existentes

- 🗑️ Excluir tarefas

- 🔄 Drag and Drop de tarefas entre grupos

- ⏰ Exibir aviso visual para tarefas com prazo vencido

- 📅 Definir datas de entrega das atividades

### 👥 Grupos

- 🧱 Criar novos grupos

- 🖊️ Editar título dos grupos existentes

- ❌ Excluir grupos



## 🧠 Endpoints principais (API REST)

📋 Atividades (/activities)

Método	Endpoint	Descrição

- GET	/activities	Lista todas as atividades
- POST	/activities	Cria uma nova atividade
- PUT	/activities/{id}	Atualiza uma atividade existente
- DELETE	/activities/{id}	Exclui uma atividade
- PUT	/activities/{activityId}/move/{newGroupId}	Move uma atividade para outro grupo

👥 Grupos (/groups)
Método	Endpoint	Descrição

 - GET	/groups	Lista todos os grupos
- POST	/groups	Cria um novo grupo
- DELETE	/groups/{id}	Exclui um grupo
- PATCH	/groups/{id}/title	Atualiza apenas o título do grupo

## 🧑‍💻 Autor

Ruan Gomes
- 📧 https://www.linkedin.com/in/ruan-gomes-a0b446187/



