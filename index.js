import axios from "axios";

try {
  //// criando uma instância do axios com o endereço base padrão
  const api = axios.create({
    baseURL: 'https://fakestoreapi.com'
  });



  //// pegando os 3 primeiros produtos da lista
  console.log("------------------- Obtendo a lista de produtos --------------------------");
  const productsResp = await api.get('/products');
  const topThree = productsResp.data.slice(0, 3);
  console.log("Os 3 primeiros produtos são:");
  console.log(topThree);



  // para criar o carrinho, precisamos do id do usuário
  // vamos usar o endpoint de listar usuários para isso, já que é o único que nos permite obter o usuário sem saber o id previamente
  // vamos considerar que o usuário já informou o email anteriormente e portanto já sabemos qual é
  console.log("------------------- Obtendo o id do usuário --------------------------");
  const email = "john@gmail.com";
  const usersResponse = await api.get('/users');
  const currentUser = usersResponse?.data?.find(user => user.email === email);

  // se o usuário não foi encontrado, não é possível continuar, e uma exceção deve ser lançada
  if (!currentUser) {
    throw new Error('Usuário não encontrado: ' + email);
  }

  console.log(currentUser);
  console.log(`id do usuário: ${currentUser?.id}`);



  // montando o payload e adicionando um novo carrinho, com os primeiros 3 produtos retornados
  console.log("------------------- Adicionando um novo carrinho --------------------------");
  const payload = {
    userId: currentUser.id, // o id do usuário que obtivemos
    products: topThree // os 3 primeiros produtos, no mesmo formato que foi retornado pelo endpoint de produtos,

    // id: não vamos passsar o id. Vamos deixar o próprio sistema decidir qual é o novo id e retorná-lo
    // products: topThree.map(p => ({ productId: p.id, quantity: 1 })): deveria haver um campo de quantidade, mas a documentação não menciona nada sobre isso
  };

  const cartResp = await api.post("/carts", payload);

  const newCartId = cartResp.data.id;
  console.log("id do carrinho criado:", newCartId);

}
catch (err) {
  // caso tenha havido algum erro, exibe o erro, distinguindo os casos mais comuns
  if (err.response) {
    console.error('A requisição não retornou sucesso:', err.response.status, err.response.statusText);
  } else if (err.request) {
    console.error('Algo deu errado durante a requisição:', err.message);
  } else {
    console.error('Erro:', err.message);
  }
}
